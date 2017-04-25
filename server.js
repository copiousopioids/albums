var port = 3000;
var express = require('express');
// var fileUpload = require('express-fileuploasd');
var multer = require('multer');
var imageUpload = multer({ dest: './public/images/'});
var app = express();


var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('albums.sqlite3', function(err) {
  if(err) console.error(err);
});

app.use(express.static('public'));

// accept one file where the name of the form field is named albumArt
app.post('/', imageUpload.single('albumArt'), function(req, res){
    if(!req.file) {
      return res.status(400).send('No files were uploaded.');
    }

    albumArt = req.file;

    console.log(req.body); // form fields
    console.log(req.file); // form files
    res.status(204).end();
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


app.listen(port, function () {
  console.log('server listening on port ' + port);
});

// push check
