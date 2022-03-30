import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Collection, ObjectId } from "mongodb";
import { collections } from "../database/mongodb";

const collection: Collection = collections.cart;
const productCollection: Collection = collections.products;

const getCart = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const cartId: string = req.params.id;

  // Get the cart and extract the productIDs
  const cartCursor = await collection.findOne({ _id: new ObjectId(cartId) });
  const cartItems: { _id: ObjectId; qty: number }[] = cartCursor?.cartItems;
  const productIds: ObjectId[] = cartItems?.map((a: { _id: ObjectId; qty: number }) => a._id);

  if (productIds) {
    const products = await productCollection.find({ _id: { $in: productIds } }).toArray();
    const totalQty = await collection
      .aggregate([
        {
          $match: { _id: new ObjectId(cartId) },
        },
        {
          $addFields: { qty: { $sum: "$cartItems.qty" } },
        },
      ])
      .toArray();
    // Add totalQty & totalCost to each product
    const cart = products.map((product, i) => {
      const qty: { qty: number } = { qty: cartItems[i].qty };
      const totalCost = { total: products[i].price * qty.qty };
      product = { ...product, ...qty };
      product = { ...product, ...totalCost };
      return product;
    });

    res.json({ products: cart, totalQty: totalQty[0].qty }).status(200).end();
  }

  res.status(400);
});

const addToCart = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { _id, cartId }: { _id: string; cartId?: string } = req.body;

  const product = await productCollection.findOne({ _id: new ObjectId(_id) });
  const isInCart = await collection.findOne({
    _id: new ObjectId(cartId),
    "cartItems._id": new ObjectId(_id),
  });
  // TODO Remeber change

  if (isInCart && product) {
    await collection.updateOne(
      { _id: new ObjectId(cartId), "cartItems._id": new ObjectId(_id) },
      { $inc: { "cartItems.$.qty": 1 } }
    );
    res.status(200).end();
  } else if (product && cartId) {
    const response = await collection.updateOne(
      { _id: new ObjectId(cartId) },
      {
        $push: {
          cartItems: {
            _id: new ObjectId(_id),
            qty: 1,
          },
        },
      },
      { upsert: true }
    );
    res.status(200).send(response.upsertedId).end();
  } else if (product) {
    const response = await collection.insertOne({
      cartItems: [{ _id: new ObjectId(_id), qty: 1 }],
    });
    res.status(200).send(response.insertedId).end();
  }

  res.status(400).end();
});

interface IDelete {
  clear: string;
  cartId: string;
  id: string;
}
const removeItemFromCart = asyncHandler(
  async (req: Request<{}, {}, {}, IDelete>, res: Response): Promise<void> => {
    const { query } = req;
    if (query.clear !== "undefined") {
      await collection.deleteMany({});
      res.status(200).end();
    } else {
      await collection.updateOne(
        { _id: new ObjectId(query.cartId) },
        { $pull: { cartItems: { _id: new ObjectId(query.id) } } }
      );
    }

    res.status(200).end();
  }
);

export { getCart, addToCart, removeItemFromCart };
