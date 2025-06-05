import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface DecodedToken {
  userId: string;
  iat: number;
  exp: number;
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: DecodedToken;
  }
}

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
    
    if (!token) {
        return res.sendStatus(401); 
    }
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err: any, user: any) => {
        if (err) {
        return res.sendStatus(403); 
        }
        req.user = user;
        next();
    });
}