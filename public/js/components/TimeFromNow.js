var React = require('react');
var moment = require('moment');
moment.locale('zh-CN');

var TimeFromNow = React.createClass({
	render: function() {
		return (
			<span className={this.props.className}>
				{moment(this.props.time).fromNow()}
			</span>
			);
	}
});

module.exports = TimeFromNow;

