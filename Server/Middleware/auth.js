import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const secretKey = process.env.JWT_SECRET;

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied, no token' });

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;  // שומר את כל המידע של המשתמש מהטוקן
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function isAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied, admin only' });
  }
  next();
}

export { verifyToken, isAdmin };
