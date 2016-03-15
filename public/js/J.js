function isSignedIn() {
	// return true;
	return sessionStorage.getItem('j_user') !== null;
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

module.exports = J;