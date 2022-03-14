import express from "express";
import db from "../database/mongodb.js";

const ordersRouter = express.Router();

const collection = db().collection("orders");

ordersRouter.get("/", async (req, res) => {
  const orderCursor = await collection.find({}).toArray();
  res.json(orderCursor).status(200).end();
});

ordersRouter.get("/:orderId", async (req, res) => {
  const id = parseInt(req.params.orderId);
  const productsCursor = await collection.find({ orderId: id }).toArray();
  res.json(productsCursor);
});

ordersRouter.post("/", async (req, res) => {
  const product = req.body;
  await collection.insertOne(product);
  res.json(product).status(200).end();
});

export default ordersRouter;
