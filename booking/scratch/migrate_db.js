const Database = require('better-sqlite3');
const db = new Database('booking.db');

try {
  db.prepare("ALTER TABLE appointments ADD COLUMN location TEXT").run();
  console.log("Added location column");
} catch (e) {
  console.log("location column might already exist or error:", e.message);
}

try {
  db.prepare("ALTER TABLE appointments ADD COLUMN appointment_type TEXT DEFAULT 'user'").run();
  console.log("Added appointment_type column");
} catch (e) {
  console.log("appointment_type column might already exist or error:", e.message);
}

db.close();
