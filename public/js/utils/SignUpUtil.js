var request = require('superagent');
module.exports = {
	signup: function(user, cb) {
		request
			.post('/signup')
			.send(user)
			.end(function(err, res) {
				if (err) {
					throw err;
				}

				cb(res.body);
			});
	}
};