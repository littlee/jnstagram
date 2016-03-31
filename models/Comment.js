var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = mongoose.Schema({
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	text: String,
	create_time: {
		type: Date,
		default: Date.now
	}
});

var Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;