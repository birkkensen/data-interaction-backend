import { Router } from "express";
import asyncHandler from "express-async-handler";
import db from "../database/mongodb";
import protect from "../middleware/authMiddleware";

const ordersRouter = Router();

ordersRouter.get(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const orderCursor = await db()?.orders.find({}).toArray();
    res.json(orderCursor).status(200).end();
  })
);

ordersRouter.get(
  "/:orderId",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.orderId);
    const orderCursor = await db()?.orders.find({ orderId: id }).toArray();
    if (!orderCursor?.length) {
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
    await db()?.orders.insertOne(product);
    res.json(product).status(200).end();
  })
);

export default ordersRouter;
