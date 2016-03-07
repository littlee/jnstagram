var React = require('react');

var Header = require('./Header.js');

var Live = React.createClass({
	render: function() {
		return (
			<div className="row">
				<div className="col-xs-12 trim-col">
					<Header />
					<h1>LIVE STREAM</h1>
					<div className="toaster">
						<img src="/images/test.jpg" />
					</div>
				</div>
			</div>
			);
	}
});

module.exports = Live;