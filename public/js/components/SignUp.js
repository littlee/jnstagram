require('../../less/signup.less');
var React = require('react');
var Link = require('react-router').Link;
var browserHistory = require('react-router').browserHistory;

var fto = require('form_to_object');
var SignUpUtil = require('../utils/SignUpUtil.js');

var SignUpAvatar = React.createClass({
	render: function() {
		return (
			<div className="signup-avatar">
				{
					this.props.src ?
					<img src={this.props.src} className="signup-avatar-img" onClick={this._openFileDialog}/>
					:
					<button type="button" className="signup-avatar-btn" onClick={this._openFileDialog}>
						<span className="glyphicon glyphicon-plus" />
						照片
					</button>
				}
				<input type="file" className="signup-avatar-file" ref="afile" accept="image/*" onChange={this.props._handleChooseFile}/>
			</div>
			);
	},

	_openFileDialog: function() {
		this.refs.afile.click();
	}
});

var SignUp = React.createClass({

	getInitialState: function () {
		return {
			src: null,
			file: null 
		};
	},
	
	componentDidMount: function() {
		var nClass = document.body.className + ' gg';
		document.body.className = nClass.trim();

		var root = document.getElementsByTagName('html')[0];
		root.style.height = '100%';
	},

	componentWillUnmount: function () {
		document.body.className = document.body.className.replace(/(?:^|\s)gg(?!\S)/g, '');
	},

	render: function() {
		return (
			<div className="row">
				<div className="col-xs-12">
					<div className="signup">
						<div className="signup-form">
							<form onSubmit={this._handleSignUp}>
								<div className="form-group">
									<SignUpAvatar src={this.state.src} _handleChooseFile={this._handleChooseFile} />
								</div>
								<div className="form-group">
									<input type="text" name="username" className="form-control signup-input" placeholder="用户名"/>
								</div>
								<div className="form-group">
									<input type="password" name="password" className="form-control signup-input" placeholder="密码" />
								</div>
								<div className="form-group">
									<button type="submit" className="btn btn-block signup-btn">
										注册
									</button>
								</div>
								<div className="form-group">
									注册即表明你同意 Jnstgram 的条款和隐私权政策。
								</div>
							</form>
						</div>

						<div className="signup-footer">
							已有账户了？
							<Link to="/signin" className="signup-link">
								<strong>登录</strong>
							</Link>
						</div>
					</div>
				</div>
			</div>
			);
	},

	_handleChooseFile: function(e) {
		var f = e.target;
		if (f.files && f.files[0]) {
			this.setState({
				file: f.files[0]
			});

			var reader = new FileReader();

			reader.onload = function(e) {
				this.setState({
					src: e.target.result
				});
			}.bind(this);

			reader.readAsDataURL(f.files[0]);
		}
	},

	_handleSignUp: function(e) {
		e.preventDefault();
		var data = fto(e.target);
		var fd = new FormData();

		function _signup(data) {
			SignUpUtil.signup(data, function(res) {
				if (res.success) {
					alert('注册成功');
					browserHistory.push({
						pathname: '/signin'
					});
				}
				else {
					alert(res.message);
				}
			});
		}

		if (this.state.file !== null) {
			fd.append('file', this.state.file);

			SignUpUtil.uploadProfile(fd, function(res) {
				if (!res.success) {
					alert(res.message);
					return;
				}
				data.profile_pic = res.filename;

				_signup(data);
			});
		}
		else {
			_signup(data);
		}
		return false;
	}
});

module.exports = SignUp;