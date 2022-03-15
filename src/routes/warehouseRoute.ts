import express, { Request } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import protect from "../middleware/authMiddleware";
import { ObjectId } from "mongodb";
import config from "../config";
import db from "../database/mongodb";

const warehouseRouter = express.Router();

export interface IGetUserAuthInfoRequest extends Request {
  user: ObjectId;
}
// Register warehouse worker
warehouseRouter.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Please add all fields");
    }

    const userExists = await db()?.warehouse.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists!");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await db()?.warehouse.insertOne({
      name,
      email,
      password: hashedPassword,
    });

    const user = await db()?.warehouse.findOne({ email });
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  })
);

// Login warehouse worker

warehouseRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await db()?.warehouse.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid credentials");
    }
  })
);

warehouseRouter.get(
  "/employee",
  protect,
  asyncHandler(async (req: any, res: any) => {
    const user = await db()?.warehouse.findOne({
      _id: req.user._id,
    });
    res.status(200).json({
      id: user?._id,
      name: user?.name,
      email: user?.email,
    });
  })
);

const generateToken = (id: ObjectId) => {
  return jwt.sign({ id }, config.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export default warehouseRouter;
