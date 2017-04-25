var port = 3000;
var express = require('express');
var fileUpload = require('express-fileupload');
var app = express();
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('albums.sqlite3', function(err) {
  if(err) console.error(err);
});

app.use(fileUpload({
  safeFileNames: true
}));

app.get('/', function (req, res) {
  res.sendFile('index.html', { root: __dirname + "/public" } );
});

app.use(express.static('public'));

app.use(fileUpload());

app.post('/upload', function(req, res) {
  if (!req.files)
    return res.status(400).send('No files were uploaded.');

  console.log(req.body.filename);

  var album = req.body;

  // The name of the input field is used to retrieve the uploaded file 
  let albumArt = req.files.albumArt;

  create(req, res, db);

  // Use the mv() method to place the file somewhere on your server 
  albumArt.mv('/public/images/' + album.name, function(err) {
    if (err)
      return res.status(500).send(err);
 
    res.send('File uploaded!');
  });
});

app.listen(port, function () {
  console.log('server listening on port ' + port);
});

// push check
