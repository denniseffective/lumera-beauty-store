import jwt from 'jsonwebtoken';

export function authenticate(req, res, next) {
  const token = req.cookies?.lumera_token;
  if (!token || !process.env.JWT_SECRET) return res.status(401).json({ error: 'Please sign in to continue.' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Your session has expired. Please sign in again.' });
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role === 'admin') return next();
  return res.status(403).json({ error: 'Administrator access required.' });
}

export function notFound(req, res) { res.status(404).json({ error: 'Route not found.' }); }
export function errorHandler(error, req, res, next) {
  console.error(error);
  if (error.code === '23505') return res.status(409).json({ error: 'That product slug already exists.' });
  res.status(500).json({ error: 'Something went wrong. Please try again.' });
}
