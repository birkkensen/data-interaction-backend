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
    const cartItems: { _id: ObjectId; qty: number }[] = cartCursor?.cartItem;
    const productId: ObjectId[] = cartItems?.map((a: { _id: ObjectId; qty: number }) => a._id);
    if (productId) {
      const products = await productCollection.find({ _id: { $in: productId } }).toArray();
      const totalQty = await collection
        .aggregate([
          {
            $match: { _id: new ObjectId(id) },
          },
          {
            $group: { _id: "$cartItem.qty", qty: { $sum: "$qty" } },
          },
        ])
        .toArray();
      console.log(totalQty);
      res.json({ products, cartItems }).status(200).end();
    }
    res.status(400);
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
    const { _id, cartId }: { _id: string; cartId?: string } = req.body;
    const product = await productCollection.findOne({ _id: new ObjectId(_id) });
    const isInCart = await collection.find({ "cartItem._id": new ObjectId(_id) }).toArray();
    console.log(isInCart);
    if (isInCart.length && product) {
      await collection.updateOne(
        { _id: new ObjectId(cartId), "cartItem._id": new ObjectId(_id) },
        { $inc: { "cartItem.$.qty": 1 } }
      );
    } else if (product) {
      const response = await collection.updateOne(
        { _id: new ObjectId(cartId) },
        {
          $push: {
            cartItem: {
              _id: new ObjectId(_id),
              qty: 1,
            },
          },
        },
        { upsert: true }
      );
      console.log(response);
      res.status(200).send(response.upsertedId).end();
    }
    // if (product && !cartId) {
    //   const response = await collection.insertOne({
    //     cartItem: [
    //       {
    //         _id: new ObjectId(_id),
    //         qty: 1,
    //       },
    //     ],
    //   });
    //   res.status(200).send(response.insertedId).end();
    // }

    res.status(200).end();
  })
);

cartRouter.delete(
  "/",
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { cartId, id }: { cartId: string; id: string } = req.body;
    const cart = await collection.updateOne(
      { _id: new ObjectId(cartId) },
      { $pull: { cartItem: { _id: new ObjectId(id) } } }
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
