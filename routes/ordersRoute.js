import express from "express";
import asyncHandler from "express-async-handler";
import db from "../database/mongodb.js";

const ordersRouter = express.Router();

const collection = db().collection("orders");

ordersRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const orderCursor = await collection.find({}).toArray();
    res.json(orderCursor).status(200).end();
  })
);

ordersRouter.get(
  "/:orderId",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.orderId);
    const orderCursor = await collection.find({ orderId: id }).toArray();
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
    await collection.insertOne(product);
    res.json(product).status(200).end();
  })
);

export default ordersRouter;
