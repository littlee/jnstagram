var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var ActionTypes = require('../constants/ActionTypes.js');

module.exports = {
	receiveUser: function(user) {
		AppDispatcher.dispatch({
			type: ActionTypes.USER_RECEIVE_USER,
			user: user
		});
	}
};