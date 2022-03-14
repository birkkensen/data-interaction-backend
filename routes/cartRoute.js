import express from "express";
import asyncHandler from "express-async-handler";
import { cart } from "../database/collections.js";

const cartRouter = express.Router();

cartRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const cartCursor = await cart.find({}).toArray();
    if (!cartCursor.length) {
      res.status(302);
      res.json({ msg: "Cart is empty" });
    }
    res.json(cartCursor).status(200).end();
  })
);

cartRouter.post("/", async (req, res) => {
  const product = req.body;
  await cart.insertOne(product);
  res.json(product).status(200).end();
});

cartRouter.delete("/:id", async (req, res) => {
  const id = req.params.id;
  await cart.deleteOne({ productId: parseInt(id) });
  res.status(200).end();
});

export default cartRouter;
