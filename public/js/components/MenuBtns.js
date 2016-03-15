require('../../less/menu-btns.less');
var React = require('react');
var IndexLink = require('react-router').IndexLink;
var Link = require('react-router').Link;

var MenuBtns = React.createClass({
	render: function() {
		return (
			<div className="menu-btns">
				<IndexLink to="/" className="menu-btns-item" activeClassName="active">
					<span className="glyphicon glyphicon-home" />
				</IndexLink>
				<Link to="/search" className="menu-btns-item" activeClassName="active">
					<span className="glyphicon glyphicon-search" />
				</Link>
				<Link to="/post" className="menu-btns-item post" activeClassName="active">
					<span className="glyphicon glyphicon-camera" />
				</Link>
				<Link to="/message" className="menu-btns-item" activeClassName="active">
					<span className="glyphicon glyphicon-comment" />
				</Link>
				<Link to="/me" className="menu-btns-item" activeClassName="active">
					<span className="glyphicon glyphicon-user" />
				</Link>
			</div>
			);
	}
});

module.exports = MenuBtns;