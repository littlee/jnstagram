require('../../less/header.less');
var React = require('react');

var Header = React.createClass({
	render: function() {
		return (
			<div className="header">
				<img src="/images/logo_165_60.png" className="header-img" />
			</div>
			);
	}
});

module.exports = Header;