import { Router } from "express";
import db from "../database/mongodb";

const productsRouter = Router();

productsRouter.get("/", async (req, res) => {
  const productsCursor = await db()?.products.find({}).toArray();
  res.json(productsCursor).status(200).end();
});

productsRouter.post("/", async (req, res) => {
  const product = req.body;
  await db()?.products.insertOne(product);
  res.json(product).status(200).end();
});

// productsRouter.delete("/:id", async (req, res) => {
//   const id = req.params.id;
//   await collection.deleteOne({ productId: parseInt(id) });
//   res.status(200).end();
// });

export default productsRouter;
