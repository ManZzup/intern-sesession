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
		res.json({ success: true });
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
	if (req.body.name && req.body.email && req.body.password){
		var user = new User({
			name: req.body.name,
			email : req.body.email,
			password : bcrypt.hashSync(req.body.password, 10),
			admin: true
		});

		user.save(function(err){
			if (err) throw err;

			console.log('New user saved successfully.');
			res.json({
				success: true,
				user: req.body.name
			});
		});
	} else {
		res.json({
			success: false,
			message : "One or more fields are invalid."
		})
	}
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

	// find the user
	User.findOne({
		email: req.body.email
	}, function(err, user) {

		if (err) throw err;

		if (!user) {
			res.json({ success: false, message: 'Authentication failed. User not found.' });
		} else if (user) {

			// check if password matches, async
			bcrypt.compare(req.body.password, user.password, function(err, result){

				if (result) {
					// if user is found and password is right
					// create a token
					var payload = {
						admin: user.admin	
					}
					var token = jwt.sign(payload, app.get('superSecret'), {
						expiresIn: 86400 // expires in 24 hours
					});
	
					res.json({
						success: true,
						message: 'Enjoy your token!',
						token: token
					});
					
				} else {
					res.json({ success: false, message: 'Authentication failed. Wrong password.' });
				}		

			} )
			

		}

	});
});

// ---------------------------------------------------------
// route middleware to authenticate and check token
// ---------------------------------------------------------
apiRoutes.use(function(req, res, next) {

	// check header or url parameters or post parameters for token
	var token = req.body.token || req.param('token') || req.headers['x-access-token'];

	// decode token
	if (token) {

		// verifies secret and checks exp
		jwt.verify(token, app.get('superSecret'), function(err, decoded) {			
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });		
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;	
				next();
			}
		});

	} else {

		// if there is no token
		// return an error
		return res.status(403).send({ 
			success: false, 
			message: 'No token provided.'
		});
		
	}
	
});

// ---------------------------------------------------------
// authenticated routes
// ---------------------------------------------------------
apiRoutes.get('/', function(req, res) {
	res.json({ message: 'Welcome to the coolest API on earth!' });
});

apiRoutes.get('/users', function(req, res) {
	User.find({}, function(err, users) {
		res.json(users);
	});
});

apiRoutes.get('/check', function(req, res) {
	res.json(req.decoded);
});

app.use('/api', apiRoutes);

// =================================================================
// start the server ================================================
// =================================================================
app.listen(port);
console.log("Server started at http://localhost:" + port)
