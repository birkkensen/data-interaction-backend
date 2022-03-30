import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import config from "../config";
import { Collection, ObjectId } from "mongodb";
import { collections } from "../database/mongodb";

const collection: Collection = collections.warehouse;

interface User {
  name: string;
  email: string;
  password: string;
}

const addUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { name, email, password }: User = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  const userExists = await collection.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists!");
  }
  const salt: string = await bcrypt.genSalt(10);
  const hashedPassword: string = await bcrypt.hash(password, salt);
  await collection.insertOne({
    name,
    email,
    password: hashedPassword,
  });

  const user = await collection.findOne({ email });
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
});

const loginUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email, password }: { email: string; password: string } = req.body;
  const user = await collection.findOne({ email });
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
});

const getUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const user = await collection.findOne({
    _id: req.user?._id,
  });
  res.status(200).json({
    id: user?._id,
    name: user?.name,
    email: user?.email,
  });
});

const generateToken = (id: ObjectId): string => {
  return jwt.sign({ id }, config.JWT_SECRET as string, {
    expiresIn: "30d",
  });
};

export { addUser, loginUser, getUser };
