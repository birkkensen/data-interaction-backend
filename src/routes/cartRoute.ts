import express, { Router, Request, Response, CookieOptions } from "express";
import asyncHandler from "express-async-handler";
import { Collection, ObjectId, WithId } from "mongodb";
import { collections } from "../database/mongodb";

const cartRouter: Router = express.Router();

const collection: Collection = collections.cart;
const productCollection: Collection = collections.products;

cartRouter.get(
  "/",
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const cartCursor = await collection.find({}).toArray();
    res.json(cartCursor).status(200).end();
  })
);

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

cartRouter.post(
  "/",
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { _id, cartId }: { _id: ObjectId; cartId?: ObjectId } = req.body;
    const product = await productCollection.findOne({ _id: new ObjectId(_id) });
    if (cartId && product) {
      const test = await collection.updateOne(
        { _id: new ObjectId(cartId) },
        { $push: { products: product } }
      );
      // await collection.findOneAndUpdate({ _id: new ObjectId(_id) }, { $inc: { qty: 1 } });
      res.json(test).status(200).end();
    } else {
      if (product) {
        const response = await collection.insertOne({ products: [product] });
        res.json({ cartId: response.insertedId }).status(200).end();
      }
    }

    res.status(400);
  })
);

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

cartRouter.delete(
  "/",
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await collection.deleteMany({});
    res.status(200).end();
  })
);

export default cartRouter;
