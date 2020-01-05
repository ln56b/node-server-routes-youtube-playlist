const express = require('express');
const app = express();
const port = 2000;

const bodyParser = require('body-parser');

const connection = require('./conf');

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

/* GET index page. */
app.get('/', (req, res) => {
  res.json({
    title: 'YOUTUBE PLAYLIST'
  });
});

// 1. Post a playlist
app.post('/api/playlist', (req, res) => {
  const playlistData = req.body;
  connection.query('INSERT INTO playlist SET ?', playlistData, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error saving a new playlist');
    } else {
      res.sendStatus(200);
    }
  });
});

// 2. Get a playlist by id
app.get('/api/playlists/:id', (req, res) => {
  const showOne= req.params.id;
  connection.query('SELECT * FROM playlist WHERE id = ?', [showOne], (err, results) => {
    if (err) {
      res.status(500).send(`Error when getting the playlist ${err.message}`);
    } 
    if (results.length === 0) {
      res.status(404).send('Playlist not found')
    } else {
      res.json(results[0]);
    }
  });
});

// 3. Post a track into a playlist
app.post('/api/track', (req, res) => {
  const trackData = req.body;
  connection.query('INSERT INTO track SET ?', trackData, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error saving a new track');
    } else {
      res.sendStatus(200);
    }
  });
});

// 4. Get all songs from playlist
app.get('/api/playlists/:id/tracks', (req, res) => {
  const showOne= req.params.id;
  connection.query('SELECT track.* FROM track JOIN playlist ON track.playlist_id = playlist.id  WHERE playlist_id = ?', [showOne], (err, results) => {
    if (err) {
      res.status(500).send(`Error when getting the movie ${err.message}`);
    } 
    if (results.length === 0) {
      res.status(404).send('Movie not found')
    } else {
      res.json(results);
    }
  });
});

// 5. Delete a playlist
app.delete('/api/playlists/:id', (req, res) => {
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
app.put('/api/playlists/:id', (req, res) => {
  const playlistData = req.body;
  const idPlaylist = req.params.id;
  connection.query('UPDATE site SET ? WHERE id = ?', [playlistData, idPlaylist], (err) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error updating a new playlist');
    } else {
      res.sendStatus(200);
    }
  });
});

// 7. Delete track from playlist
app.delete('/api/playlists/:id/tracks/:id', (req, res) => {
  const idPlaylist = req.params.id;
  const idTrack = req.params.id;
  connection.query('DELETE track.* FROM playlist JOIN track ON playlist.id = track.playlist_id WHERE playlist.id = ? AND track.id = ? ', [idTrack, idPlaylist], (err) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error deleting a track from playlist');
    } else {
      res.sendStatus(200);
    }
  });
});

// 8. Update track from playlist
app.put('/api/playlists/:id/tracks/:id', (req, res) => {
  const idPlaylist = req.params.id;
  const idTrack = req.params.id;
  connection.query('UPDATE track SET ? WHERE track.playlist_id = ? AND track.id = ? ', [idTrack, idPlaylist], (err) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error updating a playlist');
    } else {
      res.sendStatus(200);
    }
  });
});

// 9. BONUS get all playlists
app.get('/api/playlists', (req, res) => {
  let sql = 'SELECT * FROM playlist';
  const sqlValues = [];

   // 11. Filter country starts with
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

// 10. BONUS get all tracks
app.get('/api/tracks', (req, res) => {
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


app.listen(port, err => {
  if (err) {
    throw new Error('Impossible connection to the port');
  }
  console.log(`Server is listening port ${port}`);
});

