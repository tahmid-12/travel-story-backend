import jwt from 'jsonwebtoken';

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const authenticateToken = (req: any, res: any, next: any) => {
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