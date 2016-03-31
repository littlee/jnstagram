require('../../less/signin.less');
var React = require('react');
var Link = require('react-router').Link;
var browserHistory = require('react-router').browserHistory;

var fto = require('form_to_object');
var SignInUtil = require('../utils/SignInUtil.js');

var SignIn = React.createClass({

	// childContextType: {
	// 	location: React.PropTypes.object
	// },

	// getChildContext: function(){
	// 	return {
	// 		location: this.props.location
	// 	};
	// },

	getInitialState: function() {
		return {
			alert: null
		};
	},

	componentDidMount: function() {
		var nClass = document.body.className + ' gg';
		document.body.className = nClass.trim();

		var root = document.getElementsByTagName('html')[0];
		root.style.height = '100%';
	},

	componentWillUnmount: function() {
		document.body.className = document.body.className.replace(/(?:^|\s)gg(?!\S)/g, '');
	},

	render: function() {
		return (
			<div className="row">
				<div className="col-xs-12">
					<div className="signin">
						<div className="signin-logo">
							<img src="/images/logo_165_60.png" className="img-responsive center-block"/>
						</div>

						<div className="signin-form">
							<form onSubmit={this._handleSignIn}>
								<div className="form-group">
									<input type="text" name="username" className="form-control signin-input" placeholder="用户名"/>
								</div>
								<div className="form-group">
									<input type="password" name="password" className="form-control signin-input" placeholder="密码" />
								</div>

								{
									this.state.alert ?
									<div className="alert alert-danger">
										{this.state.alert}
									</div>
									:
									null
								}
								<div className="form-group">
									<button type="submit" className="btn btn-block signin-btn">
										登录
									</button>
								</div>
							</form>
						</div>

						<div className="signin-footer">
							还没有账户？
							<Link to="/signup" className="signin-link">
								<strong>注册</strong>
							</Link>
						</div>
					</div>
				</div>
			</div>
			);
	},

	_handleSignIn: function(e) {
		e.preventDefault();
		var data = fto(e.target);
		SignInUtil.signin(data, function(res) {
			if (res.success) {
				SignInUtil.saveUser(res.user);
				if (this.props.location.state && this.props.location.state.nextPathname) {
					browserHistory.replace({
						pathname: this.props.location.state.nextPathname
					});
					return;
				}
				browserHistory.replace({
					pathname: '/'
				});
				return;
			}

			alert(res.info.message);
		}.bind(this));
		return false;
	}
});

module.exports = SignIn;