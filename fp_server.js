// fp_server.js

var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var sqlite3 = require('sqlite3').verbose();
// var secret = require('./secret.json'); // For password stored in JSON object & gitignored, rather than in a database.
var db = new sqlite3.Database("fp.db");

var app = express();

app.use(bodyParser.urlencoded({extended: false}));

app.use(session({
	secret: "cookie",
	resave: false,
	saveUninitialized: true
}));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

app.post('/register', function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	var confirm_password = req.body.confirm_password;
	if (password !== confirm_password) {
		console.log("Passwords do not match.");
		res.redirect('/');
	} else {
		var hash = bcrypt.hashSync(password, 11);
		db.run("INSERT INTO users (username, password) VALUES (?, ?)", username, hash, function(err) {
			if (err) { throw err; }  
			req.session.valid_user = true;
			res.redirect('/secret_page');
		});
	}
});

app.post('/session', function(req, res) { 
	var username = req.body.username;
	var password = req.body.password; 
	db.get("SELECT * FROM users WHERE username = ?", username, function(err, row) {
		if (err) { throw err; }
		if (row) {
			var passwordMatches = bcrypt.compareSync(password, row.password);
			if (passwordMatches) {
				req.session.valid_user = true;
				res.redirect('/secret_page');
			} else {
				res.redirect('/');
			}
		}
	});
});

app.get('/secret_page', function(req, res) {
	if (req.session.valid_user === true) {
		res.send('<a href="/secret_page2">Hello!</a>');
	} else {
		res.redirect('/');
	}
});

app.get('/secret_page2', function(req, res) {
	if (req.session.valid_user === true) {
		res.send('<a href="/secret_page">Hello again!</a>');
	} else {
		res.redirect('/');
	}
});

app.listen(3000);
console.log('Listening on port 3000...');