//seed.js

var bcrypt = require("bcrypt");
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("fp.db");

db.run("INSERT INTO users (name, password) VALUES (?, ?)",
  'guest', bcrypt.hashSync('guest',11),
  function(err) {
    if (err) { throw err; }
  }
);

db.run("INSERT INTO addresses (user_id, name, address) VALUES (?, ?, ?)",
  1, 'example', '50 Broadway, New York, NY',
  function(err) {
    if (err) { throw err; }
  }
);