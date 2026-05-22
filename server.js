var express = require('express');
var app = express();
var path = require('path');
var TorrentSearchApi = require('torrent-search-api');

// Enable public providers (no login needed)
TorrentSearchApi.enablePublicProviders();

// viewed at http://localhost:8080
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/search', async function (req, res) {
    try {
        var results = await TorrentSearchApi.search(req.query.query, 'All', 20);
        // console.log(results);
        res.send(results);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

app.listen(8080);
console.log('viewed at http://localhost:8080');