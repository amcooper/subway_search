//seed.js

var bcrypt = require("bcrypt");
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("fp.db");

db.run("INSERT INTO users (username, password) VALUES (?, ?)",
  'guest@guest.com', bcrypt.hashSync('guest',11),
  function(err) {
    if (err) { throw err; }
  }
);

db.run("INSERT INTO routes (user_id, nickname, route_origin, route_destination) VALUES (?, ?, ?, ?)",
  1, 'example', '50 Broadway, New York, NY', '200 5th Av, New York, NY',
  function(err) {
    if (err) { throw err; }
  }
);