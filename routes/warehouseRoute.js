import express from "express";
import mongodb from "mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { warehouse } from "../database/collections.js";
import asyncHandler from "express-async-handler";
import protect from "../middleware/authMiddleware.js";

const warehouseRouter = express.Router();

// Register warehouse worker
warehouseRouter.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Please add all fields");
    }

    const userExists = await warehouse.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists!");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await warehouse.insertOne({
      name,
      email,
      password: hashedPassword,
    });

    const user = await warehouse.findOne({ email });
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
    const user = await warehouse.findOne({ email });
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
  asyncHandler(async (req, res) => {
    const { _id, name, email } = await warehouse.findOne({
      _id: req.user._id,
    });
    res.status(200).json({
      id: _id,
      name,
      email,
    });
  })
);

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export default warehouseRouter;
