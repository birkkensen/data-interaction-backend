import express, { Router, Request, Response } from "express";
import { Collection, ObjectId } from "mongodb";
import { collections } from "../database/mongodb";

const productsRouter: Router = express.Router();

const collection: Collection = collections.products;

productsRouter.get("/", async (req: Request, res: Response): Promise<void> => {
  const productsCursor = await collection.find({}).toArray();
  res.json(productsCursor).status(200).end();
});

productsRouter.get("/:id", async (req: Request, res: Response): Promise<void> => {
  const id: string = req.params.id;
  const product = await collection.findOne({ _id: new ObjectId(id) });
  if (product) {
    res.status(200).json(product).end();
  } else {
    res.status(400);
    throw new Error("No product with the id of " + id);
  }
});

productsRouter.post("/", async (req: Request, res: Response): Promise<void> => {
  const product = req.body;
  await collection.insertOne(product);
  res.json(product).status(200).end();
});

export default productsRouter;
