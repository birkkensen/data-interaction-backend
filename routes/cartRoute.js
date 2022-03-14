import express from "express";
import db from "../database/mongodb.js";

const cartRouter = express.Router();

const collection = db().collection("cart");

cartRouter.get("/", async (req, res) => {
  const cartCursor = await collection.find({}).toArray();
  res.json(cartCursor).status(200).end();
});

cartRouter.post("/", async (req, res) => {
  const product = req.body;
  await collection.insertOne(product);
  res.json(product).status(200).end();
});

cartRouter.delete("/:id", async (req, res) => {
  const id = req.params.id;
  await collection.deleteOne({ productId: parseInt(id) });
  res.status(200).end();
});

export default cartRouter;
