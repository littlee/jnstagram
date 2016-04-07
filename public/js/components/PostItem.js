// require('../../less/post-item.less');
var React = require('react');

var PostItem = React.createClass({
	render: function() {
		var settingStyle = {
			WebkitFilter: 'blur(' + this.props.setting.blur + 'px) '
				+ 'brightness(' + this.props.setting.brightness + ') '
				+ 'contrast(' + this.props.setting.contrast + ') '
				+ 'hue-rotate(' + this.props.setting.hueRotate + 'deg) '
				+ 'saturate(' + this.props.setting.saturate + ')'
		};

		return (
			<div className={'post-item ' + this.props.filter} style={{overflow: 'hidden'}}>
				<img src={this.props.src} width="100%" style={settingStyle} />
			</div>
			);
	}
});

module.exports = PostItem;
