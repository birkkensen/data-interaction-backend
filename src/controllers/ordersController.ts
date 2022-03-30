import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { collections } from "../database/mongodb";
import { Collection, ObjectId } from "mongodb";

const collection: Collection = collections.orders;

const getAllOrders = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const orderCursor = await collection.find({}).toArray();
  res.json(orderCursor).status(200).end();
});

const createOrder = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { formData, cartId }: { formData: {}; cartId: string } = req.body;
  const cart = await collections.cart.findOne({ _id: new ObjectId(cartId) });
  await collection.insertOne({
    formData,
    cart,
  });
  res.status(200).end();
});

const shipOrder = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const cartId = req.params.cartId;
  await collection.updateOne(
    { _id: new ObjectId(cartId) },
    { $set: { "formData.orderStatus": "Shipped" } }
  );
  res.status(200).end();
});

export { getAllOrders, createOrder, shipOrder };
