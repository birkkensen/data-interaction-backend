import express, { Router } from "express";
import { getCart, addToCart, removeItemFromCart } from "../controllers/cartController";

const cartRouter: Router = express.Router();

cartRouter.route("/").post(addToCart).delete(removeItemFromCart);
cartRouter.route("/:id").get(getCart);

export default cartRouter;
