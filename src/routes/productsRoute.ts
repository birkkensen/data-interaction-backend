import express, { Router } from "express";
import { getProducts, getProductsById } from "../controllers/productsController";

const productsRouter: Router = express.Router();

productsRouter.route("/").get(getProducts);

productsRouter.route("/:id").get(getProductsById);

export default productsRouter;
