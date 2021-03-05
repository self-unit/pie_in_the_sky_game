import url from 'url';
import express from 'express';
import { join } from 'path';
import bodyParser from 'body-parser';
import mongodb from 'mongodb';
import createRouter from './helpers/createRouter.js';

const { json } = bodyParser;
const { MongoClient } = mongodb;
const app = express();

const publicPath = join(url.fileURLToPath(new URL('.', import.meta.url)), '../client/public');
app.use(express.static(publicPath));

app.use(json());

const uri = 'mongodb://localhost:27017';

const client = MongoClient(uri);

async function run() {
  try {
    await client.connect();

    const db = await client.db('pieInTheSky');
    db.command({ ping: 1 });
    console.log('Connected successfully to db');
    const gamesCollection = db.collection('games');
    const gamesRouter = createRouter(gamesCollection);
    app.use('/api/games', gamesRouter);
  } finally {
    await client.close();
  }
}

await run().catch(console.dir);

app.listen(process.env.PORT || 3000, function () {
  console.log(`Listening on port ${this.address().port}, ${app.settings.env}`);
});
