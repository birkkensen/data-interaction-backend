import express, { Router, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Collection, ObjectId } from "mongodb";
import { collections } from "../database/mongodb";

const cartRouter: Router = express.Router();

const collection: Collection = collections.cart;
const productCollection: Collection = collections.products;

cartRouter.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id: string = req.params.id;
    const cartCursor = await collection.findOne({ _id: new ObjectId(id) });
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
      await collection.updateOne(
        { _id: new ObjectId(cartId) },
        {
          $push: {
            products: {
              _id: new ObjectId(),
              product,
            },
          },
        },
        { upsert: true } // TODO: Remove when deploying
      );
      // await collection.findOneAndUpdate({ _id: new ObjectId(_id) }, { $inc: { qty: 1 } });
      res.status(200).end();
    } else {
      if (product) {
        const response = await collection.insertOne({
          products: [
            {
              _id: new ObjectId(),
              product: product,
            },
          ],
        });
        res.send(response.insertedId).status(200).end();
      }
    }

    res.status(400);
  })
);

cartRouter.delete(
  "/",
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { cartId, id }: { cartId: string; id: string } = req.body;
    const cart = await collection.updateOne(
      { _id: new ObjectId(cartId) },
      { $pull: { products: { _id: new ObjectId(id) } } }
    );
    // if (product.acknowledged) {
    //   res.status(200).json(product).end();
    // } else {
    //   res.status(400);
    //   throw new Error("No such product in the cart");
    // }
    res.json(cart).end();
  })
);

cartRouter.delete(
  "/clear",
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await collection.deleteMany({});
    res.status(200).end();
  })
);

export default cartRouter;
