require('../../less/search.less');

var React = require('react');
var MenuBtns = require('./MenuBtns.js');
var PostItem = require('./PostItem.js');

var SearchUtil = require('../utils/SearchUtil.js');

var Search = React.createClass({
	getInitialState: function() {
		return {
			q: '',
			trend: [],
			result: []
		};
	},

	componentDidMount: function() {
		SearchUtil.getTrend(function(res) {
			if (res.success) {
				this.setState({
					trend: res.posts
				});
			}
		}.bind(this));
	},

	render: function() {
		var trends = this.state.trend.map(function(item, index) {
			return (
				<div className="search-trend-item" key={index}>
					<PostItem filter={item.filter} src={item.src} setting={item.setting}/>
				</div>
				);
		});

		var results = this.state.result.map(function(item, index) {
			return (
				<div className="search-result-item" key={index}>
					<PostItem filter={item.filter} src={item.src} setting={item.setting}/>
				</div>
				);
		});

		return (
			<div className="row">
				<div className="col-xs-12 trim-col">
					<div className="search">
						<div className="search-header">
							<input name="q" type="search" ref="q" value={this.state.q} onChange={this._typing} placeholder="搜索" className="search-header-input"/>

							<button type="button" className="search-go" disabled={this.state.q.trim().length === 0} onClick={this._search}>
								<span className="glyphicon glyphicon-search" />
							</button>
						</div>
						<div className="search-result">
							{results}
						</div>
						
						<div className="search-trend">
							<h5 className="search-trend-title">热门作品</h5>

							<div className="search-trend-posts">
								{trends}
							</div>
						</div>
					</div>
					<MenuBtns />
				</div>
			</div>
			);
	},

	_typing: function(e) {
		this.setState({
			q: e.target.value
		});
	},

	_search: function() {

		SearchUtil.search(this.refs.q.value, function(res) {
			if (res.success) {
				this.setState({
					result: res.posts
				});
			}
		}.bind(this));
	}
});

module.exports = Search;