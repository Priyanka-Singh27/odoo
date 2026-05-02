import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'data', 'booking.sqlite');
const db = new Database(dbPath);

try {
  const email = 'suhail17mohammad@gmail.com';
  const result = db.prepare('DELETE FROM users WHERE email = ?').run(email);
  console.log(`✅ Deleted user with email: ${email}`);
  console.log(`Rows affected: ${result.changes}`);
  
  // Verify deletion
  const users = db.prepare('SELECT COUNT(*) as count FROM users').get();
  console.log(`Total users remaining: ${users.count}`);
} catch (err) {
  console.error('Error:', err.message);
}

db.close();
