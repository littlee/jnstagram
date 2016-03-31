var J = require('../J.js');

module.exports = {
	onEnter: J.redirectToSignin,
	childRoutes: [
		{
			path: 'user/:username',
			getComponent: function(location, cb) {
				require.ensure([], function(require) {
					cb(null, require('../components/User.js'));
				});
			}
		}
	]
};
