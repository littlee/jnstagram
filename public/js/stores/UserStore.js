var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var EventEmitter = require('events').EventEmitter;
var ActionTypes = require('../constants/ActionTypes.js');
var assign = require('lodash/object/assign.js');
var CHANGE_EVENT = 'change';

var _data = {
	username: '',
	profile_pic: '',
	posts: []
};

function _setData(u) {
	_data = u;
}

var UserStore = assign({}, EventEmitter.prototype, {
	emitChange: function() {
		this.emit(CHANGE_EVENT);
	},

	addChangeListener: function(cb) {
		this.on(CHANGE_EVENT, cb);
	},

	removeChangeListener: function(cb) {
		this.removeListener(CHANGE_EVENT, cb);
	},

	getData: function() {
		return _data;
	}

});

UserStore.dispatchToken = AppDispatcher.register(function(action) {
	switch (action.type) {
	case ActionTypes.USER_RECEIVE_USER:
		_setData(action.user);
		UserStore.emitChange();
		break;
	default:
	}
});

module.exports = UserStore;