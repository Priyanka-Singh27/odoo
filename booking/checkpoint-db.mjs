import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'data', 'booking.sqlite');
const db = new Database(dbPath);

try {
  // Force checkpoint and write pending data from WAL to main file
  db.pragma('wal_checkpoint(RESTART)');
  console.log('✅ Database checkpoint completed - WAL data committed to main file');
  
  // Verify users are there
  const users = db.prepare('SELECT COUNT(*) as count FROM users').get();
  console.log(`✅ Total users: ${users.count}`);
  
} catch (err) {
  console.error('Error:', err.message);
}

db.close();
