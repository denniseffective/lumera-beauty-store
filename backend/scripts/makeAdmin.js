import 'dotenv/config';
import { pool, query } from '../src/db.js';
const email = process.argv[2]?.toLowerCase();
if (!email) { console.error('Usage: npm run make-admin -- email@example.com'); process.exitCode = 1; }
else { const result = await query("UPDATE users SET role='admin' WHERE email=$1 RETURNING email,role", [email]); if (!result.rowCount) { console.error('No account found. Register first.'); process.exitCode = 1; } else console.log(`${result.rows[0].email} is now an administrator.`); }
await pool.end();
