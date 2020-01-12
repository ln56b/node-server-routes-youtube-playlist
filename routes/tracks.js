const express = require('express');
const connection = require('../conf');
const { handleSQLError, handleNotFound } = require('../handleSQLError');

const router = express.Router({ mergeParams: true });

// 3. Post a track into a playlist (doesn't work - query)
router.post('/tracks', (req, res) => {
  const trackData = {
    ...req.body,
    playlist_id: req.params.playlistId
  }.
  connection.query('INSERT INTO playlist SET ?', trackData, (err, results) => {
    if (err) {
      return handleSQLError(err, res);
    } 
    res.sendStatus(200);
  });
});

// 4. Get all tracks from playlist (doesn't work - message)
router.get('/tracks', (req, res) => {
  const showOne= req.params.playlistId;
  connection.query('SELECT * FROM playlist WHERE id = ?', [showOne], (err, results) => {
    if (err) {
      return handleSQLError(err, res);
    } 
    // if (results.length === 0) {
    //   return handleNotFound(`Playlist ${showOne} not found`, res)
    // } 
  const showAll= req.params.playlistId;
  connection.query('SELECT track.* FROM track JOIN playlist ON track.playlist_id = playlist.id  WHERE playlist_id = ?', [showAll], (err, results) => {
    if (err) {
      return handleSQLError(err, res);
    } 
    res.json(results);
    });
  });
});

// 7. Delete track from playlist (doesn't work - message)
router.delete('/tracks/:id', (req, res) => {
  const { idTrack , idPlaylist } = req.params;

  connection.query('DELETE FROM track WHERE playlist_id = ? AND id = ?', [idTrack, idPlaylist], (err, results) => {
    if (err) {
      return handleSQLError(err, res);
    }
    // if(results.affectedRows === 0) {
    //   return handleNotFound(`Track ${idTrack} not found on playlist ${idPlaylist}`, res)
    // }
    res.sendStatus(204);
  });
});

// 8. Update track from playlist (doesn't work - message)
router.put('/tracks/:id', (req, res) => {
  const { idPlaylist, idTrack } = req.params;

  connection.query('UPDATE track SET ? WHERE playlist_id = ? AND id = ? ', [req.body, idPlaylist, idTrack], (err, results) => {
  if (err) {
    return handleSQLError(err, res);
  } 
  // if(results.affectedRows === 0) {
  //   return handleNotFound(`Track ${idTrack} not found on playlist ${idPlaylist}`, res)
  // }
  connection.query('SELECT * FROM track WHERE playlist_id = ? AND id = ? ', [idPlaylist, idTrack], (err, results) => {
    return res.json(results[0]);
    })
  });
});

// 10. BONUS get all tracks
router.get('/tracks', (req, res) => {
  const showAll= 'SELECT * FROM track'
  connection.query(showAll, (err, results) => {
    console.log(err)
    if (err) {
      res.status(500).send('Error getting the tracks');
    } else {
      res.json(results);
    }
  });
});

module.exports = router;