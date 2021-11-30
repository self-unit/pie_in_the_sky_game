/* eslint-disable no-console */
import { URL, fileURLToPath } from 'url';
import e from 'express';
import path from 'path';
import mongodb from 'mongodb';
import createRouter from './helpers/createRouter.js';

const { json } = e;
const { MongoClient } = mongodb;
const { join } = path;

const PORT = process.env.PORT || 3000;
const app = e();

const publicPath = join(fileURLToPath(new URL('.', import.meta.url)), '../client/public');
app.use(e.static(publicPath));
app.use(json());

/** @type {string} */
const uri = 'mongodb://localhost:27017';

const client = new MongoClient(uri);

/** @param {mongodb.MongoClient} dbclient */
const listDatabases = async (dbclient) => {
  const databasesList = await dbclient.db().admin().listDatabases();
  console.log('Databases:');
  databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
};

/**
 * @returns {Promise<void>}
 */
async function run() {
  try {
    await client.connect();

    await listDatabases(client);

    const db = client.db('pieInTheSky');
    db.command({ ping: 1 });
    console.info('Connected successfully to db');
    const gamesCollection = db.collection('games');
    const gamesRouter = createRouter(gamesCollection);
    app.use('/api/games', gamesRouter);

    app.listen(PORT, () => {
      console.info(`Listening on port ${PORT}, ${app.settings.env}`);
    });
  } catch (err) {
    console.error('Connection to DB failed', err);
  } finally {
    await client.close();
  }
}

await run();
