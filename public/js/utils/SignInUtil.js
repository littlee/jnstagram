var request = require('superagent');
module.exports = {
	signin: function(user, cb) {
		request
			.post('/signin')
			.send(user)
			.end(function(err, res) {
				if (err) {
					throw err;
				}

				cb(res.body);
			});
	},

	saveUser: function(user) {
		localStorage.setItem('j_user', JSON.stringify(user));
	},

	saveToken: function(t) {
		localStorage.setItem('jwt', t);
	}
};