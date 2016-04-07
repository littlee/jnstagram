var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = mongoose.Schema({
	username: {
		type: String,
		index: true
	},
	password: String,
	profile_pic: {
		type: String,
		default: '/images/default_avatar.jpg'
	},
	posts: [{
		type: Schema.Types.ObjectId,
		ref: 'Post'
	}]
});

var User = mongoose.model('User', userSchema);

module.exports = User;