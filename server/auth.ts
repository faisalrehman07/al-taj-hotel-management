import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const AUTH_SECRET = process.env.AUTH_SECRET || 'al-taj-secret-key-hassan-karnataka-2026';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(payload: { id: string; username: string; role: string }): string {
  return jwt.sign(payload, AUTH_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): { id: string; username: string; role: string } | null {
  try {
    return jwt.verify(token, AUTH_SECRET) as { id: string; username: string; role: string };
  } catch (err) {
    return null;
  }
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
    role: string;
  };
}

export function requireAdminAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  let token: string | undefined;

  // Check Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ success: false, message: 'Session expired or invalid. Please log in again.' });
  }

  req.user = decoded;
  next();
}
