function isSignedIn() {
	var a = false;
	// a = true;
	return a;
}

var J = {};

// J.redirectToSignin = function(nextState, replace) {
// 	if (!isSignedIn()) {
// 		replace({
// 			pathname: '/signin',
// 			nextPathname: nextState.location.pathname
// 		});
// 	}
// };

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

module.exports = J;