const express = require('express');
const app = express();
const path = require('path');
const parser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const createRouter = require('./helpers/create_router.js');

const publicPath = path.join(__dirname, '../client/public');
app.use(express.static(publicPath));

app.use(parser.json());

MongoClient.connect('mongodb://heroku_sdpqx20n:vu751c1jh8j0ciigp6to9k7093@ds151840.mlab.com:51840/heroku_sdpqx20n')
  .then((client) => {
    const db = client.db('heroku_sdpqx20n');
    const gamesCollection = db.collection('games');
    const gamesRouter = createRouter(gamesCollection);
    app.use('/api/games', gamesRouter);
  })
  .catch(console.err);

app.listen(process.env.PORT || 8080, function () {
  console.log(`Listening on port ${this.address().port}, ${app.settings.env}`);
});
