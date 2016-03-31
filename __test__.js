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

// eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NmY1ZmVjODg0OTEzOWJjMjA5NDAwZDYiLCJ1c2VybmFtZSI6ImxlZSIsImlhdCI6MTQ1OTQwNzY3NX0.w8ky3NFUdR3rCd2zP90bo1bcqg033W-Md2-uBQ-LCl8

var jwt = require('jsonwebtoken');
console.log(jwt.decode('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NmY1ZmVjODg0OTEzOWJjMjA5NDAwZDYiLCJ1c2VybmFtZSI6ImxlZSIsImlhdCI6MTQ1OTQwNzY3NX0.w8ky3NFUdR3rCd2zP90bo1bcqg033W-Md2-uBQ-LCl8', {complete: true}));