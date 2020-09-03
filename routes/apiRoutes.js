const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

let savedNotes = [];

fs.readFile('./db/db.json', (err, data) => {
  if (err) throw err;
  savedNotes = JSON.parse(data);
});

rewriteDB = () => {
  fs.writeFile('./db/db.json', JSON.stringify(savedNotes), (err) => {
    if (err) throw err;
  });
};

module.exports = function (app) {

  app.get('/api/notes', (req, res) => {
    res.send(savedNotes);
  });

  app.post("/api/notes", (req, res) => {
    const thisNote = req.body
    thisNote.id = (uuidv4());
    savedNotes.push(thisNote);
    rewriteDB();
    res.send(savedNotes);
  });

  app.delete(`/api/notes/:id`, (req, res) => {
    idToDelete = req.params.id;
    for (let i = 0; i < savedNotes.length; i++) {
      if (savedNotes[i].id === idToDelete) {
        savedNotes.splice(i, 1);
        rewriteDB();
        res.send(savedNotes);
        return;
      }
    }
  });
};
// I'm adding a comment!



// * The following API routes should be created:
// ----------
//   * GET `/api/notes` - Should read the `db.json` file and return all saved notes as JSON.
// ----------
//   * POST `/api/notes` - Should receive a new note to save on the request body, add it to the 
// `db.json` file, and then return the new note to the client.
// ----------
//   * DELETE `/api/notes/:id` - Should receive a query parameter containing the id of a note to delete. 
// This means you'll need to find a way to give each note a unique `id` when it's saved. 
// In order to delete a note, you'll need to read all notes from the `db.json` file, 
// remove the note with the given `id` property, and then rewrite the notes to the `db.json` file.