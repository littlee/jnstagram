var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = mongoose.Schema({
	username: String,
	password: String,
	profile_pic: String,
	posts: {
		type: Schema.Types.ObjectId,
		ref: 'Post'
	}
});

var User = mongoose.model('User', userSchema);

module.exports = User;