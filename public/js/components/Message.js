require('../../less/message.less');
var React = require('react');
var Link = require('react-router').Link;

var MessageUtil = require('../utils/MessageUtil.js');

var TimeFromNow = require('./TimeFromNow.js');
var Header = require('./Header.js');
var MenuBtns = require('./MenuBtns.js');
var PostItem = require('./PostItem.js');

var MessageItem = React.createClass({
	render: function() {
		return (
			<div className="msg-item">
				<div className="msg-profile">
					<img src={this.props.item.author.profile_pic} width="50" height="50" />
				</div>
				<div className="msg-post">
					<div className="msg-post-item">
						<PostItem filter={this.props.item.post.filter} src={this.props.item.post.src} setting={this.props.item.post.setting} />
					</div>
				</div>
				<div className="msg-body">
					<Link to={'/user/' + this.props.item.author.username} className="msg-user">
						{this.props.item.author.username}
					</Link>
					<span>{this.props.item.text}</span>
					<TimeFromNow className="msg-time" time={this.props.item.create_time}/>
				</div>
			</div>
			);
	}
});

var Message = React.createClass({

	getInitialState: function() {
		return {
			message: []
		};
	},

	componentDidMount: function() {
		this._getMessage();
	},

	render: function() {

		var items = this.state.message.map(function(item, index) {
			return (
				<MessageItem item={item} key={index}/>
				);
		});

		return (
			<div className="row">
				<div className="col-xs-12 trim-col">
					<Header />
					<div className="msg">
						{items}					
					</div>
					<MenuBtns />
				</div>
			</div>
			);
	},

	_getMessage: function() {
		MessageUtil.getMessage(function(res) {
			console.log(res);
			if (res.success) {
				this.setState({
					message: res.message
				});
			}
		}.bind(this));
	}
});

module.exports = Message;