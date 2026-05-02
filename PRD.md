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



# Frontend PRD — Appointment App
**Tech Stack:** Next.js · Tailwind CSS · shadcn/ui  
**Version:** 1.0  
****Scope:** Customer, Organiser, and Admin role UIs
**Fonts:** Headings: Alumni Sans (bold, slightly spaced), Body & UI text: DM Sans (regular/medium)

**Color Palette:** Primary: #3852B4 (main brand, buttons, links), Secondary: #5E7AC4 (hover states, secondary UI)
,Accent: #F3BE7A (highlights, badges)
, CTA: #F08D39 (primary actions like “Book Now”)


---

## 1. Project Overview

The Appointment App is a scheduling and booking platform supporting three distinct user roles — Customer, Organiser, and Admin. The frontend is built with Next.js (App Router), styled with Tailwind CSS, and uses shadcn/ui as the component library. The UI must support real-time slot availability, conditional rendering (capacity toggle, payment toggle, manual confirmation toggle), and a clean multi-step booking UX as defined in the wireframe mockups.

---

## 2. Tech Stack & Conventions

| Concern | Choice |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Styling | Tailwind CSS |
| Component library | shadcn/ui |
| State management | React Context + `useState` / `useReducer` for local; consider Zustand for global booking state |
| Forms | `react-hook-form` + `zod` for validation |
| Date/time | `date-fns` |
| HTTP client | `fetch` with custom hooks or TanStack Query |
| Auth | JWT-based; store in httpOnly cookie |

**Folder structure (App Router):**
```
app/
  (auth)/
    login/
    signup/
    verify-otp/
    forgot-password/
  (customer)/
    home/
    book/[appointmentId]/
    confirmation/
    reschedule/
    profile/
  (organiser)/
    dashboard/
    appointments/
      new/
      [id]/edit/
    bookings/
    reports/
  (admin)/
    dashboard/
    users/
    providers/
components/
  ui/           ← shadcn primitives
  shared/       ← cross-role components
  booking/      ← booking flow steps
  organiser/    ← organiser-specific components
  admin/        ← admin-specific components
lib/
  hooks/
  utils/
  validators/
```

---

## 3. Authentication & Onboarding

Applicable to all three roles. Role is determined post-login from the JWT payload and used to redirect to the correct dashboard.

### 3.1 Pages

**`/signup`**  
Fields: Full name, Email, Password  
On submit → POST `/api/auth/signup` → redirect to `/verify-otp`

**`/verify-otp`**  
6-digit OTP input (shadcn `InputOTP` component)  
Resend OTP link with cooldown timer  
On success → redirect to role-based dashboard

**`/login`**  
Fields: Email, Password  
Link to `/forgot-password`  
On success → redirect based on role from JWT

**`/forgot-password`**  
Step 1: Enter email → send reset link  
Step 2: Enter OTP  
Step 3: Enter new password + confirm

### 3.2 Components

- `<AuthLayout>` — centered card layout, shared across all auth pages
- `<OtpInput>` — uses shadcn `InputOTP`; auto-focuses next cell on input
- `<PasswordInput>` — text input with show/hide toggle icon

### 3.3 Validation (zod)

```ts
const signupSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
})
```

---

## 4. Customer (End User) UI

### 4.1 Home / Appointment Overview — `/home`

**Purpose:** Discovery screen. Show all published appointment types.

**Layout:**  
- Page header with app name + profile avatar (dropdown: My Profile, Logout)
- Grid of `<AppointmentCard>` components (shadcn `Card`)
- Each card shows: service name, duration, provider count, "Book Appointment" CTA button

**`<AppointmentCard>` props:**
```ts
{
  id: string
  name: string
  duration: number        // minutes
  providerCount: number
  isPublished: boolean
}
```

**Behavior:**  
- Clicking "Book Appointment" navigates to `/book/[appointmentId]`
- Empty state: `<EmptyState>` with illustration and "No appointments available" message

---

### 4.2 Booking Flow — `/book/[appointmentId]`

This is the most complex screen. It is a **multi-step wizard** rendered on a single page with a progress indicator.

**Steps:**

```
Step 1: Select Provider / Resource
Step 2: Select Date & Time Slot
Step 3: Select Capacity          ← only if manage_capacity = true
Step 4: Fill Questions Form
Step 5: Confirm / Payment        ← payment screen only if advance_payment = true
```

#### Step 1 — Select User / Resource

- Heading: service name
- List of available providers or resources as selectable cards (radio-style)
- Each card: name, avatar/icon, role label
- shadcn `RadioGroup` + custom card styling
- "Next" button disabled until selection made

#### Step 2 — Select Date & Time Slot

**Date Picker:**
- shadcn `Calendar` component
- Only future dates enabled
- Dates with zero availability shown as disabled/greyed

