var express = require('express');
var fileUpload = require('express-fileupload');
var app = express();
var port = 3000;



app.get('/', function (req, res) {
  res.sendFile('index.html', { root: __dirname + "/public" } );
});

app.use(express.static('public'));

app.use(fileUpload());

app.post('/upload', function(req, res) {
  if (!req.files)
    return res.status(400).send('No files were uploaded.');
 
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file 
  let sampleFile = req.files.sampleFile;
 
  // Use the mv() method to place the file somewhere on your server 
  sampleFile.mv('/somewhere/on/your/server/filename.jpg', function(err) {
    if (err)
      return res.status(500).send(err);
 
    res.send('File uploaded!');
  });
});

app.listen(port, function () {
  console.log('server listening on port ' + port);
});

// push check
