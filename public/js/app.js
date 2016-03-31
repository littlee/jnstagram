require('../css/bootstrap.css');
require('../css/cssgram.min.css');
require('../less/J.less');

var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router').Router;
var browserHistory = require('react-router').browserHistory;

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
			require('./routes/Post.js'),
			require('./routes/Share.js'),
			require('./routes/User.js'),
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