var express = require('express');
var passport = require('passport');
var router = express.Router();
var User = require('../models/User.js');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

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

router.post('/signup', function(req, res) {
	var u = new User();
	u.username = req.body.username;
	u.password = req.body.password;
	u.save(function(err) {
		if (err) throw err;
		res.json(u);
	});
});

module.exports = router;
