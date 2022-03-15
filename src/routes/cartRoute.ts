import express from "express";
import asyncHandler from "express-async-handler";
import db from "../database/mongodb";

const cartRouter = express.Router();

cartRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const cartCursor = await db()?.cart.find({}).toArray();
    if (!cartCursor?.length) {
      res.status(302);
      res.json({ msg: "Cart is empty" });
    }
    res.json(cartCursor).status(200).end();
  })
);

cartRouter.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const product = await db()?.cart.findOneAndUpdate(
      { productId: id },
      { $set: req.body },
      { upsert: false }
    );
    if (product?.value) {
      res.status(200).json(product).end();
    } else {
      res.status(400);
      throw new Error("No such product in cart");
    }
  })
);

cartRouter.post("/", async (req, res) => {
  const product = req.body;
  const cartContent = await db()?.cart.find({}).toArray();
  const isAlreadyInCart = cartContent?.filter(
    (prod) => prod.productId === parseInt(product.productId)
  );
  if (isAlreadyInCart?.length) {
    await db()?.cart.findOneAndUpdate({ productId: req.body.productId }, { $inc: { qty: 1 } });
  } else {
    await db()?.cart.insertOne(product);
  }
  res.json(product).status(200).end();
});

cartRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const product = await db()?.cart.findOneAndDelete({ productId: parseInt(id) });
    if (product?.value) {
      res.status(200).json(product).end();
    } else {
      res.status(400);
      throw new Error("No such product in the cart");
    }
  })
);

export default cartRouter;
