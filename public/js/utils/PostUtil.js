var request = require('superagent');
module.exports = {
	savePostData: function(pd) {
		localStorage.setItem('j_post', JSON.stringify(pd));
	},

	uploadImage: function(fd, cb) {
		request
			.post('/ajaxupload')
			.send(fd)
			.end(function(err, res) {
				if (err) {
					throw err;
				}

				cb(res.body);
			});
	}

};