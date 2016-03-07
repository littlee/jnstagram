var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/User.js');

module.exports = function() {
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

	passport.use(new LocalStrategy(function(username, password, done) {
		User.findOne({
			username: username
		}, function(err, user) {
			if (err) {
				return done(err);
			}

			if (!user) {
				return done(null, false, {
					message: '用户名不正确'
				});
			}

			// salt!!!
			if (user.password !== password) {
				return done(null, false, {
					message: '密码不正确'
				});
			}

			return done(null, user);
		});
	}));
};