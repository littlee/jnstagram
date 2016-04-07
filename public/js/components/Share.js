require('../../less/share.less');
var React = require('react');
var browserHistory = require('react-router').browserHistory;
var fto = require('form_to_object');

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
		ShareUtil.removePost();
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
						<form onSubmit={this._share}>
							<input type="hidden" name="src" value={this.state.post.src} />
							<input type="hidden" name="filter" value={this.state.post.filter} />
							<input type="hidden" name="setting[blur]" value={this.state.post.blur} />
							<input type="hidden" name="setting[brightness]" value={this.state.post.brightness} />
							<input type="hidden" name="setting[contrast]" value={this.state.post.contrast} />
							<input type="hidden" name="setting[hueRotate]" value={this.state.post.hueRotate} />
							<input type="hidden" name="setting[saturate]" value={this.state.post.saturate} />
							<input type="hidden" name="location" value={this.state.location} />

							<div className="share-text">
								<div className={'share-img-wrapper ' + this.state.post.filter}>
									<img src={this.state.post.src} width="64" height="64" style={settingStyle}/>
								</div>
								<div className="share-caption">
									<textarea name="caption" className="form-control" placeholder="添加照片说明...">
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
							<button type="submit" className="share-btn">
								分享 :)
							</button>
						</form>
					</div>
				</div>
			</div>
			);
	},

	_onChange: function() {
		this.setState(getStateFromStores());
	},

	_share: function(e) {
		e.preventDefault();
		var data = fto(e.target);
		ShareUtil.sendPost(data, function(res) {

			if (res.success) {
				browserHistory.push({
					pathname: '/'
				});
			}

		});
		return false;
	}
});

module.exports = Share;