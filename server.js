var express = require('express');
var app = express();
var port = 3000;

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.use(express.static('public'));

app.listen(port, function () {
  console.log('server listening on port ' + port);
});
