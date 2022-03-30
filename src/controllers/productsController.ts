import { Request, Response } from "express";
import { Collection, ObjectId } from "mongodb";
import { collections } from "../database/mongodb";
import asyncHandler from "express-async-handler";

const collection: Collection = collections.products;

const getProducts = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  let filter = {};
  const query = req.query;
  if (query.name) {
    filter = { name: { $regex: `${query.name}`, $options: "i" } };
  }
  const productsCursor = await collection.find(filter).toArray();
  res.json(productsCursor).status(200).end();
});

const getProductsById = asyncHandler(async (req: Request, res: Response) => {
  const id: string = req.params.id;
  const product = await collection.findOne({ _id: new ObjectId(id) });
  if (product) {
    res.status(200).json(product).end();
  } else {
    res.status(400);
    throw new Error("No product with the id of " + id);
  }
});

export { getProducts, getProductsById };
