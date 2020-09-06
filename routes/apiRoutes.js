// Require file system from node to write the read/write the DB
const fs = require('fs');
// Require uuid to create unique IDs for each note.
const { v4: uuidv4 } = require('uuid');

// initialize saved notes as a global variable
let savedNotes = [];

// function to read in the DB to populate our notes list.
readDB = () => {
  fs.readFile('./db/db.json', (err, data) => {
    if (err) throw err;
    savedNotes = JSON.parse(data);
  });
};

// start out by reading the DB
readDB();

// function to overwrite the DB when new data is entered
rewriteDB = () => {
  fs.writeFile('./db/db.json', JSON.stringify(savedNotes), (err) => {
    if (err) throw err;
  });
};

// module to send to server
module.exports = function (app) {

  app.get('/api/notes', (req, res) => {
    readDB();
    res.send(savedNotes);
  });

  app.post("/api/notes", (req, res) => {
    const thisNote = req.body

    // adding in update functionality.

    // If it's a new note we're going to give it an ID
    if (!thisNote.id) {
      thisNote.id = (uuidv4());
      savedNotes.push(thisNote);
      rewriteDB();
      readDB();
      res.send(savedNotes);

      // otherwise we'll maintain the existing ID and rewrite the note in place.
    } else {

      for (let i = 0; i < savedNotes.length; i++) {
        if (savedNotes[i].id === thisNote.id) {
          savedNotes[i] = thisNote;
          rewriteDB();
          readDB();
          res.send(savedNotes);
          return;
        }
      }

    };
  });

  app.delete(`/api/notes/:id`, (req, res) => {
    idToDelete = req.params.id;
    for (let i = 0; i < savedNotes.length; i++) {
      if (savedNotes[i].id === idToDelete) {
        savedNotes.splice(i, 1);
        rewriteDB();
        readDB();
        res.send(savedNotes);
        return;
      }
    }
  });
};
