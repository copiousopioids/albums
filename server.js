var port = 3000;
var express = require('express');
// var fileUpload = require('express-fileuploasd');
var multer = require('multer');
var app = express();
var path = require('path');
var resource = require('./resource/album.js');
var migrations = require('./resource/migrate.js');
var fs = require('fs');



// Vars for Album Art upload
var imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images')
  },
  filename: function (req, file, cb) {
    var fileType = file.mimetype.split('/');
    cb(null, req.body.name + '.' + fileType[1]);
  }
});
var imageUpload = multer({ dest: './public/images/', storage: imageStorage});


var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('albums.sqlite3', function(err) {
  if(err) console.error(err);
});

app.use(express.static('public'));
app.use(express.static('projects'));

// accept one file where the name of the form field is named albumArt
app.post('/upload', imageUpload.single('albumArt'), function(req, res){
    if(!req.file) {
      return res.status(400).send('No files were uploaded.');
    }

    resource.create(req, res, db);

    // console.log(req.body); // form fields
    // console.log(req.file); // form files
    res.redirect("/");
});

// 12 is max number of files
// app.post('/photos/upload', upload.array('photos', 12), function (req, res, next) {
//   // req.files is array of `photos` files
//   // req.body will contain the text fields, if there were any
// });

 
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

app.get('/music/:albumId', function(req, res) {
  var albumId = req.params.albumId;
  if (albumId) {
    fs.readdir('./public/music/'+ albumId, function(err, fileNames){
      if(err) console.log(err);
      else {
        res.setHeader("Content-Type", "text/json");
        res.end(JSON.stringify(fileNames));
      }
    });
  }
  else {
    console.log('no folder specified');
    res.status(400).send("No directory");
  }
});


app.listen(port, function () {
  console.log('server listening on port ' + port);
});

// push check
