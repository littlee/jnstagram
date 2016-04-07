var browserHistory = require('react-router').browserHistory;

function isSignedIn() {
	// return true;
	// return sessionStorage.getItem('j_user') !== null;
	return localStorage.getItem('jwt') !== null;
}

var J = {};

J.redirectToSignin = function(nextState, replace) {
	if (!isSignedIn()) {
		replace({
			pathname: '/signin',
			state: {
				nextPathname: nextState.location.pathname
			}
		});
	}
};

J.auth = function() {
	return function(req) {
		req.on('response', function(res) {
			if (res.status === 401) {
				// push or replace
				var p = window.location.pathname;
				setTimeout(function() {
					browserHistory.replace({
						pathname: '/signin',
						state: {
							nextPathname: p
						}
					});
				}, 0);
			}
		});
	};
};

J.getToken = function() {
	return localStorage.getItem('jwt');
};

module.exports = J;