require('../../less/live.less');
var React = require('react');
var Link = require('react-router').Link;
var moment = require('moment');
moment.locale('zh-CN');

var Header = require('./Header.js');
var MenuBtns = require('./MenuBtns.js');

var LiveUtil = require('../utils/LiveUtil.js');

var LivePost = React.createClass({
	getInitialState: function() {
		return {
			item: this.props.item
		};
	},

	render: function() {
		var item = this.state.item;
		var settingStyle = {
			WebkitFilter: 'blur(' + item.setting.blur + 'px) '
				+ 'brightness(' + item.setting.brightness + ') '
				+ 'contrast(' + item.setting.contrast + ') '
				+ 'hue-rotate(' + item.setting.hueRotate + 'deg) '
				+ 'saturate(' + item.setting.saturate + ')'
		};

		var commentPreview = item.comments.slice(0, 2).map(function(comm, index) {
			return (
				<div className="live-post-comment" key={index}>
					comment;
				</div>
				);
		});

		var userLike = false;
		if (sessionStorage.getItem('j_user') !== null) {

			var uid = JSON.parse(sessionStorage.getItem('j_user'))._id;
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
				<div className={item.filter}>
					<img src={item.src} width="100%" style={settingStyle}/>
				</div>
				<div className="live-post-info">
					<span className="live-post-location">
						{item.location}
					</span>
					<span className="live-post-time">
						{moment(item.post_time).fromNow()}
					</span>
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
						{item.likes.length + '次赞'}
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
		JSocket.on('new-post', function(post) {
			this.state.posts.unshift(post);
			this.setState({});
		}.bind(this));

		LiveUtil.getLatestPost(function(res) {
			this.setState({
				posts: res.posts
			});
		}.bind(this));
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
							分享直播中...
						</h3>
						{items}
					</div>
					<MenuBtns />
				</div>
			</div>
			);
	}
});

module.exports = Live;