**Slot Grid (renders after date selection):**
- Fetched in real time via `GET /api/slots?appointmentId=&providerId=&date=`
- Displayed as a responsive grid of pill buttons
- States: available (default), selected (primary color), booked (disabled + strikethrough)
- Loading state: shadcn `Skeleton` for the slot grid

**Layout (matches wireframe):**
```
[ Calendar on left ]   [ Slot grid on right ]
                        09:00  09:30  10:00
                        10:30  11:00  [full]
                        ...
```

#### Step 3 — Capacity Selection (conditional)

Only rendered if `manage_capacity === true` for this appointment type.

- Label: "Number of people"
- shadcn `Select` or numeric stepper (+ / − buttons)
- Max value capped at `max_bookings_per_slot` minus already-booked count
- Real-time validation: system rechecks availability before proceeding

#### Step 4 — Questions Form

- Dynamically rendered from `appointment.questions[]` array returned by API
- Supported field types: Text, Textarea, Phone number, Dropdown, Checkbox
- Built with `react-hook-form`; zod schema generated dynamically from question config
- "Confirm" button at bottom

**If `advance_payment = false`:**  
Clicking Confirm → POST `/api/bookings` → redirect to `/confirmation`

**If `advance_payment = true`:**  
Clicking "Proceed to Payment" → renders the Payment step below

#### Step 5 — Payment (conditional)

Only rendered if `advance_payment === true`.

**Layout (matches wireframe):**
```
Left panel: Payment method
  ● Credit Card
  ○ UPI Pay
  ○ Paypal

  [ Card holder name     ]
  [ Card number          ]
  [ Expiry Date ] [ CVV  ]
  [ Submit Card ]

Right panel: Order Summary
  Dental care      1000
  Subtotal         1000
  Taxes             100
  ─────────────────────
  Total            1100

  [ Pay Now ]
```

- shadcn `RadioGroup` for payment method selector
- shadcn `Input` for card fields
- "Pay Now" CTA → POST `/api/bookings/pay` → redirect to `/confirmation`

---

### 4.3 Confirmation Page — `/confirmation`

Displayed after a successful booking (with or without payment).

**Content (matches wireframe):**
```
✓ Appointment confirmed         ← green badge (shadcn Badge, variant success)

  Time       Dec 12, 9:00 am
  Duration   30 min
  No. of people  10             ← only if capacity enabled
  Venue      Doctor's Office
             64 Dexter Street
             Springfield 380005
             Ahmedabad

  [Add to Google Calendar]  [Add to iCal]

  If manual confirmation is enabled:
  ────────────────────────────────────
  "Appointment Reserved
   You will get a mail when organiser confirms your booking."

  ────────────────────────────────────
  "Only after appointment is confirmed —
   Thank you for your book, we look forward to meeting you."

  [ Cancel ]    [ Reschedule ]
```

**Behavior:**
- "Cancel" → shows shadcn `AlertDialog` for confirmation → on confirm, POST `/api/bookings/:id/cancel` → redirect to `/book/[appointmentId]` (back to date picker)
- "Reschedule" → navigate to `/reschedule?bookingId=`

---

### 4.4 Reschedule Page — `/reschedule`

**Layout (matches wireframe):**
```
Reschedule your appointment
Current reservation: Friday 15th of December – 9:00

[ Date Picker Calendar ]    [ Slot Grid ]

"Schedule your visit today and experience expert
dental care brought right to your doorstep."

[ Confirm ]
```

- Same `<Calendar>` + slot grid components reused from booking flow
- Pre-selects the current booking date for reference
- On confirm → PATCH `/api/bookings/:id/reschedule` with `{ date, slotId }`
- Only date and time can be changed; service and provider are locked

---

### 4.5 Profile — `/profile`

**Sections:**
1. Personal details (name, email) — editable inline with shadcn `Input` + save button
2. Upcoming appointments — shadcn `Table` or card list with status badge
3. Past appointments — same layout, different tab

- Uses shadcn `Tabs` to switch between Upcoming / Past
- Each appointment row shows: service name, date/time, provider, status badge, action links (Reschedule / Cancel for upcoming)

---

## 5. Organiser UI

### 5.1 Organiser Dashboard / Appointment List — `/organiser/appointments`

**Layout:**
- Left sidebar navigation: Appointments, Bookings, Reports
- Main area: table of all appointment types created by this organiser

**Table columns:** Name · Duration · Type · Status (Published/Unpublished) · Actions

**Actions per row:**
- Edit
- Publish / Unpublish toggle
- Share link (copy unpublished share URL to clipboard)
- Preview (opens booking UI in a modal or new tab)
- Delete

**Top CTA:** "New Appointment" button → `/organiser/appointments/new`

---

### 5.2 Create / Edit Appointment — `/organiser/appointments/new` and `/organiser/appointments/[id]/edit`

This is a tabbed or accordion form split into logical sections.

