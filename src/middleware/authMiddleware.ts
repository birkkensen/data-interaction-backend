import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import db from "../database/mongodb";
import { ObjectId } from "mongodb";
import config from "../config";

const protect = asyncHandler(async (req: any, res: any, next) => {
  let token: any;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];
      // Verify token
      const decoded: any = jwt.verify(token, config.JWT_SECRET);
      // Get user from token
      req.user = await db()?.warehouse.findOne({ _id: new ObjectId(decoded.id) });
      next();
    } catch (err) {
      console.log(err);
      res.status(401);
      throw new Error("Not authorized");
    }
  }
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

export default protect;
