var React = require('react');
var request = require('superagent');

var App = React.createClass({
	componentDidMount: function() {
		request
			.get('/signedin')
			.end(function(err, res) {
				if (err) {
					return err;
				}

				if (res.body.success) {
					sessionStorage.setItem('j_user', JSON.stringify(res.body.user));
					this.forceUpdate();
				}
			}.bind(this));
	},

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