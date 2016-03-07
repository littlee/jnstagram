require('../css/bootstrap.css');
require('cssgram/source/css/cssgram.css');

var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router').Router;
var browserHistory = require('react-router').browserHistory;

var J = require('./J.js');

var rootRoute = {
	component: 'div',
	childRoutes: [{
		path: '/',
		component: require('./components/App.js'),
		indexRoute: {
			component: require('./components/Live.js')
		},
		childRoutes: [
			require('./routes/SignIn.js'),
			require('./routes/SignUp.js'),
			require('./routes/Search.js'),
			{
				path: '*',
				component: require('./components/NotFound.js')
			}
		]
	}]
};

ReactDOM.render(
	<Router history={browserHistory} routes={rootRoute} />,
	document.getElementById('app')
);