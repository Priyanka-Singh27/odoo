import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import bcryptjs from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'data', 'booking.sqlite');
const db = new Database(dbPath);

try {
  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      full_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'customer',
      is_active INTEGER DEFAULT 1,
      is_verified INTEGER DEFAULT 0,
      otp_code TEXT,
      otp_expires_at INTEGER,
      otp_purpose TEXT,
      created_at INTEGER DEFAULT (cast(strftime('%s', 'now') as int)),
      updated_at INTEGER DEFAULT (cast(strftime('%s', 'now') as int))
    );
  `);

  // Hash password
  const password = 'Suhail123!';
  const passwordHash = bcryptjs.hashSync(password, 10);

  // Insert test user
  const userId = crypto.randomUUID();
  db.prepare(`
    INSERT INTO users (id, full_name, email, password_hash, role, is_active, is_verified)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(userId, 'Suhail', 'suhail17mohammad@gmail.com', passwordHash, 'customer', 1, 1);

  console.log('✅ Database seeded successfully!');
  
  // Verify
  const user = db.prepare('SELECT id, full_name, email, is_verified FROM users WHERE email = ?').get('suhail17mohammad@gmail.com');
  console.log('User created:', user);
} catch (err) {
  console.error('Error seeding database:', err.message);
}

db.close();
