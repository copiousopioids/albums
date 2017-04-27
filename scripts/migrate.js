// Set up the database
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('albums.sqlite3', function(err) {
  if(err) console.error(err);
});

// Run the migrations
var migrate = require('../resource/migrate');
migrate(db, 'migrations', function(err){
  if(err) console.error(err);
  else console.log("Migrations complete!");
});
