import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { Response, Request, NextFunction } from "express";
import { Collection, ObjectId } from "mongodb";
import config from "../config";
import { collections } from "../database/mongodb";

const collection: Collection = collections.warehouse;

interface JwtPayload {
  id: string;
}

const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let token;
    console.log(req.headers);
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      try {
        // Get token from header
        token = req.headers.authorization.split(" ")[1];
        // Verify token
        const decoded = jwt.verify(token, config.JWT_SECRET as string) as JwtPayload;
        // Get user from token
        const user = await collection.findOne({ _id: new ObjectId(decoded.id) });
        if (user) {
          req.user = user;
        }
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
  }
);

export default protect;
