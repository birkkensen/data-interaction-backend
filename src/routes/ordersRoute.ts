import express, { Router } from "express";
import protect from "../middleware/authMiddleware";
import { getAllOrders, createOrder, shipOrder } from "../controllers/ordersController";

const ordersRouter: Router = express.Router();

ordersRouter.route("/").get(getAllOrders, protect);

ordersRouter.route("/").post(createOrder);

ordersRouter.route("/:cartId").post(shipOrder);

export default ordersRouter;
