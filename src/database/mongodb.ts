import { MongoClient, Db } from "mongodb";

const mongoClient: MongoClient = new MongoClient("mongodb://localhost:27017");

mongoClient.connect();

const db: Db = mongoClient.db("data-interaction");

export const collections = {
  cart: db.collection("cart"),
  orders: db.collection("orders"),
  products: db.collection("products"),
  warehouse: db.collection("warehouse"),
};
