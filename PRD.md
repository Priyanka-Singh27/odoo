# Appointment App — User Role Flows

---

## 1. Customer (End User)

### Authentication & Onboarding

The customer begins by signing up with their full name, email, and password, or logging in if they already have an account. After signup, they must verify their account via OTP. If they forget their password, a dedicated forgot password flow is available. This auth flow is shared across all three roles.

### Home / Appointment Overview

Once logged in, the customer lands on the home screen where they can browse all available appointment types and services. A prominent "Book Appointment" quick-action button drives them into the booking flow.

### Booking Flow (step by step)

This is the most detailed flow in the app:

1. The customer selects a service or appointment type from the published list.
2. They choose a specific user (staff member) or resource to book with.
3. They pick a preferred date.
4. The system displays available time slots in real time based on that date and provider.
5. The customer selects their desired slot.
6. If capacity management is enabled, they also select how many spots they need.
7. The system validates both availability and capacity before proceeding.
8. The customer fills out any custom questions the organiser has configured for that appointment.
9. They confirm the booking. If advance payment is enabled, they complete payment at this step.
10. A confirmation page is shown with the full appointment summary — date, time, provider, status, venue, and a confirmation message.

### Post-Booking Actions

From the confirmation page, two branches are available:

- If the customer **cancels**, they are redirected back to the booking page to start fresh.
- If they want to **reschedule**, they can change only the date and time (not the service or provider).

### Profile Management

The customer can view and update their personal details at any time. Their profile also shows all upcoming and past appointments in one place.

---

## 2. Organiser

### Authentication

Same signup / login / OTP flow as the customer.

### Service & Appointment Configuration

The organiser's primary responsibility is setting up appointment types:

- They create appointment types with a name, duration (e.g. 30 min, 1 hour), and specify whether the appointment is user-based or resource-based.
- They manage which staff members or resources are assigned to each type.
- They define working hours for each user or resource.
- They choose a slot schedule — either a fixed weekly schedule or a flexible one — and configure the time blocks accordingly.

### Booking Rules

The organiser sets the rules that govern how bookings behave:

- Maximum number of bookings per slot (capacity control).
- Whether advance payment is required.
- Whether bookings need manual confirmation or are auto-confirmed.
- Whether users/resources are assigned automatically or manually.
- Slot creation settings.

### Custom Questions

The organiser can add custom questions that customers must answer when booking that appointment type.

### Preview, Publish & Share

Before publishing, the organiser can preview what the booking experience looks like. They can share unpublished appointments via a private link (useful for testing or internal use). When ready, they publish the appointment to make it visible to customers. They can also unpublish it at any time.

### Booking Management

The organiser views all bookings through a visual calendar and a list view, each showing the customer name, time, service, and current status.

### Reports & Insights

The organiser has access to analytics including total appointments booked, peak booking hours, and provider utilization rates.

---

## 3. Admin

### Authentication

Same signup / login / OTP flow.

### Admin Dashboard

The admin gets a system-level overview showing total users, total service providers, and total appointments across the entire platform. This is a monitoring and control layer above the organiser.

### User & Provider Management

The admin can view the full list of all registered users, activate or deactivate any account, and manage roles — assigning or changing whether a user is a customer, organiser, or admin.

### Inherited Organiser Access

The admin inherits all organiser capabilities. This means they can also create and configure appointment types, manage bookings, view calendar and booking details, and access reports — essentially having full control over every aspect of the system.
