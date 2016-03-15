require('../../less/share.less');
var React = require('react');
var Link = require('react-router').Link;

var ShareStore = require('../stores/ShareStore.js');
var ShareUtil = require('../utils/ShareUtil.js');

var Header = require('./Header.js');

function getStateFromStores() {
	return {
		post: ShareStore.getPost(),
		location: ShareStore.getLocation()
	};
}

var Share = React.createClass({
	getInitialState: function() {
		return getStateFromStores();
	},

	componentDidMount: function() {
		ShareStore.addChangeListener(this._onChange);
		ShareUtil.getPost();
		ShareUtil.getLocation();
	},

	componentWillUnmount: function() {
		ShareStore.removeChangeListener(this._onChange);
	},

	render: function() {
		var settingStyle = {
			WebkitFilter: 'blur(' + this.state.post.blur + 'px) '
				+ 'brightness(' + this.state.post.brightness + ') '
				+ 'contrast(' + this.state.post.contrast + ') '
				+ 'hue-rotate(' + this.state.post.hueRotate + 'deg) '
				+ 'saturate(' + this.state.post.saturate + ')'
		};

		return (
			<div className="row">
				<div className="col-xs-12 trim-col">
					<Header />
					<div className="share">
						<div className="share-text">
							<div className={'share-img-wrapper ' + this.state.post.filter}>
								<img src="/images/test.jpg" width="64" height="64" style={settingStyle}/>
							</div>
							<div className="share-caption">
								<textarea className="form-control" placeholder="添加照片说明...">
								</textarea>
							</div>
						</div>

						<div className="share-location">
							<div className="share-location-position">
								<span className="glyphicon glyphicon-map-marker" />
								<div className="share-location-item">
									{this.state.location}
								</div>
							</div>
						</div>
					</div>

					<Link to="/" className="share-btn">
						分享 :)
					</Link>
				</div>
			</div>
			);
	},

	_onChange: function() {
		this.setState(getStateFromStores());
	}
});

module.exports = Share;