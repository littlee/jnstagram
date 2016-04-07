var request = require('superagent');
var ShareActionCreators = require('../actions/ShareActionCreators.js');

var J = require('../J.js');

module.exports = {
	getPost: function() {
		setTimeout(function() {
			var jPost = JSON.parse(sessionStorage.getItem('j_post'));
			var p = {};
			p.src = jPost.previewSrc;
			p.filter = jPost.filter;
			p.blur = jPost.blur;
			p.brightness = jPost.brightness;
			p.contrast = jPost.contrast;
			p.hueRotate = jPost.hueRotate;
			p.saturate = jPost.saturate;

			ShareActionCreators.receivePost(p);
		}, 0);
	},

	removePost: function() {
		sessionStorage.removeItem('j_post');
	},

	getLocation: function() {
		navigator.geolocation.getCurrentPosition(function(position) {
			window.AMap.service('AMap.Geocoder', function() {
				var geocoder = new window.AMap.Geocoder({
					city: '010'
				});
				var lnglatXY = [position.coords.longitude, position.coords.latitude];
				geocoder.getAddress(lnglatXY, function(status, result) {
					if (status === 'complete' && result.info === 'OK') {
						var loc = result.regeocode.addressComponent.city + ' - '
								+ result.regeocode.addressComponent.district + ' - '
								+ result.regeocode.addressComponent.township;
						ShareActionCreators.receiveLocation(loc);
					} else {
						ShareActionCreators.receiveLocation('获取地址失败!');
					}
				});
			});
		});
	},

	sendPost: function(data, cb) {
		request
			.post('/share')
			.set('jwt', J.getToken())
			.use(J.auth())
			.send(data)
			.end(function(err, res) {
				cb(res.body);
			});
	}
};