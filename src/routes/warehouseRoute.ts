import express, { Router } from "express";
import protect from "../middleware/authMiddleware";
import { addUser, loginUser, getUser } from "../controllers/warehouseController";

const warehouseRouter: Router = express.Router();

// Register warehouse worker

warehouseRouter.route("/register").post(addUser);
// Login warehouse worker

warehouseRouter.route("/login").post(loginUser);

warehouseRouter.route("/employee").get(getUser, protect);

export default warehouseRouter;
