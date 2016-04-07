var request = require('superagent');

var J = require('../J.js');
module.exports = {
	getMessage: function(cb) {
		request
			.get('/getmessage')
			.set('jwt', J.getToken())
			.use(J.auth())
			.end(function(err, res) {
				if (err) {
					return err;
				}

				cb(res.body);
			});
	}
};