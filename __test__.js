// var request = require('superagent');

// request
// 	.post('http://localhost:3000/signin')
// 	.send({
// 		username: 'lee',
// 		password: 'qqqqqq'
// 	})
// 	.end(function(err, res) {
// 		if (err) {
// 			console.log(err);
// 			return;
// 		}
// 		console.log(res.body);
// 	});


// eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhIjoibWUiLCJpYXQiOjE0NTk0MzM3NzR9.nA7lqEWqqOunJjBuAtRhsuMNl78WfGyRhphCrzUx06k
var jwt = require('jsonwebtoken');
var t = jwt.sign({a:'me'}, 'gg');
console.log(jwt.verify('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhIjoibWUiLCJpYXQiOjE0NTk0MzM3NzR9.nA7lqEWqqOunJjBuAtRhsuMNl78WfGyRhphCrzUx06k', 'gg'));