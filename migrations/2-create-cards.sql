CREATE TABLE cards (
  id INTEGER PRIMARY KEY,
  album_id INTEGER,
  name TEXT,
  artist TEXT,
  FOREIGN KEY (album_id) REFERENCES albums(id)
);
