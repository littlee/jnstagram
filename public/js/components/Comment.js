require('../../less/comment.less');
var React = require('react');
var browserHistory = require('react-router').browserHistory;
var Link = require('react-router').Link;

var CommentUtil = require('../utils/CommentUtil.js');

var TimeFromNow = require('./TimeFromNow.js');

var CommentAdd = React.createClass({
	getInitialState: function() {
		return {
			text: ''
		};
	},

	render: function() {
		return (
			<div className="comment-add">
				<div className="comment-add-btn-wrap">
					<button type="button" className="comment-add-btn" disabled={this.state.text.trim() === ''} onClick={this._handleClick}>
						发送
					</button>
				</div>
				<div className="comment-add-input-wrap">
					<input type="text" className="comment-add-input" placeholder="添加评论..." value={this.state.text} onChange={this._typeComment}/>
				</div>
			</div>
		);
	},

	_typeComment: function(e) {
		this.setState({
			text: e.target.value
		});
	},

	_handleClick: function() {
		this.props.onClick(this.state.text);
		this.setState({
			text: ''
		});
	}

});

var CommentItem = React.createClass({
	render: function() {
		var item = this.props.item;

		return (
			<div className="comment-item">
				<div className="comment-profile">
					<img src={item.author.profile_pic} width="50" height="50" />
				</div>
				<div className="comment-body">
					<div className="comment-name">
						<Link to={'/user/a'}>{item.author.username}</Link>

						<TimeFromNow className="comment-time" time={item.create_time} />
					</div>
					<div className="comment-text">
						{item.text}
					</div>
				</div>
			</div>
			);
	}
});

var Comment = React.createClass({

	getInitialState: function() {
		return {
			comments: []
		};
	},

	componentDidMount: function() {
		this._getComments();
	},

	render: function() {
		var items = this.state.comments.map(function(item, index) {
			return (
				<CommentItem item={item} key={index}/>
				);
		});

		return (
			<div className="row">
				<div className="col-xs-12 trim-col">
					<div className="comment">
						<div className="comment-header">
							<div className="comment-header-back" onClick={this._goBack}>
								<span className="glyphicon glyphicon-arrow-left" />
							</div>
							<h4 className="comment-header-title">评论</h4>
						</div>

						{items}

						<CommentAdd onClick={this._postComment}/>
					</div>
				</div>
			</div>
			);
	},

	_goBack: function() {
		browserHistory.goBack();
	},

	_getComments: function() {
		CommentUtil.getComments(this.props.params.postId, function(res) {
			if (res.success) {
				this.setState({
					comments: res.comments
				});
			}
		}.bind(this));
	},

	_postComment: function(text) {
		var data = {};
		data.text = text;
		data.post = this.props.params.postId;

		CommentUtil.postComment(data, function(res) {
			if (res.success) {
				this._getComments();
			}
		}.bind(this));
	}
});

module.exports = Comment;