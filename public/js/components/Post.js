require('../../less/post.less');
var React = require('react');
var browserHistory = require('react-router').browserHistory;

var PostUtil = require('../utils/PostUtil.js');

var Filters = React.createClass({
	render: function() {
		var items = this.props.filters.map(function(f, i) {
			return (
				<div className="post-edit-block" key={i}>
					<div className={'post-edit-block-inner ' + f} onClick={this._setFilter.bind(this, f)}>
						<img src={this.props.previewSrc} width="64" height="64"/>
					</div>
					<div className="post-edit-text">
						{f}
					</div>
				</div>
				);
		}, this);

		return (
			<div className={'post-edit-item' + (this.props.show === true ? '' : ' hide')}>
				{items}
			</div>
			);
	},

	_setFilter: function(f) {
		this.props._setFilter(f);
	}
});

var PostSettingRange = React.createClass({
	getInitialState: function() {
		return {
			rangeValue: this.props.rangeValue
		};
	},

	componentDidMount: function() {
		this.oldRangeValue = this.props.rangeValue;
	},

	render: function() {
		var settingMap = {
			'blur': {
				min: 0,
				max: 3,
				step: 0.1
			},
			'brightness': {
				min: 0,
				max: 2,
				step: 0.1
			},
			'contrast': {
				min: 0,
				max: 2,
				step: 0.1
			},
			'hueRotate': {
				min: 0,
				max: 360,
				step: 5
			},
			'saturate': {
				min: 0,
				max: 5,
				step: 0.1
			}
		};

		return (
			<div className="post-setting-range">
				<div className="post-setting-range-title">
					{this.props.setting}
				</div>
				<div className="post-setting-range-input">
					<input
						type="range"
						value={this.state.rangeValue}
						min={settingMap[this.props.setting].min}
						max={settingMap[this.props.setting].max}
						step={settingMap[this.props.setting].step}
						onChange={this._adjust}/>
				</div>
				<div className="post-setting-range-value">
					{this.state.rangeValue}
				</div>
				<div className="post-setting-range-options">
					<div className="post-setting-range-option" onClick={this._cancelAdjust}>
						<span className="glyphicon glyphicon-remove" />
					</div>
					<div className="post-setting-range-option" onClick={this._confirmAdjust}>
						<span className="glyphicon glyphicon-ok" />
					</div>
				</div>
			</div>
			);
	},

	_adjust: function(e) {
		this.setState({
			rangeValue: e.target.value
		});

		this.props._adjust(e.target.value);
	},

	_cancelAdjust: function() {
		this.props._cancelAdjust(this.oldRangeValue);
	},

	_confirmAdjust: function() {
		this.props._confirmAdjust(this.state.rangeValue);
	}
});

var Settings = React.createClass({
	render: function() {
		var items = this.props.settings.map(function(s, i) {
			return (
				<div className="post-edit-block" key={i}>
					<div className="post-edit-block-inner">
						<div className={'post-setting post-setting-' + s} onClick={this._setSetting.bind(this, s)}/>
					</div>
					<div className="post-edit-text">
						{s}
					</div>
				</div>
				);
		}, this);

		return (
			<div className={'post-edit-item' + (this.props.show === true ? '' : ' hide')}>
				{items}
			</div>
			);
	},

	_setSetting: function(s){
		this.props._setSetting(s);
	}
});

