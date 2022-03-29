import express, { Router } from "express";
import { getCart, addToCart, removeItemFromCart } from "../controllers/cartController";

const cartRouter: Router = express.Router();

cartRouter.route("/:id").get(getCart);
cartRouter.route("/").post(addToCart).delete(removeItemFromCart);

export default cartRouter;
