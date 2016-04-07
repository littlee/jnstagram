var request = require('superagent');

var J = require('../J.js');

module.exports = {
	getLatestPost: function(cb) {
		request
			.get('/latestposts')
			.end(function(err, res) {
				if (err) {
					return err;
				}

				cb(res.body);
			});
	},

	toggleLike: function(data, cb) {
		request
			.post('/like')
			.set('jwt', J.getToken())
			.use(J.auth())
			.send(data)
			.end(function(err, res) {
				if (err) {
					return err;
				}

				cb(res.body);
			});
	}
};