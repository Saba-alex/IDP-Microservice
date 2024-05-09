import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Define a custom interface that extends the Request interface
interface AuthenticatedRequest extends Request {
  userId: string; // Add the userId property
}

export const authenticateUser = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.userId = decodedToken.userId; 
    next(); 
  } catch (err) {
    return res.status(401).json({ message: "Not authenticated" });
  }
};
