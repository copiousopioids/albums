var port = 3000;
var express = require('express');
// var fileUpload = require('express-fileuploasd');
var multer = require('multer');
var imageUpload = multer({ dest: './public/images/'});
var app = express();
var path = require('path');
var resource = require('./resource/album.js');
var migrations = require('./resource/migrate.js');


var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('albums.sqlite3', function(err) {
  if(err) console.error(err);
});

app.use(express.static('public'));
app.use(express.static('projects'));

// accept one file where the name of the form field is named albumArt
app.post('/', imageUpload.single('albumArt'), function(req, res){
    if(!req.file) {
      return res.status(400).send('No files were uploaded.');
    }

    albumArt = req.file;
    resource.create(req, res, db);

    console.log(req.body); // form fields
    console.log(req.file); // form files
    res.statusCode = 204;
    res.end();
});
 
// app.post('/', imageUpload.single('albumArt'), function(req, res) {
//   if (!req.files)
//     return res.status(400).send('No files were uploaded.');
//  
//   // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file 
//   let albumArt = req.files.albumArt;
//  
//   // Use the mv() method to place the file somewhere on your server 
//   albumArt.mv('./public/images/' + albumArt.name, function(err) {
//     if (err)
//       return res.status(500).send(err);
//  
//     res.send('File uploaded!');
//   });
// });

app.get('/', function (req, res) {
  res.sendFile('index.html', { root: __dirname + "/public" } );
});

app.get('/projects/', function (req, res) {
  resource.list(req, res, db);
});

app.get('')


app.listen(port, function () {
  console.log('server listening on port ' + port);
});

// push check
