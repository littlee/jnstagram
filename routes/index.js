var express = require('express');
var passport = require('passport');
var multer = require('multer');
var router = express.Router();
var User = require('../models/User.js');

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
		if (/.(png|jpg)$/.test(file.originalname)) {
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
				info: info,
				user: user
			});
		}

		req.login(user, function(err) {
			if (err) {
				return next(err);
			}

			return res.json({
				success: true,
				info: info,
				user: user
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

	User.findOne({'username': u.username}, function(err, fu) {
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
		}
		else {
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
			filename: req.file.path.replace(/public/, '')
		});
	});
});

module.exports = router;
