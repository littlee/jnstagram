var request = require('superagent');

var J = require('../J.js');

module.exports = {
	getTrend: function(cb) {
		request
			.get('/trending')
			.set('jwt', J.getToken())
			.use(J.auth())
			.end(function(err, res) {
				if (err) {
					return err;
				}

				cb(res.body);
			});
	},

	search: function(q, cb){
		request
			.get('/s')
			.set('jwt', J.getToken())
			.use(J.auth())
			.query({
				q: q
			})
			.end(function(err, res) {
				if (err) {
					return err;
				}

				cb(res.body);
			});
	}
};