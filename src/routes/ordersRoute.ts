import express, { Router, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import protect from "../middleware/authMiddleware";
import { collections } from "../database/mongodb";
import { Collection } from "mongodb";

const ordersRouter: Router = express.Router();

const collection: Collection = collections.orders;

ordersRouter.get(
  "/",
  protect,
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const orderCursor = await collection.find({}).toArray();
    res.json(orderCursor).status(200).end();
  })
);

ordersRouter.get(
  "/:orderId",
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.orderId);
    const orderCursor = await collection.find({ orderId: id }).toArray();
    if (orderCursor.length) {
      res.status(400);
      throw new Error(`No order with id: ${id}`);
    }
    res.json(orderCursor);
  })
);

ordersRouter.post(
  "/",
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const product = req.body;
    await collection.insertOne(product);
    res.json(product).status(200).end();
  })
);

export default ordersRouter;
