var express = require('express');
var app = express();
var path = require('path');
var torrz = require("torrz");

// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/search', async function(req, res) {
    var results = await torrz.search(req.query.query);
    res.send(results);
});

app.listen(8080);
console.log('viewed at http://localhost:8080');