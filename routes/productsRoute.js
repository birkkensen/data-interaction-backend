import express from "express";
import db from "../database/mongodb.js";

const productsRouter = express.Router();

const collection = db().collection("products");

productsRouter.get("/", async (req, res) => {
  const productsCursor = await collection.find({}).toArray();
  res.json(productsCursor).status(200).end();
});

productsRouter.post("/", async (req, res) => {
  const product = req.body;
  await collection.insertOne(product);
  res.json(product).status(200).end();
});

// productsRouter.delete("/:id", async (req, res) => {
//   const id = req.params.id;
//   await collection.deleteOne({ productId: parseInt(id) });
//   res.status(200).end();
// });

export default productsRouter;
