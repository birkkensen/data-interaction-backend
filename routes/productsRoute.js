import express from "express";
import { products } from "../database/collections.js";

const productsRouter = express.Router();

productsRouter.get("/", async (req, res) => {
  const productsCursor = await products.find({}).toArray();
  res.json(productsCursor).status(200).end();
});

productsRouter.post("/", async (req, res) => {
  const product = req.body;
  await products.insertOne(product);
  res.json(product).status(200).end();
});

// productsRouter.delete("/:id", async (req, res) => {
//   const id = req.params.id;
//   await collection.deleteOne({ productId: parseInt(id) });
//   res.status(200).end();
// });

export default productsRouter;
