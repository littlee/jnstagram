var ShareActionCreators = require('../actions/ShareActionCreators.js');
module.exports = {
	getPost: function() {
		setTimeout(function() {
			var jPost = JSON.parse(localStorage.getItem('j_post'));
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
	}
};