var express = require('express');
var passport = require('passport');
var multer = require('multer');
var jwt = require('jsonwebtoken');

var router = express.Router();
var User = require('../models/User.js');
var Post = require('../models/Post.js');
var Comment = require('../models/Comment.js');

var JSocket = require('../j.socket.js');

var JWT_PUBLIC_KEY = 'J_JWT_PUBLIC_KEY';

function validateJWT(t, cb) {
	return jwt.verify(t, JWT_PUBLIC_KEY, function(err, decode) {
		cb(err, decode);
	});
}

module.exports = function() {

	var storage = multer.diskStorage({
		destination: function(req, file, cb) {
			cb(null, 'public/uploads');
		},
		filename: function(req, file, cb) {
			var name = file.originalname;
			var dot = name.lastIndexOf('.');
			cb(null, name.slice(0, dot) + '-' + new Date().getTime() + name.slice(dot));
		}
	});

	var upload = multer({
		storage: storage
	});

	// var fileUpload = upload.single('file');
	var fileUpload = upload.array('file', 1);

	router.post('/signin', function(req, res, next) {
		passport.authenticate('local', function(err, user, info) {
			if (err) {
				return next(err);
			}

			if (!user) {
				return res.json({
					success: false,
					info: info
				});
			}

			req.login(user, function(err) {
				if (err) {
					return next(err);
				}

				var u = {
					_id: user._id,
					username: user.username
				};
				var token = jwt.sign(u, JWT_PUBLIC_KEY);

				return res.json({
					success: true,
					info: info,
					user: u,
					token: token
				});
			});
		})(req, res, next);
	});

	router.post('/signup', function(req, res, next) {
		var u = new User();
		u.username = req.body.username;
		u.password = req.body.password;

		if (req.body.profile_pic) {
			u.profile_pic = req.body.profile_pic;
		}

		User.findOne({
			'username': u.username
		}, function(err, fu) {
			if (err) {
				return next(err);
			}

			if (fu === null) {
				u.save(function(err) {
					if (err) {
						return next(err);
					}

					res.json({
						success: true,
						user: u
					});
				});
			} else {
				res.json({
					success: false,
					message: '用户名已被使用'
				});
			}
		});
	});

	router.post('/ajaxupload', function(req, res) {
		fileUpload(req, res, function(err) {
			if (err) {
				res.json({
					success: false,
					message: '上传失败'
				});
				return;
			}
			res.json({
				success: true,
				filename: req.files[0].path.replace(/public/, '')
			});
		});
	});

	router.post('/share', function(req, res, next) {
		function captionToTags(c) {
			var m = c.match(/(^|(\W))(#[a-z\d][\w-]*)/ig);

			if (m === null) {
				return [];
			}

			m = m.map(function(item) {
				return item.trim().slice(1);
			});

			return m;
		}

		validateJWT(req.headers['jwt'], function(err, decode) {
			if (err) {
				console.log(err);
				res.status(401).json({
					success: false
				});
				return;
			}
			var p = new Post();
			p.src = req.body.src;
			p.filter = req.body.filter;
			p.setting = req.body.setting;
			p.caption = req.body.caption || '';
			p.location = req.body.location;
			p.author = decode._id;
			p.tags = captionToTags(p.caption);

			p.save(function(err) {
				if (err) {
					return next(err);
				}

				Post
					.findOne({
						_id: p._id
					})
					.populate('author', {
						username: 1,
						profile_pic: 1
					})
					.exec(function(err, post) {
						if (err) {
							return next(err);
						}
						JSocket.emit('new-post', post);
						res.json({
							success: true,
							post: post
						});
					});

				User.update({
					_id: decode._id
				}, {
					'$push': {
						'posts': p._id
					}
				}, function(err) {
					if (err) {
						return next(err);
					}
				});
			});
		});

	});

	router.get('/decodejwt', function(req, res) {
		validateJWT(req.headers['jwt'], function(err, decode) {
			if (err) {
				res.json({
					success: false
				});
				return;
			}

			res.json({
				success: true,
				user: {
					_id: decode._id,
					username: decode.username
				}
			});
		});
	});

	router.get('/latestposts', function(req, res, next) {

		Post
			.find({})
			.populate('author', {
				username: 1,
				profile_pic: 1
			})
			.populate({
				path: 'comments',
				select: 'author text',
				populate: {
					path: 'author',
					select: 'username profile_pic'
				}
			})
			.sort({
				post_time: -1
			})
			.limit(20)
			.exec(function(err, posts) {
				if (err) {
					return next(err);
				}

				res.json({
					success: true,
					posts: posts
				});
			});
	});

	router.get('/trending', function(req, res, next) {
		validateJWT(req.headers['jwt'], function(err) {
			if (err) {
				console.log(err);
				res.status(401).json({
					success: false
				});
				return;
			}

			Post
				.find({})
				.sort({
					'likes_count': -1
				})
				.limit(10)
				.exec(function(err, posts) {
					if (err) {
						return next(err);
					}

					res.json({
						success: true,
						posts: posts
					});
				});
		});

	});

	router.post('/like', function(req, res, next) {
		validateJWT(req.headers['jwt'], function(err, decode) {
			if (err) {
				console.log(err);
				res.status(401).json({
					success: false
				});
				return;
			}

			var uid = decode._id;
			var pid = req.body.postId;

			Post
				.findOne({
					_id: pid
				})
				.populate('author', {
					username: 1,
					profile_pic: 1
				})
				.populate({
					path: 'comments',
					select: 'author text',
					populate: {
						path: 'author',
						select: 'username profile_pic'
					}
				})
				.exec(function(err, p) {
					if (err) {
						return next(err);
					}

					var uIndex = p.likes.indexOf(uid);

					if (uIndex === -1) {
						p.likes.push(uid);
						var c = new Comment();
						c.post = pid;
						c.author = uid;
						c.save(function(err) {
							if (err) {
								return next(err);
							}
							p.likes_count = p.likes.length;
							p.save(function(err, p) {
								res.json({
									success: true,
									post: p
								});
							});
						});
					} else {
						p.likes.splice(uIndex, 1);
						Comment.remove({
							post: pid,
							author: uid,
							text: '点了一个赞'
						}, function(err) {
							if (err) {
								return next(err);
							}
							p.likes_count = p.likes.length;
							p.save(function(err, p) {
								res.json({
									success: true,
									post: p
								});
							});
						});
					}
				});

		});
	});

	router.get('/getcomments/:postId', function(req, res, next) {
		validateJWT(req.headers['jwt'], function(err) {
			if (err) {
				console.log(err);
				res.status(401).json({
					success: false
				});
				return;
			}

			var pid = req.params.postId;

			Comment
				.find({
					post: pid
				})
				.populate('author', {
					username: 1,
					profile_pic: 1
				})
				.sort({
					create_time: 1
				})
				.exec(function(err, c) {
					if (err) {
						return next(err);
					}

					res.json({
						success: true,
						comments: c
					});
				});
		});

	});

	router.post('/postcomment', function(req, res, next) {
		validateJWT(req.headers['jwt'], function(err, decode) {
			if (err) {
				console.log(err);
				res.status(401).json({
					success: false
				});
				return;
			}

			var c = new Comment();
			c.post = req.body.post;
			c.author = decode._id;
			c.text = req.body.text;

			c.save(function(err) {
				if (err) {
					return next(err);
				}

				Post.findByIdAndUpdate(c.post, {
					$push: {
						comments: c._id
					}
				}, function(err) {

					if (err) {
						return next(err);
					}

					res.json({
						success: true,
						comment: c
					});
				});
			});
		});
	});

	router.get('/userprofile/:username', function(req, res, next) {
		validateJWT(req.headers['jwt'], function(err) {
			if (err) {
				console.log(err);
				res.status(401).json({
					success: false
				});
				return;
			}

			User
				.findOne({
					username: req.params.username
				}, {
					username: 1,
					profile_pic: 1,
					posts: 1
				})
				.populate('posts', {
					src: 1,
					filter: 1,
					setting: 1
				}, null, {
					sort: {
						post_time: -1
					}
				})
				.exec(function(err, u) {
					if (err) {
						return next(err);
					}

					if (!u) {
						res
							.status(404)
							.json({
								success: false,
								user: null
							});
						return;
					}

					res.json({
						success: true,
						user: u
					});
				});
		});
	});

	router.get('/getmessage', function(req, res, next) {
		validateJWT(req.headers['jwt'], function(err, decode) {
			if (err) {
				console.log(err);
				res.status(401).json({
					success: false
				});
				return;
			}

			var uid = decode._id;

			User
				.findOne({
					_id: uid
				}, function(err, u) {

					Comment
						.find({
							post: {
								'$in': u.posts
							}
						})
						.populate('author', {
							username: 1,
							profile_pic: 1
						})
						.populate('post', {
							src: 1,
							filter: 1,
							setting: 1
						})
						.sort({
							create_time: -1
						})
						.exec(function(err, m) {
							if (err) {
								return next(err);
							}

							res.json({
								success: true,
								message: m
							});
						});

				});
		});
	});

	router.get('/s', function(req, res, next) {
		validateJWT(req.headers['jwt'], function(err) {
			if (err) {
				console.log(err);
				res.status(401).json({
					success: false
				});
				return;
			}

			var keyword = req.query.q;
			console.log(keyword);

			Post
				.find({
					caption: new RegExp(keyword)
				}, function(err, p) {
					if (err) {
						return next(err);
					}

					res.json({
						success: true,
						posts: p
					});
				});
		});
	});

	return router;

};
