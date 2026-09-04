import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { normalizeRole } from './roles.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Re-exported so existing imports of normalizeRole from '@/lib/auth' keep working.
// Server code should feel free to keep importing it from here; client components
// must import it from '@/lib/roles' instead, since this file pulls in jsonwebtoken
// and bcryptjs, which cannot run in the browser bundle.
export { normalizeRole };

export const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

export const getTokenFromRequest = (req) => {
  // Next.js App Router route handlers receive a Fetch API Request/NextRequest,
  // whose `headers` is a Headers instance — it only exposes `.get(name)`, not
  // plain property access like `headers.authorization` (which is always
  // undefined and silently made every authenticated API call fail).
  const authHeader =
    typeof req.headers?.get === 'function'
      ? req.headers.get('authorization')
      : req.headers?.authorization;

  if (!authHeader) return null;

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;

  return parts[1];
};

export const getCurrentUser = (req) => {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  
  const decoded = verifyToken(token);
  return decoded;
};
