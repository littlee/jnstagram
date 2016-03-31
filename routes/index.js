var express = require('express');
var passport = require('passport');
var multer = require('multer');
var jwt = require('jsonwebtoken');

var router = express.Router();
var User = require('../models/User.js');
var Post = require('../models/Post.js');

var JSocket = require('../j.socket.js');

var JWT_PUBLIC_KEY = 'J_JWT_PUBLIC_KEY';

function validateJWT(t) {
	return jwt.verify(t, JWT_PUBLIC_KEY);
}

// module.exports = router;
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
		storage: storage,
		fileFilter: function(req, file, cb) {
			if (/\.(png|jpg)$/.test(file.originalname)) {
				cb(null, true);
			} else {
				cb(null, false);
			}
		}
	});

	var fileUpload = upload.single('file');

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

	router.get('/signout', function(req, res) {
		req.logout();
		res.json({
			success: true
		});
	});

	router.get('/signedin', function(req, res) {
		if (req.isAuthenticated()) {
			res.json({
				success: true,
				user: {
					_id: req.user._id,
					username: req.user.username
				}
			});
			return;
		}
		res.json({
			success: false,
			user: null
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
				filename: req.file.path.replace(/public/, '')
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

		if (req.isAuthenticated()) {
			var p = new Post();
			p.src = req.body.src;
			p.filter = req.body.filter;
			p.setting = req.body.setting;
			p.caption = req.body.caption || '';
			p.location = req.body.location;
			p.author = req.user._id;
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
					_id: req.user._id
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
		} else {
			res.status(401).json({
				success: false
			});
		}
	});

	router.get('/latestposts', function(req, res, next) {

		Post
			.find({})
			.populate('author', {
				username: 1,
				profile_pic: 1
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

	router.post('/like', function(req, res, next) {

		if (req.isAuthenticated()) {
			var uid = req.user._id;
			var pid = req.body.postId;

			Post
				.findOne({
					_id: pid
				})
				.populate('author', {
					username: 1,
					profile_pic: 1
				})
				.exec(function(err, p) {
					if (err) {
						return next(err);
					}

					var uIndex = p.likes.indexOf(uid);

					if (uIndex === -1) {
						console.log('push likes');
						p.likes.push(uid);
					} else {
						console.log('pull likes');
						p.likes.splice(uIndex, 1);
					}

					p.save(function(err, p) {
						res.json({
							success: true,
							post: p
						});
					});
				});
		} else {
			res.status(401).json({
				success: false
			});
		}
	});

	router.get('/userprofile/:username', function(req, res, next) {

		if (req.isAuthenticated()) {
			User
				.findOne({
					username: req.params.username
				})
				.populate('posts', {
					src: 1,
					filter: 1,
					setting: 1
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
		} else {
			res.status(401).json({
				success: false
			});
		}

	});

	return router;

};
