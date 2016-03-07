var React = require('react');
var App = React.createClass({
	render: function() {
		return (
			<div>
				<div id="j-container">
					<div className="container-fluid">
						{this.props.children}
					</div>
				</div>
			</div>
			);
	}
});
module.exports = App;