#### Section A — Basic Info

| Field | Component | Notes |
|---|---|---|
| Appointment name | `Input` | Required |
| Duration | `Select` | 15 min, 30 min, 45 min, 1 hr, custom |
| Type | `RadioGroup` | User-based or Resource-based |
| Description | `Textarea` | Optional |

#### Section B — Resources / Users

- Multi-select list of staff or resources (based on type selected above)
- Each selected member shows working hours configuration
- Working hours: day-of-week toggles + time range pickers (`Input type="time"`)

#### Section C — Slot Schedule

- `RadioGroup`: Weekly or Flexible
- **Weekly:** grid of days (Mon–Sun) each with from/to time pickers and an "Add break" option
- **Flexible:** date-range picker + individual slot time entries

This matches the wireframe's "schedule + weekly" and "schedule + flexible" panels visible in the Organiser/Admin backend view.

#### Section D — Booking Rules

| Rule | Component | Default |
|---|---|---|
| Max bookings per slot | `Input` (number) | 1 |
| Manage capacity | `Switch` | Off |
| Advance payment | `Switch` | Off |
| Manual confirmation | `Switch` | Off |
| Resource assignment | `RadioGroup`: Auto / Manual | Auto |

All switches use shadcn `Switch`. When toggled on, conditional sub-fields animate in (e.g. payment amount field when advance payment is enabled).

#### Section E — Custom Questions

- "Add Question" button appends a question row
- Each row: question text (`Input`) + answer type (`Select`: Text / Phone / Dropdown / Checkbox) + Required toggle
- Drag-to-reorder using `@dnd-kit/core`
- Remove icon (trash) on each row

#### Section F — Publish / Save

- "Save as Draft" → saves unpublished
- "Publish" → saves and sets `is_published = true`
- "Copy Share Link" → available immediately after save, copies URL with token to clipboard (shadcn `toast` confirmation)
- "Preview" → opens a modal with the customer-facing booking UI

---

### 5.3 Bookings View — `/organiser/bookings`

**Dual view: Calendar + List**

shadcn `Tabs` to switch between views.

**Calendar view:**
- Month/Week/Day toggle
- Each booking rendered as a colored event block
- Click event → opens booking detail drawer (`Sheet` from shadcn)

**List view:**
- shadcn `Table` with columns: Customer Name · Service · Date & Time · Status · Actions
- Status badge: Pending / Confirmed / Cancelled (color-coded)
- Filters: date range, service type, status
- If `manual_confirmation = true`: "Confirm" and "Reject" action buttons per pending row

**Booking detail drawer (Sheet):**
- Customer name + contact
- Service, date, time, duration
- Number of people (if capacity enabled)
- Answers to custom questions
- Status + action buttons (Confirm / Cancel)

---

### 5.4 Reports — `/organiser/reports`

Three stat cards at top:
- Total appointments (all time)
- Peak booking hours (bar chart)
- Provider utilization (progress bars or donut chart)

Charts: use `recharts` or shadcn's chart primitives (built on recharts).

---

## 6. Admin UI

### 6.1 Admin Dashboard — `/admin/dashboard`

**Three KPI cards (shadcn `Card`):**
- Total Users
- Total Service Providers
- Total Appointments

Below the cards: recent activity feed or summary table.

Admin also has access to all organiser screens. The sidebar includes an additional "Users" section not available to organisers.

---

### 6.2 User & Provider Management — `/admin/users`

**Table columns:** Name · Email · Role · Status · Joined Date · Actions

**Actions per row:**
- Activate / Deactivate (shadcn `Switch` inline, or button toggle)
- Change role (shadcn `Select`: Customer / Organiser / Admin)

**Filters:** Search by name/email, filter by role, filter by status.

**Behavior:**
- Deactivating a user prevents login (backend enforced); UI reflects immediately via optimistic update
- Role change triggers `PATCH /api/admin/users/:id` with new role

---

## 7. Shared Components

### `<AppHeader>`
- Logo + role-based nav links
- Profile dropdown: avatar, name, logout
- Responsive: collapses to hamburger on mobile

### `<StatusBadge>`
```ts
type Status = 'confirmed' | 'pending' | 'cancelled' | 'reserved'
```
Maps each status to a shadcn `Badge` variant:
- confirmed → green
- pending → yellow
- cancelled → red
- reserved → blue

### `<MultiStepProgress>`
- Horizontal step indicator for booking wizard
- Shows step number, label, completed/active/upcoming state
- Connects steps with a line; completed steps show a checkmark

### `<EmptyState>`
- Illustration + heading + subtext + optional CTA button
- Used on: home (no appointments), bookings (no bookings), reports (no data)

### `<ConfirmDialog>`
- shadcn `AlertDialog` wrapper
- Props: `title`, `description`, `confirmLabel`, `onConfirm`
- Used for: cancel booking, deactivate user, delete appointment type

