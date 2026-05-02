import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'data', 'booking.sqlite');
const db = new Database(dbPath);

try {
  const users = db.prepare(`
    SELECT id, full_name, email, is_verified 
    FROM users 
    WHERE email IN ('customer@booking.local', 'organiser@booking.local', 'admin@booking.local')
  `).all();
  
  console.log('Seed users:');
  users.forEach(u => {
    console.log(`- ${u.email}: ${u.full_name} (verified: ${u.is_verified})`);
  });
  
  console.log('\n📝 Use these credentials to login (password: password123)');
} catch (err) {
  console.error('Error:', err.message);
}

db.close();
