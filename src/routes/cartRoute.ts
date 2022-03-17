import express, { Router, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Collection } from "mongodb";
import { collections } from "../database/mongodb";

const cartRouter: Router = express.Router();

const collection: Collection = collections.cart;

cartRouter.get(
  "/",
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const cartCursor = await collection.find({}).toArray();
    res.json(cartCursor).status(200).end();
  })
);

cartRouter.get("/count", async (req: Request, res: Response): Promise<void> => {
  const count: number = await collection.countDocuments({});
  res.json(count).status(200).end();
});

cartRouter.put(
  "/:id",
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id: number = parseInt(req.params.id);
    const product = await collection.findOneAndUpdate(
      { productId: id },
      { $set: req.body },
      { upsert: false }
    );
    if (product.value) {
      res.status(200).json(product).end();
    } else {
      res.status(400);
      throw new Error("No such product in cart");
    }
  })
);

cartRouter.post("/", async (req: Request, res: Response): Promise<void> => {
  const product = req.body;
  const cartContent = await collection.find({}).toArray();
  const isAlreadyInCart: boolean = cartContent.some(
    (prod) => prod.productId === parseInt(product.productId)
  );
  if (isAlreadyInCart) {
    await collection.findOneAndUpdate({ productId: req.body.productId }, { $inc: { qty: 1 } });
  } else {
    await collection.insertOne(product);
  }
  res.json(product).status(200).end();
});

cartRouter.delete(
  "/:id",
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id: number = parseInt(req.params.id);
    const product = await collection.findOneAndDelete({ productId: id });
    if (product.value) {
      res.status(200).json(product).end();
    } else {
      res.status(400);
      throw new Error("No such product in the cart");
    }
  })
);

export default cartRouter;
