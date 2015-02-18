
var ejs = require('ejs');
var fs = require('fs');
var http = require('http');
var express = require('express');
var app = express();

app.get('/', function(req, res) {
	var id1 = req.params.id1;
	var id2 = req.params.id2;
	// console.log("path: " + path); // Debug
	// var pathItems = path.split("/");
	var width = parseInt(id1);
	var height = parseInt(id2);
	console.log("dimensions: " + width + ", " + height); // Debug
	var str = fs.readFileSync('./expresskitten.ejs', 'utf8');
	var rendered = ejs.render(str, {w: width, h: height});
	res.send(rendered);
});

app.listen(3000);
