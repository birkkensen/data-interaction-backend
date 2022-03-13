import express from "express";
import mongodb from "mongodb";
import "dotenv/config";
import router from "./routes/productRoutes.js";

const app = express();

const mongoClient = new mongodb.MongoClient("mongodb://localhost:27017");

mongoClient.connect();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use("/api/products", router);

app.listen(PORT, () => {
  console.log(`Server is up and running on http://localhost:${PORT}`);
});
