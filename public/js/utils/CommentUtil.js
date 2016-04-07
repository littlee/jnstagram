var request = require('superagent');

var J = require('../J.js');
module.exports = {
	getComments: function(id, cb) {
		request
			.get('/getcomments/' + id)
			.set('jwt', J.getToken())
			.use(J.auth())
			.end(function(err, res) {
				if (err) {
					return err;
				}

				cb(res.body);
			});
	},

	postComment: function(data, cb) {
		request
			.post('/postcomment')
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