import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export type UserRole = "user" | "admin";
// 1. Define a strict interface for the Payload
interface TokenPayload {
  userId: string;
  role: UserRole;
  iat: number;
  exp: number;
}

export interface AuthRequest extends Request {
  user?: TokenPayload;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string | undefined;

    // 2. Defensive check for Authorization Header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please log in.",
      });
    }

    // 3. Verify Secret exists (Prevents silent failures)
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("FATAL ERROR: JWT_SECRET is not defined in environment variables.");
      return res.status(500).json({ success: false, message: "Internal server configuration error" });
    }

    // 4. Verify Token
    const decoded = jwt.verify(token, secret) as TokenPayload;

    // OPTIONAL: Check if user still exists in DB here
    // const currentUser = await User.findById(decoded.id);
    // if (!currentUser) return res.status(401)...

    req.user = decoded;
    next();
  } catch (error: any) {
    // 5. Context-aware error messages
    let message = "Invalid token";
    if (error.name === "TokenExpiredError") {
      message = "Your session has expired. Please log in again.";
    }

    return res.status(401).json({
      success: false,
      message,
    });
  }
};