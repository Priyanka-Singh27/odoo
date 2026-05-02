import { db } from "@/lib/db";
import CustomerHomeClient from "@/components/booking/CustomerHomeClient";

export default function CustomerHome() {
  const appointments = db.prepare(`
    SELECT a.*, 
      (SELECT json_group_array(json_object('id', p.id, 'name', u.full_name))
       FROM appointment_providers ap 
       JOIN providers p ON p.id = ap.provider_id 
       JOIN users u ON u.id = p.user_id 
       WHERE ap.appointment_id = a.id) as provider_data
    FROM appointments a
    WHERE a.is_published = 1
  `).all();

  return <CustomerHomeClient appointments={appointments as any[]} />;
}
