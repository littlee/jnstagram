var J = require('../J.js');

module.exports = {
	onEnter: J.redirectToSignin,
	childRoutes: [
		{
			path: 'search',
			getComponent: function(location, cb) {
				require.ensure([], function(require) {
					cb(null, require('../components/Search.js'));
				});
			}
		}
	]
};
