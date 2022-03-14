import express from "express";
import asyncHandler from "express-async-handler";
import { orders } from "../database/collections.js";
import protect from "../middleware/authMiddleware.js";

const ordersRouter = express.Router();

ordersRouter.get(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const orderCursor = await orders.find({}).toArray();
    res.json(orderCursor).status(200).end();
  })
);

ordersRouter.get(
  "/:orderId",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.orderId);
    const orderCursor = await orders.find({ orderId: id }).toArray();
    if (!orderCursor.length) {
      res.status(400);
      throw new Error(`No order with id: ${id}`);
    }
    res.json(orderCursor);
  })
);

ordersRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const product = req.body;
    await orders.insertOne(product);
    res.json(product).status(200).end();
  })
);

export default ordersRouter;
