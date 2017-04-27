// module.exports = {
//     list
// }
// funtion list(albums) {
//   var table = $('<table>').class('table');
//   var head = $('<head>').class('head');
// }


"use strict";

/** @module album
 * A RESTful resource representing a software album
 * implementing the CRUD methods.
 */
module.exports = {
  list: list,
  create: create,
  read: read,
  update: update,
  destroy: destroy
}

//var multipart = require('../lib/multipart');
var fs = require('fs');

/** @function list
 * Sends a list of all albums as a JSON array.
 * @param {http.incomingRequest} req - the request object
 * @param {http.serverResponse} res - the response object
 * @param {sqlite3.Database} db - the database object
 */
function list(req, res, db) {
  db.all("SELECT * FROM albums", [], function(err, albums){
    if(err) {
      console.error(err);
      res.statusCode = 500;
      res.end("Server Error")
    }
    res.setHeader("Content-Type", "text/json");
    res.end(JSON.stringify(albums));
  });
}

/** @function create
 * Creates a new album and adds it to the database.
 * @param {http.incomingRequest} req - the request object
 * @param {http.serverResponse} res - the response object
 * @param {sqlite3.Database} db - the database object
 */
function create(req, res, db) {
  // var body = "";
  //
  // req.on("error", function(err){
  //   console.error(err);
  //   res.statusCode = 500;
  //   res.end("Server error");
  // });
  //
  // req.on("data", function(data){
  //   body += data;
  // });

  var album = req.body;

  db.run("INSERT INTO albums(name, artist, genre, filename) VALUES (?,?,?,?)",
          [album.name, album.artist, album.genre, album.name],
          function(err) {
            if(err) {
              console.error(err);
              res.statusCode = 500;
              res.end("Could not insert album into database");
              return;
            }
            res.statusCode = 200;
            res.end();
          });

  // multipart(req, res, function(req, res) {
  //   var album = req.body;
  //   var filename = album.image.filename.split("\\");
  //   filename = filename[filename.length-1];
  //   db.run("INSERT INTO albums (name, artist, genre, filename) VALUES (?,?,?,?)",
  //     [album.name, album.artist, album.genre, filename],
  //     function(err) {
  //       if(err) {
  //         console.error(err);
  //         res.statusCode = 500;
  //         res.end("Could not insert album into database");
  //         return;
  //       }
  //       //TODO: FIX THIS
  //       if(!req.body.image.filename) {
  //         console.error("No file in upload");
  //         res.statusCode = 400;
  //         res.statusMessage = "No file specified";
  //         res.end("No file specified");
  //         return;
  //       }
  //       fs.writeFile('images/' + filename, req.body.image.data, function(err){
  //         if(err) {
  //           console.error(err);
  //           res.statusCode = 500;
  //           res.statusMessage = "Server Error";
  //           res.end("Server Error");
  //           return;
  //         }
  //         res.statusCode = 200;
  //         res.end();
  //       });
  //     }
  //   );
  // });
}

/** @function read
 * Serves a specific album as a JSON string
 * @param {http.incomingRequest} req - the request object
 * @param {http.serverResponse} res - the response object
 * @param {sqlite3.Database} db - the database object
 */
function read(req, res, db) {
  var id = req.params.id;
  db.get("SELECT * FROM albums WHERE id=?", [id], function(err, album){
    if(err) {
      console.error(err);
      res.statusCode = 500;
      res.end("Server error");
      return;
    }
    if(!album) {
      res.statusCode = 404;
      res.end("Album not found");
      return;
    }
    res.setHeader("Content-Type", "text/json");
    res.end(JSON.stringify(album));
  });
}


/** @update
 * Updates a specific record with the supplied values
 * @param {http.incomingRequest} req - the request object
 * @param {http.serverResponse} res - the response object
 * @param {sqlite3.Database} db - the database object
 */
function update(req, res, db) {
  var id = req.params.id;
  var body = "";

  req.on("error", function(err){
    console.error(err);
    res.statusCode = 500;
    res.end("Server error");
  });

  req.on("data", function(data){
    body += data;
  });

  req.on("end", function() {
    var album = JSON.parse(body);
    db.run("UPDATE albums SET name=?, artist=?, genre=?, filename=? WHERE id=?",
      [album.name, album.artist, album.genre, album.filename, id],
      function(err) {
        if(err) {
          console.error(err);
          res.statusCode = 500;
          res.end("Could not update album in database");
          return;
        }
        res.statusCode = 200;
        res.end();
      }
    );
  });
}

/** @destroy
 * Removes the specified album from the database.
 * @param {http.incomingRequest} req - the request object
 * @param {http.serverResponse} res - the response object
 * @param {sqlite3.Database} db - the database object
 */
function destroy(req, res, db) {
  var id = req.params.id;
  db.run("DELETE FROM albums WHERE id=?", [id], function(err) {
    if(err) {
      console.error(err);
      res.statusCode = 500;
      res.end("Server error");
    }
    res.statusCode = 200;
    res.end();
  });
}
