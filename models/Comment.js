var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = mongoose.Schema({
	post: {
		type: Schema.Types.ObjectId,
		ref: 'Post'
	},
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	text: {
		type: String,
		default: '点了一个赞'
	},
	create_time: {
		type: Date,
		default: Date.now
	}
});

var Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;