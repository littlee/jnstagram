var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = mongoose.Schema({
	src: String,
	filter: String,
	setting: {
		blur: {
			type: Number,
			min: 0,
			max: 3,
			default: 0
		},
		brightness: {
			type: Number,
			min: 0,
			max: 2,
			default: 1
		},
		contrast: {
			type: Number,
			min: 0,
			max: 2,
			default: 1
		},
		hueRotate: {
			type: Number,
			min: 0,
			max: 360,
			default: 0
		},
		saturate: {
			type: Number,
			min: 0,
			max: 5,
			default: 1
		}
	},
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	caption: {
		type: String,
		default: '',
		index: true
	},
	tags: {
		type: [String],
		index: true
	},
	location: {
		type: String,
		index: true
	},
	post_time: {
		type: Date,
		default: Date.now
	},
	likes: [{
		type: Schema.Types.ObjectId,
		ref: 'User'
	}],
	likes_count: {
		type: Number,
		default: 0
	},
	comments: [{
		type: Schema.Types.ObjectId,
		ref: 'Comment'
	}]
});

var Post = mongoose.model('Post', postSchema);

module.exports = Post;