var Post = React.createClass({
	getDefaultProps: function() {
		return {
			filters: [
				'original',
				'_1977',
				'aden',
				'brooklyn',
				'clarendon',
				'earlybird',
				'gingham',
				'hudson',
				'inkwell',
				'lark',
				'lofi',
				'mayfair',
				'moon',
				'nashville',
				'perpetua',
				'reyes',
				'rise',
				'slumber',
				'toaster',
				'walden',
				'xpro2'
			],

			settings: [
				'blur',
				'brightness',
				'contrast',
				'hueRotate',
				'saturate'
			]
		};
	},
	getInitialState: function() {
		return {
			previewSrc: '',
			edit: 'filter',
			filter: 'original',
			setting: '',
			blur: 0, // 0+
			brightness: 1, // 0.1+
			contrast: 1, // 0.1+
			hueRotate: 0,
			saturate: 1, // 0.1+
			uploading: false
		};
	},

	render: function() {

		var settingStyle = {
			WebkitFilter: 'blur(' + this.state.blur + 'px) '
				+ 'brightness(' + this.state.brightness + ') '
				+ 'contrast(' + this.state.contrast + ') '
				+ 'hue-rotate(' + this.state.hueRotate + 'deg) '
				+ 'saturate(' + this.state.saturate + ')'
		};

		return (
			<div className="row">
				<div className="col-xs-12 trim-col">
					<div className="post">
						<div className={'post-pick ' + this.state.filter}>
							<img src={this._getPreviewSrc()} className="post-pick-img" style={settingStyle} onClick={this._openFileDialog}/>
						</div>
						<input type="file" ref="pfile" onChange={this._handleChooseFile} className="post-pick-file" accept="image/*"/>
						{
							this.state.setting === '' ?
							<div className="post-edit">
								<div className="post-edit-tabs">
									<div className={'post-edit-tab' + (this.state.edit === 'filter'? ' active' : '')} onClick={this._switchTab.bind(this, 'filter')}>
										<span className="glyphicon glyphicon-tasks" />
									</div>
									<div className={'post-edit-tab' + (this.state.edit === 'setting'? ' active' : '')} onClick={this._switchTab.bind(this, 'setting')}>
										<span className="glyphicon glyphicon-cog" />
									</div>
								</div>

								<Filters
									filters={this.props.filters}
									previewSrc={this._getPreviewSrc()}
									show={this.state.edit === 'filter'}
									_setFilter={this._setFilter} />

								<Settings
									settings={this.props.settings}
									setting={this.state.setting}
									show={this.state.edit === 'setting'}
									_setSetting={this._setSetting}/>
							</div>
							:
							<PostSettingRange
								setting={this.state.setting}
								rangeValue={this.state[this.state.setting]}
								_adjust={this._adjust}
								_cancelAdjust={this._cancelAdjust}
								_confirmAdjust={this._confirmAdjust}/>
						}
						
					</div>
					{
						this.state.previewSrc !== '' ?
						<button type="button" className="post-continue" onClick={this._toShare} disabled={this.state.uploading}>
							{this.state.uploading ? '上传图片中...' : '继续'}
						</button>
						:
						null
					}
				</div>
			</div>
			);
	},

	_getPreviewSrc: function() {
		return this.state.previewSrc === '' ? '/images/add_pic.jpg' : this.state.previewSrc;
	},

	_openFileDialog: function() {
		this.refs.pfile.click();
	},

	_handleChooseFile: function(e) {
		var f = e.target;
		if (f.files && f.files[0]) {
			var reader = new FileReader();

			reader.onload = function(e) {
				this.setState({
					previewSrc: e.target.result
				});
			}.bind(this);

			reader.readAsDataURL(f.files[0]);
		}
	},

	_toShare: function() {
		var fd = new FormData();
		fd.append('file', this.refs.pfile.files[0]);
		PostUtil.uploadImage(fd, function(res) {
			if (res.success) {
				this.setState({
					previewSrc: res.filename
				});
				PostUtil.savePostData(this.state);
				browserHistory.push({
					pathname: '/share'
				});
				return;
			}

			alert('文件上传失败');
		}.bind(this));
	},

	_switchTab: function(t) {
		this.setState({
			edit: t
		});
	},

	_setFilter: function(f) {
		this.setState({
			filter: f
		});
	},

	_setSetting: function(s) {
		this.setState({
			setting: s
		});
	},

	_adjust: function(v) {
		var o = {};
		o[this.state.setting] = v;
		this.setState(o);
	},

	_cancelAdjust: function(oldRangeValue) {
		var o = {};
		o[this.state.setting] = oldRangeValue;
		o.setting = '';
		this.setState(o);
	},

	_confirmAdjust: function(rangeValue) {
		var o = {};
		o[this.state.setting] = rangeValue;
		o.setting = '';
		this.setState(o);
	}
});

module.exports = Post;