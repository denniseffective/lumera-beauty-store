import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from './db.js';
import { authenticate } from './middleware.js';
import { loginSchema, registerSchema } from './validation.js';

export const authRouter = Router();

function setSession(res, user) {
  const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.cookie('lumera_token', token, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

authRouter.post('/register', async (req, res, next) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Enter a valid name, email, and password of at least 8 characters.' });
    const { name, email, password } = parsed.data;
    const passwordHash = await bcrypt.hash(password, 12);
    const result = await query('INSERT INTO users(name,email,password_hash) VALUES($1,$2,$3) RETURNING id,name,email,role', [name, email, passwordHash]);
    await query('INSERT INTO carts(user_id) VALUES($1)', [result.rows[0].id]);
    setSession(res, result.rows[0]);
    res.status(201).json({ data: result.rows[0] });
  } catch (error) {
    if (error.code === '23505') return res.status(409).json({ error: 'An account with this email already exists.' });
    next(error);
  }
});

authRouter.post('/login', async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Enter a valid email and password.' });
    const result = await query('SELECT id,name,email,role,password_hash FROM users WHERE email=$1', [parsed.data.email]);
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(parsed.data.password, user.password_hash))) return res.status(401).json({ error: 'Incorrect email or password.' });
    const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role };
    setSession(res, safeUser);
    res.json({ data: safeUser });
  } catch (error) { next(error); }
});

authRouter.post('/logout', (req, res) => {
  res.clearCookie('lumera_token', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
  res.status(204).end();
});

authRouter.get('/me', authenticate, async (req, res, next) => {
  try {
    const result = await query('SELECT id,name,email,role FROM users WHERE id=$1', [req.user.id]);
    if (!result.rows[0]) return res.status(401).json({ error: 'Account not found.' });
    res.json({ data: result.rows[0] });
  } catch (error) { next(error); }
});
