// =================================================================
// get the packages we need ========================================
// =================================================================
var express 	= require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var path = require('path');
var bcrypt = require('bcrypt');

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var User   = require('./app/models/user'); // get our mongoose model
var sample_data = require('./db/sample_dataset'); // sample dataset to populate db

// =================================================================
// configuration ===================================================
// =================================================================
var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret); // secret variable

// set root of static resources
app.use(express.static(__dirname + '/views'));

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

// =================================================================
// routes ==========================================================
// =================================================================


/**
 * Run this method first to add data to mongodb
 * See db/sample_dataset
 */
app.get('/setup', function(req, res) {

	// create a sample user
	var nick = new User({ 
		name: 'Nick Cerminara',
		email: 'test@test.com', 
		password: bcrypt.hashSync('test', 10),
		admin: true 
	});
	nick.save(function(err) {
		if (err) throw err;

		console.log('User saved successfully.');
	});

	sample_data.forEach(function(user){
		var new_user = new User({ 
			name: user.name,
			email: user.email, 
			password: bcrypt.hashSync(user.password, 10),
			admin: true 
		});

		new_user.save(function(err) {
			if (err) throw err;
			else{
				console.log('User saved successfully.');
			}
		});
	});

	res.json({
		success: true
	});
});

// basic route (http://localhost:8080)
app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/views/index.html'));
});


app.get('/register', function(req, res){
	res.sendFile(path.join(__dirname + '/views/register.html'));
});

app.post('/register', function(req, res){
	// code to register new user
});

// ---------------------------------------------------------
// get an instance of the router for api routes
// ---------------------------------------------------------
var apiRoutes = express.Router(); 

// ---------------------------------------------------------
// authentication (no middleware necessary since this isnt authenticated)
// ---------------------------------------------------------
// http://localhost:8080/api/authenticate
apiRoutes.post('/authenticate', function(req, res) {
	// find the user with the login info, check password, generate and return msg with token
});


app.get('/logout', function(req, res, next){
	var token = req.body.token || req.param('token') || req.headers['x-access-token'];

	if (token){
		// fill code
	}
});



/* ---------------------------------------------------------
   route middleware to authenticate and check token
   Only applied to routes below this.
   Use something like Postman to test the API
   with token attached to the request in the body, header or url.
   --------------------------------------------------------- */
apiRoutes.use(function(req, res, next) {

	// check header or url parameters or post parameters for token

	// decode token
	if (token) {

		// verify secret and checks exp
				// if everything is good, save to request for use in other routes
	} else {

		// if there is no token
		// return an error msg
		// mind the http error code
	}
	
});


/* ---------------------------------------------------------
   authenticated routes
   To call these, you need to send the auth token
   as a query param in the url, as an auth header in the
   HTTP request, or as a parameter in the request body. 
   --------------------------------------------------------- */


/**
 * Validate a given token
 * hitting the endpoint will perform the validation in the middleware above.
 * So only needs the success scenario response.
 * with token as a query param: http://localhost:8080/api/token/validate?token=... 
 */
apiRoutes.get('/token/validate', function(req, res, next){
	// success response
});


/**
 * generate new token for an authenticated user.
 * with token as a query param: http://localhost:8080/api/token/generate?token=...
 */
apiRoutes.get('/token/generate', function(req, res, next){

	// decode user info
	// if there's such a user, generate and return new token
	
});


/**
 * show all users in db
 * with token as a query param: http://localhost:8080/api/users?token=...
 */ 
apiRoutes.get('/users', function(req, res) {
	User.find({}, function(err, users) {
		res.json(users);
	});
});

/**
 * show info stored in token
 * with token as a query param: http://localhost:8080/api/check?token=...
 */ 
apiRoutes.get('/check', function(req, res) {
	res.json(req.decoded);
});

app.use('/api', apiRoutes);

// =================================================================
// start the server ================================================
// =================================================================
app.listen(port);
console.log("Server started at http://localhost:" + port)



/**
 * Helper method to generate new token
 * @param {*} user 
 */
var generateToken = function(user){

	// generate signed jwt with user info payload
	// set expiry time (eg: 10 mins)
	// return token.
}