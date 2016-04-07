require('../../less/user.less');
var React = require('react');
var browserHistory = require('react-router').browserHistory;

var UserStore = require('../stores/UserStore.js');
var UserUtil = require('../utils/UserUtil.js');

var Header = require('./Header.js');
var MenuBtns = require('./MenuBtns.js');
var PostItem = require('./PostItem.js');

function getStateFromStores() {
	return UserStore.getData();
}

var UserBtn = React.createClass({
	render: function() {
		var n = JSON.parse(localStorage.getItem('j_user')).username;
		if (this.props.username !== n) {
			return null;
		}
		return (
			<div className="user-btn-wrap">
				<button type="button" className="btn btn-danger btn-block" onClick={this._signOut}>
					退出当前账号
				</button>
			</div>
			);
	},

	_signOut: function() {
		localStorage.removeItem('j_user');
		localStorage.removeItem('jwt');
		browserHistory.replace({
			pathname: '/signin'
		});
	}
});

var User = React.createClass({
	getInitialState: function() {
		return getStateFromStores();
	},

	componentDidMount: function() {
		UserStore.addChangeListener(this._onChange);
		UserUtil.getUser(this.props.params.username);
	},

	componentWillUnmount: function() {
		UserStore.removeChangeListener(this._onChange);
	},

	render: function() {
		var posts = this.state.posts.map(function(item, index) {
			return (
				<PostItem key={index} filter={item.filter} src={item.src} setting={item.setting}/>
				);
		});
		return (
			<div className="row">
				<div className="col-xs-12 trim-col">
					<Header />

					<div className="user">
						<div className="user-avatar">
							<img src={this.state.profile_pic} width="100" height="100"/>
							<div className="user-name">
								{this.state.username}
							</div>
						</div>

						<div className="user-posts">
							{posts}
						</div>

						<UserBtn username={this.props.params.username}/>
					</div>

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