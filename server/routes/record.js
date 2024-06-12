import express from "express";

//This will help us connect to the database
import db from "../db/connection.js";

//This help convert the id from string to ObjectId for the _id
import { ObjectId } from "mongodb";

//router is an instance of the express router.
//We use it to define our routes
//The router will be added as a middleware and will take control of requests starting with path /record
const router = express.Router();

//constants
const collectionName = "collection1";

//This section will help you get a list of all the records
router.get("/", async (req, res) => {
  let collection = await db.collection(collectionName);
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
});

//This section will help you get a single record by id
router.get("/:id", async (req, res) => {
  let collection = await db.collection(collectionName);
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collection.findOne(query);

  if (!result) res.send("Not Found").status(404);
  else res.send(result).status(200);
});

//This section will help you create a new record
router.post("/", async (req, res) => {
  try {
    let newDocument = {
      name: req.body.name,
      position: req.body.position,
      level: req.body.level,
    };
    let collection = await db.collection(collectionName);
    let result = await collection.insertOne(newDocument);
    res.send(result).status(204);
  } catch (err) {
    console.log(err);
    res.send("Error adding record").status(500);
  }
});

//This section will help you update a record by id
router.patch("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        name: req.body.name,
        position: req.body.position,
        level: req.body.level,
      },
    };

    let collection = await db.collection(collectionName);
    let result = await collection.updateOne(query, updates);
    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.send("Error updating record").status(500);
  }
});

//This section will help you delete a record
router.patch("/:id", async (req, res) => {
  try {
    let query = { _id: new ObjectId(req.params.id) };
    let collection = await db.collection(collectionName);
    let result = await collection.deleteOne(query);
    res.send(result).status(200);
  } catch (err) {
    console.log(err);
    res.send("Error deleting record").status(500);
  }
});

export default router;
