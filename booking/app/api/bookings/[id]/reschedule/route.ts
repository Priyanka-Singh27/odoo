import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const body = await req.json();
  const { slotId, resourceSlotId } = body;
  
  // Must provide either slotId (for provider) or resourceSlotId (for resource)
  if (!slotId && !resourceSlotId) {
    return NextResponse.json({ 
      error: "Either slotId or resourceSlotId is required" 
    }, { status: 400 });
  }

  const booking = db.prepare(`
    SELECT id, appointment_id, provider_id, resource_id, slot_id, resource_slot_id, people_count, status 
    FROM bookings 
    WHERE id = ?
  `).get(id) as any;
  
  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }
  
  if (booking.status === "cancelled") {
    return NextResponse.json({ error: "Cancelled booking cannot be rescheduled" }, { status: 409 });
  }

  const tx = db.transaction(() => {
    if (booking.provider_id && slotId) {
      // Provider-based reschedule
      const newSlot = db.prepare(`
        SELECT id, slot_date, start_time, end_time, capacity_total, capacity_booked, status 
        FROM slots 
        WHERE id = ? AND appointment_id = ? AND provider_id = ?
      `).get(slotId, booking.appointment_id, booking.provider_id) as any;
      
      if (!newSlot) {
        throw new Error("Target slot not found");
      }
      
      if (newSlot.status !== "available" || newSlot.capacity_booked + booking.people_count > newSlot.capacity_total) {
        throw new Error("Target slot not available");
      }

      // Release old slot
      db.prepare("UPDATE slots SET capacity_booked = MAX(0, capacity_booked - ?) WHERE id = ?").run(booking.people_count, booking.slot_id);
      db.prepare("UPDATE slots SET status = 'available' WHERE id = ?").run(booking.slot_id);
      
      // Allocate new slot
      db.prepare("UPDATE slots SET capacity_booked = capacity_booked + ? WHERE id = ?").run(booking.people_count, slotId);
      db.prepare("UPDATE slots SET status = 'full' WHERE id = ? AND capacity_booked >= capacity_total").run(slotId);
      
      // Update booking
      db.prepare(`
        UPDATE bookings 
        SET slot_id = ?, slot_date = ?, start_time = ?, end_time = ? 
        WHERE id = ?
      `).run(slotId, newSlot.slot_date, newSlot.start_time, newSlot.end_time, id);

    } else if (booking.resource_id && resourceSlotId) {
      // Resource-based reschedule
      const newResourceSlot = db.prepare(`
        SELECT id, slot_date, start_time, end_time, capacity_total, capacity_booked, status 
        FROM resource_slots 
        WHERE id = ? AND appointment_id = ? AND resource_id = ?
      `).get(resourceSlotId, booking.appointment_id, booking.resource_id) as any;
      
      if (!newResourceSlot) {
        throw new Error("Target resource slot not found");
      }
      
      if (newResourceSlot.status !== "available" || newResourceSlot.capacity_booked + booking.people_count > newResourceSlot.capacity_total) {
        throw new Error("Target resource slot not available");
      }

      // Release old resource slot
      db.prepare("UPDATE resource_slots SET capacity_booked = MAX(0, capacity_booked - ?) WHERE id = ?").run(booking.people_count, booking.resource_slot_id);
      db.prepare("UPDATE resource_slots SET status = 'available' WHERE id = ?").run(booking.resource_slot_id);
      
      // Allocate new resource slot
      db.prepare("UPDATE resource_slots SET capacity_booked = capacity_booked + ? WHERE id = ?").run(booking.people_count, resourceSlotId);
      db.prepare("UPDATE resource_slots SET status = 'full' WHERE id = ? AND capacity_booked >= capacity_total").run(resourceSlotId);
      
      // Update booking
      db.prepare(`
        UPDATE bookings 
        SET resource_slot_id = ?, slot_date = ?, start_time = ?, end_time = ? 
        WHERE id = ?
      `).run(resourceSlotId, newResourceSlot.slot_date, newResourceSlot.start_time, newResourceSlot.end_time, id);

    } else {
      throw new Error("Booking type mismatch: provider booking requires slotId, resource booking requires resourceSlotId");
    }
  });

  try {
    tx();
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 409 });
  }

  const updatedBooking = db.prepare("SELECT slot_date, start_time, end_time FROM bookings WHERE id = ?").get(id) as any;
  
  return NextResponse.json({ 
    data: { 
      id, 
      date: updatedBooking.slot_date, 
      startTime: updatedBooking.start_time, 
      endTime: updatedBooking.end_time 
    } 
  });
}
