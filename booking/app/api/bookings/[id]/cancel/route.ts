import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  
  const booking = db.prepare(`
    SELECT id, slot_id, resource_slot_id, people_count, status, provider_id, resource_id 
    FROM bookings 
    WHERE id = ?
  `).get(id) as any;
  
  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }
  
  if (booking.status === "cancelled") {
    return NextResponse.json({ data: { id, status: "cancelled" } });
  }

  const tx = db.transaction(() => {
    // Update booking status
    db.prepare("UPDATE bookings SET status = 'cancelled' WHERE id = ?").run(id);
    
    // Release capacity and restore slot status based on booking type
    if (booking.provider_id && booking.slot_id) {
      // Provider-based booking: release from slots table
      db.prepare(`
        UPDATE slots 
        SET capacity_booked = MAX(0, capacity_booked - ?) 
        WHERE id = ?
      `).run(booking.people_count, booking.slot_id);
      
      db.prepare("UPDATE slots SET status = 'available' WHERE id = ?").run(booking.slot_id);
    } else if (booking.resource_id && booking.resource_slot_id) {
      // Resource-based booking: release from resource_slots table
      db.prepare(`
        UPDATE resource_slots 
        SET capacity_booked = MAX(0, capacity_booked - ?) 
        WHERE id = ?
      `).run(booking.people_count, booking.resource_slot_id);
      
      db.prepare("UPDATE resource_slots SET status = 'available' WHERE id = ?").run(booking.resource_slot_id);
    }
  });
  
  tx();

  return NextResponse.json({ data: { id, status: "cancelled" } });
}
