require('../../less/user.less');
var React = require('react');

var UserStore = require('../stores/UserStore.js');
var UserUtil = require('../utils/UserUtil.js');

var Header = require('./Header.js');
var MenuBtns = require('./MenuBtns.js');

function getStateFromStores() {
	return UserStore.getData();
}

var User = React.createClass({
	getInitialState: function() {
		return getStateFromStores();
	},

	componentDidMount: function() {
		UserStore.addChangeListener(this._onChange);
		UserUtil.getUser(JSON.parse(sessionStorage.getItem('j_user')).username);
	},

	componentWillUnmount: function() {
		UserStore.removeChangeListener(this._onChange);
	},

	render: function() {
		return (
			<div className="row">
				<div className="col-xs-12 trim-col">
					<Header />
					<h1>{this.state.username}</h1>
					<MenuBtns />
				</div>
			</div>
			);
	},

	_onChange: function() {
		this.setState(getStateFromStores());
	}
});

module.exports = User;