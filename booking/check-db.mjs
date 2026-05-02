import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'data', 'booking.sqlite');
const db = new Database(dbPath);

try {
  const users = db.prepare('SELECT id, full_name, email, is_verified, created_at FROM users').all();
  console.log(`Total users in database: ${users.length}`);
  console.log(JSON.stringify(users, null, 2));
} catch (err) {
  console.error('Error querying database:', err.message);
}

db.close();
