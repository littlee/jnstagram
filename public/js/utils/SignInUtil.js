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
	}
};