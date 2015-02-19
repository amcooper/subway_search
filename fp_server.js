// fp_server.js

var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var sqlite3 = require('sqlite3').verbose();
var cors = require('cors');
// var secret = require('./secret.json'); // For password stored in JSON object & gitignored, rather than in a database.
var db = new sqlite3.Database("fp.db");

var app = express();

app.use(cors());
app.use(bodyParser.json({ extended: false }));

app.use(session({
	secret: "cookie",
	resave: false,
	saveUninitialized: true
}));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/public/index.html');
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
			res.sendFile(__dirname + '/public/start.html');
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
				res.sendFile(__dirname + '/public/start.html');
			} else {
				res.redirect('/');
			}
		}
	});
});

app.get('/routes', function(req, res) {
  db.all("SELECT * FROM routes", function(err, rows) {
    if (err) { throw err; }
    res.json(rows);
  });
});

app.get('/route/:id', function(req, res) {
	var id = req.params.id;
	db.run("SELECT * FROM routes WHERE id=?", id, function(err, row) {
		if (err) { throw err; }
		res.json(row);
	});
});

app.post('/route', function(req, res) {
	var nickname = req.body.nickname;
	var route_origin = req.body.route_origin;
	var route_destination = req.body.route_destination;
	db.run("INSERT INTO routes (nickname, route_origin, route_destination) VALUES (?,?,?)", nickname, route_origin, route_destination, function(err) {
	    if (err) { throw err; }
	    var id = this.lastID; //weird way of getting id of what you just inserted
	    db.get("SELECT * FROM routes WHERE id = ?", id, function(err, row) {
	    	if(err) { throw err; }
	    	res.json(row);
	    });
	});
});

app.put('/route/:id', function(req, res) {
	var id = req.params.id;
	var nickname = req.body.nickname;
	var route_origin = req.body.route_origin;
	var route_destination = req.body.route_destination;
	db.run("UPDATE routes SET nickname = ?, route_origin = ?, route_destination WHERE id = ?", nickname, route_origin, route_destination, function (err) {
	    if (err) { throw err; }
	    db.get("SELECT * FROM routes WHERE id = ?", id, function(err, row) {
	    	if (err) { throw err; }
	    	res.json(row);
	    });
	});
});

app.delete('/route/:id', function(req, res) {
  var id = req.params.id;
  db.run("DELETE FROM routes WHERE id = ?", id, function(err) {
    if (err) { throw err; }
    res.json({deleted: true});
  });
});

app.listen(3000);
console.log('Listening on port 3000...');