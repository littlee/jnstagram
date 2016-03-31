var React = require('react');
var Header = require('./Header.js');
var MenuBtns = require('./MenuBtns.js');

var Search = React.createClass({
	render: function() {
		return (
			<div className="row">
				<div className="col-xs-12 trim-col">
					<Header />
					<h1>Search</h1>
					<MenuBtns />
				</div>
			</div>
			);
	}
});

module.exports = Search;