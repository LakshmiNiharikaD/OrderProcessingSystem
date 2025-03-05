import { Request, Response, NextFunction, RequestHandler } from "express";
import * as jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  userId?: string;
}

const API_KEY = process.env.API_KEY;

export const authMiddleware: RequestHandler = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): any => {
  const apiKey = req.headers["x-api-key"];
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  // Validate x-api-key
  if (apiKey && apiKey === API_KEY) {
    return next();
  }

  // Validate JWT token
  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized: No token or API key provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
    };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Forbidden: Invalid token or API key" });
  }
};