### `<CalendarSlotPicker>`
- Composed of shadcn `Calendar` + a custom slot grid
- Slot grid renders buttons in a responsive CSS grid
- Slot states: available, selected, full (disabled)
- Emits `onSlotSelect(slot)` when a slot is chosen

---

## 8. Routing & Access Control

| Route prefix | Allowed roles |
|---|---|
| `/` | Redirect to `/login` |
| `/(auth)/*` | Public (unauthenticated) |
| `/(customer)/*` | Customer only |
| `/(organiser)/*` | Organiser + Admin |
| `/(admin)/*` | Admin only |

Access control is enforced in Next.js middleware (`middleware.ts`) by reading the role from the JWT stored in the httpOnly cookie. Unauthorized access redirects to `/login` or `/unauthorized`.

---

## 9. Conditional Rendering Rules

These are the key feature flags that come from the appointment configuration and must drive conditional UI rendering throughout the frontend:

| Flag | Where it affects the UI |
|---|---|
| `manage_capacity = true` | Show Step 3 (capacity selector) in booking flow; show "No. of people" on confirmation page |
| `advance_payment = true` | Show payment step in booking flow (Step 5); "Proceed to Payment" instead of "Confirm" on questions form |
| `manual_confirmation = true` | Show "Appointment Reserved / You will get a mail…" message on confirmation instead of confirmed message |
| `slot_schedule = flexible` | Show flexible schedule builder in organiser form instead of weekly grid |
| `assignment = manual` | Show manual provider assignment option in organiser booking rules |

---

## 10. API Contract Summary (Frontend-Facing)

| Method | Endpoint | Used by |
|---|---|---|
| POST | `/api/auth/signup` | Auth |
| POST | `/api/auth/login` | Auth |
| POST | `/api/auth/verify-otp` | Auth |
| POST | `/api/auth/forgot-password` | Auth |
| GET | `/api/appointments` | Customer home |
| GET | `/api/appointments/:id` | Booking flow |
| GET | `/api/slots?appointmentId=&providerId=&date=` | Slot picker |
| POST | `/api/bookings` | Booking confirmation |
| POST | `/api/bookings/pay` | Payment step |
| GET | `/api/bookings/:id` | Confirmation / Profile |
| POST | `/api/bookings/:id/cancel` | Cancel booking |
| PATCH | `/api/bookings/:id/reschedule` | Reschedule |
| GET | `/api/profile` | Profile page |
| PATCH | `/api/profile` | Update profile |
| GET | `/api/organiser/appointments` | Organiser list |
| POST | `/api/organiser/appointments` | Create appointment |
| PATCH | `/api/organiser/appointments/:id` | Edit appointment |
| PATCH | `/api/organiser/appointments/:id/publish` | Publish toggle |
| GET | `/api/organiser/bookings` | Bookings view |
| PATCH | `/api/organiser/bookings/:id/confirm` | Manual confirm |
| GET | `/api/organiser/reports` | Reports |
| GET | `/api/admin/dashboard` | Admin dashboard |
| GET | `/api/admin/users` | User management |
| PATCH | `/api/admin/users/:id` | Activate/deactivate/role change |

---

## 11. UI State & Loading Patterns

- **Slot fetching:** show `<Skeleton>` grid while fetching; show "No slots available" empty state if response is empty
- **Form submission:** disable submit button + show spinner inside button during API call
- **Optimistic updates:** apply immediately on toggle actions (publish/unpublish, activate/deactivate); revert on error with `toast` error message
- **Toast notifications:** use shadcn `Sonner` toast for: booking confirmed, link copied, changes saved, errors
- **Error boundaries:** wrap each route segment in a Next.js `error.tsx`; show a friendly error card with a retry button

---

## 12. Responsive Behavior

| Screen | Behavior |
|---|---|
| Desktop (≥1024px) | Sidebar nav, two-column layouts (calendar + slots, form + summary) |
| Tablet (768–1023px) | Collapsible sidebar, single-column form, calendar above slots |
| Mobile (<768px) | Bottom nav or hamburger, single-column everything, full-screen booking steps |

The booking wizard steps are always full-width on mobile and render one step at a time with back/next navigation.

---

## 13. Key Challenges (Hackathon Focus)

| Challenge | Frontend approach |
|---|---|
| Real-time availability | Fetch slots on every date or provider change; show loading skeleton; disable stale slots immediately after booking |
| Preventing double bookings | Disable selected slot optimistically on confirm; re-validate on server; show error toast + refresh slots if slot was taken |
| Flexible slot & capacity rules | All booking rules are API-driven; UI renders conditionally based on flags returned in the appointment config object |
| Clean booking UX | Multi-step wizard with `<MultiStepProgress>`, clear back/next navigation, inline validation, no page reloads |
