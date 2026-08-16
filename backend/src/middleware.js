export function requireAdmin(req, res, next) {
  const supplied = req.get('x-admin-key');
  if (!process.env.ADMIN_API_KEY || supplied !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ error: 'Administrator access required.' });
  }
  next();
}

export function notFound(req, res) { res.status(404).json({ error: 'Route not found.' }); }
export function errorHandler(error, req, res, next) {
  console.error(error);
  if (error.code === '23505') return res.status(409).json({ error: 'That product slug already exists.' });
  res.status(500).json({ error: 'Something went wrong. Please try again.' });
}
