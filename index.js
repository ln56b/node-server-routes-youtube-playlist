const express = require('express');
const bodyParser = require('body-parser');
const playlistRouter = require('./routes/playlists');

const app = express();
const port = 1000;
app.use(bodyParser.json());
app.use('/api/playlists', playlistRouter);

/* GET index page. */
app.get('/', (req, res) => {
  res.json({
    title: 'YOUTUBE PLAYLIST'
  });
});

app.listen(port, err => {
  if (err) {
    throw new Error('Impossible connection to the port');
  }
  console.log(`Server is listening port ${port}`);
});