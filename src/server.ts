import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";

import { productsRouter, ordersRouter, cartRouter, warehouseRouter } from "./routes/index";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use("/api/products", productsRouter);

app.use("/api/orders", ordersRouter);

app.use("/api/cart", cartRouter);

app.use("/api/warehouse", warehouseRouter);

app.listen(PORT, () => {
  console.log(`Server is up and running on http://localhost:${PORT}`);
});
