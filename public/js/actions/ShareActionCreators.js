var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var ActionTypes = require('../constants/ActionTypes.js');

module.exports = {
	receivePost: function(post) {
		AppDispatcher.dispatch({
			type: ActionTypes.SHARE_RECEIVE_POST,
			post: post
		});
	},

	receiveLocation: function(loc) {
		AppDispatcher.dispatch({
			type: ActionTypes.SHARE_RECEIVE_LOCATION,
			location: loc
		});
	}
};