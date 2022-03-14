import express from "express";
import "dotenv/config";
import { productsRouter, ordersRouter, cartRouter } from "./routes/index.js";

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use("/api/products", productsRouter);

app.use("/api/orders", ordersRouter);

app.use("/api/cart", cartRouter);

app.listen(PORT, () => {
  console.log(`Server is up and running on http://localhost:${PORT}`);
});
