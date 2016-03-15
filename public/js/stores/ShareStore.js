var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var EventEmitter = require('events').EventEmitter;
var ActionTypes = require('../constants/ActionTypes.js');
var assign = require('lodash/object/assign.js');
var CHANGE_EVENT = 'change';

var _data = {
	post: {
		src: '',
		filter: '',
		blur: 0,
		brightness: 1,
		contrast: 1,
		hueRotate: 0,
		saturate: 1
	},
	location: '获取地址中...'
};

function _setPost(p) {
	_data.post = p;
}

function _setLocation(l) {
	_data.location = l;
}
var ShareStore = assign({}, EventEmitter.prototype, {
	emitChange: function() {
		this.emit(CHANGE_EVENT);
	},

	addChangeListener: function(cb) {
		this.on(CHANGE_EVENT, cb);
	},

	removeChangeListener: function(cb) {
		this.removeListener(CHANGE_EVENT, cb);
	},

	getPost: function() {
		return _data.post;
	},

	getLocation: function() {
		return _data.location;
	}
});

ShareStore.dispatchToken = AppDispatcher.register(function(action) {
	switch (action.type) {
		case ActionTypes.SHARE_RECEIVE_POST:
			_setPost(action.post);
			ShareStore.emitChange();
			break;

		case ActionTypes.SHARE_RECEIVE_LOCATION:
			_setLocation(action.location);
			ShareStore.emitChange();
			break;
		default:
	}
});

module.exports = ShareStore;