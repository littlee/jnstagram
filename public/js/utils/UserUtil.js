var request = require('superagent');
var UserActionCreators = require('../actions/UserActionCreators.js');

var J = require('../J.js');
module.exports = {
	getUser: function(username) {
		request
			.get('/userprofile/' + username)
			.use(J.auth())
			.end(function(err, res) {
				if (err) {
					return err;
				}

				UserActionCreators.receiveUser(res.body);
			});

	}
};