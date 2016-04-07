require('../../less/live.less');
var React = require('react');
var Link = require('react-router').Link;

var Header = require('./Header.js');
var MenuBtns = require('./MenuBtns.js');
var PostItem = require('./PostItem.js');
var TimeFromNow = require('./TimeFromNow.js');

var LiveUtil = require('../utils/LiveUtil.js');

var LivePost = React.createClass({
	getInitialState: function() {
		return {
			item: this.props.item
		};
	},

	render: function() {
		var item = this.state.item;

		var commentPreview = item.comments.slice(0, 2).map(function(comm, index) {
			return (
				<div className="live-post-comment" key={index}>
					<Link to={'/user/' + comm.author.username} className="live-post-comment-name">
						{comm.author.username}
					</Link>
					<span>
						{comm.text}
					</span>
				</div>
				);
		});

		var userLike = false;
		if (localStorage.getItem('j_user') !== null) {

			var uid = JSON.parse(localStorage.getItem('j_user'))._id;
			if (item.likes.indexOf(uid) >= 0) {
				userLike = true;
			}
		}

		return (
			<div className="live-post">
				<div className="live-post-user">
					<img src={item.author.profile_pic} width="32" height="32" className="live-post-profile-pic"/>
					<Link to={'/user/' + item.author.username} className="live-post-author-name">
						{item.author.username}
					</Link>
				</div>
				<PostItem filter={item.filter} src={item.src} setting={item.setting} />
				<div className="live-post-info">
					<span className="live-post-location">
						{item.location}
					</span>
					<TimeFromNow className="live-post-time" time={item.post_time}/>
				</div>
				<div className="live-post-options">
					<span className={'live-post-option' + (userLike ? ' active' : '')} onClick={this._toggleLike.bind(this, item._id)}>
						<span className="glyphicon glyphicon-heart" />
					</span>
					<Link to={'/comment/' + item._id} className="live-post-option">
						<span className="glyphicon glyphicon-comment" />
					</Link>
				</div>
				<div className="live-post-like">
					<Link to={'/like/' + item._id} className="live-post-like-link">
						<span className="glyphicon glyphicon-heart" />
						{item.likes_count + '次赞'}
					</Link>
				</div>

				{
					item.caption !== '' ?
					<div className="live-post-caption">
						<Link to={'/user/' + item.author.username} className="live-post-username">
							{item.author.username}
						</Link>
						<span>
							{item.caption}
						</span>
					</div>
					:null
				}

				<div className="live-post-comments">
					<div className="live-post-comments-count">
						所有 {item.comments.length} 条评论
					</div>
					<div className="live-post-comments-preview">
						{commentPreview}
					</div>
				</div>
			</div>
			);
	},

	_toggleLike: function(postId) {
		LiveUtil.toggleLike({
			postId: postId
		}, function(res) {
			if (res.success) {
				this.setState({
					item: res.post
				});
			}
		}.bind(this));
	}
});

var Live = React.createClass({
	getInitialState: function() {
		return {
			posts: []
		};
	},

	componentDidMount: function() {
		JSocket.on('new-post', function() {
			this._getPosts();
		}.bind(this));

		this._getPosts();
	},

	componentWillUnmount: function() {
		JSocket.off('new-post');
	},

	render: function() {

		var items = this.state.posts.map(function(item, index) {
			return <LivePost item={item} key={index}/>;
		});

		return (
			<div className="row">
				<div className="col-xs-12 trim-col">
					<Header />
					<div className="live">
						<h3 className="live-title">
							{/*分享直播中...*/}
							Live Stream
						</h3>
						{items}
					</div>
					<MenuBtns />
				</div>
			</div>
			);
	},

	_getPosts: function() {
		LiveUtil.getLatestPost(function(res) {
			this.setState({
				posts: []
			});
			this.setState({
				posts: res.posts
			});
		}.bind(this));
	}
});

module.exports = Live;
