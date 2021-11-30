/* eslint-disable no-console */
import express from 'express';
import mongodb from 'mongodb';

const { Router } = express;
const { ObjectId } = mongodb;

/**
 *
 * @param {mongodb.Collection<any>} collection
 * @returns {express.Router}
 */
export default function createRouter(collection) {
  const router = Router();

  router.route('/').get((req, res) => {
    collection
      .find()
      .toArray()
      .then((docs) => res.json(docs))
      .catch((err) => {
        console.error(err);
        res.status(500);
        res.json({ status: 500, error: err });
      });
  });

  router.route('/:id').get((req, res) => {
    const { id } = req.params;
    collection
      .find({ dbId: new ObjectId(id) })
      .toArray()
      .then((docs) => res.json(docs))
      .catch((err) => {
        console.error(err);
        res.status(500);
        res.json({ status: 500, error: err });
      });
  });

  router.route('/').post((req, res) => {
    const newData = req.body;
    collection
      .insertOne(newData)
      .then((docs) => res.json(docs))
      .catch((err) => console.error(err));
  });

  router.route('/:id').put((req, res) => {
    console.debug(req);
    const { id } = req.params;
    const updatedData = req.body;
    collection
      .updateOne({ dbId: new ObjectId(id) }, { $set: updatedData })
      .then(() => {
        collection
          .find()
          .toArray()
          .then((docs) => res.json(docs));
      })
      .catch((err) => {
        console.error(err);
        res.status(500);
        res.json({ status: 500, error: err });
      });
  });

  router.route('/:id').delete((req, res) => {
    const { id } = req.params;
    collection
      .deleteOne({ dbId: new ObjectId(id) })
      .then(() => {
        collection
          .find()
          .toArray()
          .then((docs) => res.json(docs));
      })
      .catch((err) => {
        console.error(err);
        res.status(500);
        res.json({ status: 500, error: err });
      });
  });

  return router;
}
