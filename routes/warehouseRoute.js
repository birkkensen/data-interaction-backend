import express from "express";
import bcrypt from "bcrypt";
import db from "../database/mongodb.js";
import asyncHandler from "express-async-handler";

const warehouseRouter = express.Router();

const collection = db().collection("warehouse");

warehouseRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Please add all fields");
    }

    const userExists = await collection.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists!");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await collection.insertOne({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  })
);

warehouseRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await collection.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      res.status(400);
      throw new Error("Invalid credentials");
    }
  })
);

warehouseRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const users = await collection.find({}).toArray();
    res.json(users).status(200).end();
  })
);

export default warehouseRouter;
