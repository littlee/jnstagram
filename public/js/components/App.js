var React = require('react');
var request = require('superagent');

var App = React.createClass({
	componentDidMount: function() {
		var localJWT = localStorage.getItem('jwt');
		if (localJWT !== null) {
			request
				.get('/decodejwt')
				.set('jwt', localJWT)
				.end(function(err, res) {
					if (err) {
						return err;
					}

					if (res.body.success) {
						localStorage.setItem('j_user', JSON.stringify(res.body.user));
					}
					else {
						localStorage.removeItem('j_user');
						localStorage.removeItem('jwt');
					}

					this.forceUpdate();
				}.bind(this));
		}
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