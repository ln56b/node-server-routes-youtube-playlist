const express = require('express');
const connection = require('../conf');
const { handleSQLError, handleNotFound } = require('../handleSQLError');
const tracksRouter = require('./tracks');

const router = express.Router();
router.use('/:playlistId', tracksRouter)

// 1. Post a playlist
router.post('/', (req, res) => {
  const playlistData = req.body;
  connection.query('INSERT INTO playlist SET ?', playlistData, (err, results) => {
    if (err) {
      return handleSQLError(err, res);
    } 
    res.sendStatus(200);
  });
});


// 2. Get a playlist by id 
router.get('/:id', (req, res) => {
  const showOne= req.params.id;
  connection.query('SELECT * FROM playlist WHERE id = ?', [showOne], (err, results) => {
    if (err) {
      return handleSQLError(err, res);
    } 
    // if (results.length === 0) {
    //   return handleNotFound(`Playlist ${showOne} not found`, res)
    // } 
    res.json(results[0]);
  });
});

// 5. Delete a playlist
router.delete('/:id', (req, res) => {
  const idSite = req.params.id;
  connection.query('DELETE FROM playlist WHERE id = ?', [idSite], (err) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error deleting a playlist');
    } else {
      res.sendStatus(200);
    }
  });
});

// 6. Put a playlist
router.put('/:id', (req, res) => {
  const playlistData = req.body;
  const idPlaylist = req.params.id;
  connection.query('UPDATE playlist SET ? WHERE id = ?', [playlistData, idPlaylist], (err) => {
    if (err) {
      return handleSQLError(err, res);
    } 
    res.sendStatus(200);
  });
});

// 9. BONUS get all playlists
router.get('/', (req, res) => {
  let sql = 'SELECT * FROM playlist';
  const sqlValues = [];
  
  // 11. Filter title starts with
  if (req.query.title) {
    sql += ` WHERE title LIKE '${req.query.title}%'`;
    sqlValues.push(req.query.title);
  }
  // 12. Filter genre contains
  if (req.query.genre) {
    sql += ` WHERE genre LIKE '%${req.query.genre}%' `;
    sqlValues.push(req.query.genre);
  }

  connection.query(sql, sqlValues, (err, results) => {
    console.log(err)
    if (err) {
      res.status(500).send('Error getting the playlists');
    } else if (results.length === 0) {
      res.status(404).send('Site list not found')
    } else {
      res.json(results);
    }
  });
});

module.exports = router;