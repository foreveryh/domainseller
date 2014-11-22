var loopback = require('loopback');
var boot = require('loopback-boot');
var nodemailer = require('nodemailer');
var app = module.exports = loopback();
/* Middleware Express 4.0 */
var bodyParser = require('body-parser')
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
/* Middleware */
/*
Here we are configuring our SMTP Server details.
STMP is mail server which is responsible for sending and recieving email.
*/
var smtpTransport = nodemailer.createTransport({
	service: "Gmail",
		auth: {
			user: "m18600080486@gmail.com",
			pass: "1qaz@WSX;"
		}
});
/*------------------SMTP Over-----------------------------*/

/*------------------Routing Started ------------------------*/
app.post('/sendoffer',function(req,res){
	var mailOptions={
		from: 'foreveryh@gmail.com',
		to : 'foreveryh@gmail.com',
		subject : req.body.host,
		text : req.body.name + req.body.email + req.body.bid,
		html : "<b>hello, world</b>"
	}
	console.log(mailOptions);
	smtpTransport.sendMail(mailOptions, function(error, response){
		if(error){
			console.log(error);
			res.end("error");
		}else{
			console.log("Message sent: " + response.message);
			res.end("sent");
		}
	});
});
/*--------------------Routing Over----------------------------*/

// Set up the /favicon.ico
app.use(loopback.favicon());

// request pre-processing middleware
app.use(loopback.compress());

// -- Add your pre-processing middleware here --

// boot scripts mount components like REST API
boot(app, __dirname);

// -- Mount static files here--
// All static middleware should be registered at the end, as all requests
// passing the static middleware are hitting the file system
// Example:
var path = require('path');
app.use(loopback.static(path.resolve(__dirname, '../client')));

// Requests that get this far won't be handled
// by any middleware. Convert them into a 404 error
// that will be handled later down the chain.
app.use(loopback.urlNotFound());

// The ultimate error handler.
app.use(loopback.errorHandler());

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    console.log('Web server listening at: %s', app.get('url'));
  });
};

// start the server if `$ node server.js`
if (require.main === module) {
  app.start();
}
