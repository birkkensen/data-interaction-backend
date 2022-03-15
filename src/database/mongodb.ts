import { MongoClient } from "mongodb";

const db = () => {
  try {
    const mongoClient = new MongoClient("mongodb://localhost:27017");
    if (!mongoClient.connect()) {
      mongoClient.connect();
    }
    const db = mongoClient.db("data-interaction");
    const collections = {
      cart: db.collection("cart"),
      orders: db.collection("orders"),
      products: db.collection("products"),
      warehouse: db.collection("warehouse"),
    };
    return collections;
  } catch (err) {
    console.error(err);
  }
};

export default db;
