import express, { static } from 'express';
import { json } from 'body-parser';
import { MongoClient } from 'mongodb';
import { join } from 'path';
import createRouter from './helpers/createRouter';

const app = express();
const publicPath = join(__dirname, '../client/public');
app.use(static(publicPath));

app.use(json());

try {
  const client = await MongoClient.connect(
    'mongodb://heroku_sdpqx20n:vu751c1jh8j0ciigp6to9k7093@ds151840.mlab.com:51840/heroku_sdpqx20n',
  );
  const db = client.db('heroku_sdpqx20n');
  const gamesCollection = db.collection('games');
  const gamesRouter = createRouter(gamesCollection);
  app.use('/api/games', gamesRouter);
} catch (err) {
  throw new Error('Invaid connection to MongoClient');
}
app.listen(process.env.PORT || 8080, function () {
  console.log(`Listening on port ${this.address().port}, ${app.settings.env}`);
});
