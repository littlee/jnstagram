var Server = require('socket.io');

function JSocket() {
	var io = null;

	return {
		init: function(server) {
			io = new Server(server);
		},

		on: function(event, cb) {
			if (io === null) {
				new Error('socket should be initialize');
				return;
			}

			io.on(event, cb);
		},

		emit: function(event, data) {
			if (io === null) {
				new Error('socket should be initialize');
				return;
			}
			io.emit(event, data);
		}
	};
}

module.exports = exports = new JSocket();