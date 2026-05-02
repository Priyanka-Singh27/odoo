# Appointment App — IDE Agent UI Prompt
**Stack:** Next.js 14 (App Router) · Tailwind CSS · shadcn/ui  
**Reference:** Doctor-booking UI (clean, medical, trust-forward, light blue-white theme)

---

## 1. Design Language & Theme

### Visual Style
The UI follows a **clean, clinical-professional aesthetic** inspired by modern healthcare SaaS platforms. Think "Calendly meets a premium medical directory." The design uses a light background with a deep navy/dark sidebar, soft blue accents, and plenty of white card space. Everything feels trustworthy, spacious, and airy — not corporate, not startup-flashy.

### Color Palette
```
Primary Blue:       #3B82F6  (buttons, active states, highlights)
Deep Navy Sidebar:  #0F172A  (left sidebar background)
Page Background:    #F8FAFC  (very light cool gray, almost white)
Card Background:    #FFFFFF
Text Primary:       #0F172A  (near black)
Text Secondary:     #64748B  (slate gray)
Text Muted:         #94A3B8
Border Color:       #E2E8F0
Active Tab/Badge:   #3B82F6 background + white text
Specialty Chips:    #EFF6FF background + #3B82F6 text (light blue pill)
Star Rating:        #F59E0B (amber)
Success Green:      #10B981
```

### Typography
- **Font:** `Geist` (from Vercel) or `DM Sans` — clean, geometric, slightly rounded. Import from Google Fonts or next/font.
- **Headings:** `font-semibold`, tracking slightly tight
- **Body:** `font-normal`, `text-sm` or `text-base`
- **Labels/Chips:** `text-xs font-medium uppercase tracking-wide`
- No serif fonts anywhere. Keep it clean and scannable.

### Spacing & Radius
- Card border-radius: `rounded-2xl` (16px)
- Button border-radius: `rounded-xl` (12px)
- Badge/chip border-radius: `rounded-full`
- Sidebar icons: `rounded-xl`
- Consistent padding: `p-5` or `p-6` inside cards
- Gap between major sections: `gap-6`

### Shadows
- Cards: `shadow-sm` — subtle, not dramatic
- Active/hovered card: `shadow-md` with a slight blue border `border border-blue-100`
- No heavy shadows anywhere

---

## 2. Global Layout Structure

The app uses a **three-panel layout** on desktop:

```
┌─────────────────────────────────────────────────────────────┐
│  [Narrow Icon Sidebar]  [Main Content Area]  [Right Panel]  │
│      64px wide          flex-1 (~55%)         ~350px         │
└─────────────────────────────────────────────────────────────┘
```

### Top Navigation Bar (Full Width)
- Height: `h-16` (64px)
- Background: white, `border-b border-slate-200`
- Left: Logo (circular icon with brand mark, ~36px)
- Center-left: Search input — `Find doctors` placeholder with a search icon, followed by a `Location` input with a pin icon and a `Search` CTA button in blue (`bg-blue-500 text-white rounded-xl px-5`)
- Right: Dark mode icon, notification bell icon, user avatar with name and dropdown chevron (`Cameron ▾`)
- All inputs: `rounded-xl border border-slate-200 bg-white px-4 h-10 text-sm`

### Left Sidebar (Icon Only)
- Width: `w-16` (64px)
- Background: `#0F172A` (deep navy)
- Contains: 5–6 icon-only navigation items stacked vertically with equal spacing
- Icons: white/slate, active icon highlighted with a white background chip or blue accent
- No labels — pure icon navigation
- Icons (top to bottom): Grid/dashboard, Calendar, Chat/messages (active in the reference), Users/contacts, Settings
- Active state: icon has `bg-white/10 rounded-xl` or a left accent bar

---

## 3. Page: Book Appointment (Customer Flow — Main Booking Screen)

This is the primary screen. It occupies the area to the right of the sidebar and is split into two columns:

### Left Column (Doctor List + Detail)
Approximately 60% of the main content area, split internally into a list panel and a detail panel.

#### Doctor List Panel (~220px wide, left-most inner column)
- Section label: `Choose Doctor` in `text-sm font-semibold text-slate-700` with a subtle gray separator below
- Stacked list of `<DoctorCard>` components — no gaps between them, just subtle dividers
- Each `<DoctorCard>`:
  ```
  ┌────────────────────────────────────────┐
  │ [Avatar 48px]  Amanda Clara            │
  │                specialist · 12 yrs exp │
  │                [Pediatric chip]        │
  │         [ Book an appointment ]        │
  └────────────────────────────────────────┘
  ```
  - Avatar: circular, `w-12 h-12`, with a soft border
  - Name: `text-sm font-semibold text-slate-800`
  - Subtitle: `text-xs text-slate-500`
  - Specialty chip: `bg-blue-50 text-blue-600 text-xs rounded-full px-2 py-0.5`
  - "Book an appointment" button: `w-full bg-blue-500 text-white text-xs font-medium rounded-xl py-2 mt-2`
  - Active/selected card: `border-l-4 border-blue-500 bg-blue-50/40`
  - Scrollable list, max height with `overflow-y-auto`

#### Doctor Detail Panel (center, takes remaining left-column space)
Shown when a doctor is selected from the list. This is a scrollable card.

**Header section:**
```
[Avatar 80px]  Amanda Clara
               specialist · 12 years experience
               [Pediatric chip]
                                    [ Book an appointment ] (blue, top-right)
```

**Info grid below header (two columns):**
- `Education` label in muted gray, value below: "PhD in Clinical Psychology, UCLA"
- `Certificate` label, value: "Certified CBT Therapist, APA"

**Availability row:**
- Label: `Available Today`
- Two chips side by side:
  - `Online Consultation` — outlined chip with a globe or video icon
  - `Offline at Doctors Hospitals, California` — outlined chip with a location pin icon
- Format: `border border-slate-200 rounded-full px-3 py-1 text-xs flex items-center gap-1`

**Working Hours:**
- Label: `Monday - Saturday` in `text-sm font-medium`
- Two time ranges: `10:00 - 12:00` and `14:00 - 20:00`
- Displayed as simple text lines, muted color

**Symptoms row:**
- Label: `Symptoms`
- Comma-separated text: "Anxiety & Panic Attacks, Stress, Depression, Sleep Disorders"

**Specialty Procedures:**
- Label: `Specialty Procedures`
- Chips: `Cognitive Behavioral Therapy (CBT)`, `Family & Couples Therapy`, `Supportive Psychotherapy`, `Mindfulness-Based Stress Reduction (MBSR)`
- Chip style: `bg-blue-50 text-blue-600 text-xs rounded-full px-3 py-1`

**Reviews section:**
- Label: `Reviews` in `text-sm font-semibold`
- Each review:
  ```
  [Avatar 32px]  Courtney Henry    ★★★★★  2 mins ago
  "Consequat welt qui adipiscing sunt do... (truncated)"
  ```
- Avatar: circular, 32px
- Name: `text-sm font-medium`
- Stars: amber `★★★★★` in `text-amber-400`
- Timestamp: `text-xs text-slate-400`
- Review text: `text-sm text-slate-600 leading-relaxed`
- Show 2–3 reviews with a "View All" link

### Category Tabs (Full Width, above the columns)
Horizontal scrollable tab bar spanning the full width above the two inner panels:

```
Cardiology | Psychology | Traumatology | [Pediatrics] | Anesthiology | Ophthalmology | Dentistry | General Diagnosis | Neuro Surgery
```

- Container: `flex gap-2 overflow-x-auto py-3` with no scrollbar shown (`scrollbar-hide`)
- Each tab: `px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap`
- Inactive: `bg-transparent text-slate-600 hover:bg-slate-100`
- Active: `bg-blue-500 text-white`
- The tab bar sits between the top nav and the doctor list/detail area

---

## 4. Right Panel (Calendar + Visit Hours)

Width: ~340px, fixed. Background: white. Contains two stacked cards.

### Calendar Card
- Title: `Calendar` in `text-base font-semibold`
- `View All →` link top-right in `text-sm text-blue-500`
- Month display: `June 2026` with `<` `>` chevron navigation buttons
- Calendar grid:
  - Row of day labels: Mon Tue Wed Thu Fri Sat Sun — `text-xs text-slate-400 font-medium`
  - Date cells: `w-8 h-8 flex items-center justify-center text-sm rounded-full`
  - Default: `text-slate-700`
  - Today/selected: `bg-blue-500 text-white rounded-full`
  - Other month: `text-slate-300`
  - Hover: `bg-blue-50 rounded-full`
- Use shadcn `Calendar` component styled to match

### Visit Hours Card
- Title: `Visit Hours` in `text-base font-semibold`
- `View All →` link top-right
- Month + nav same as above
- Time slot grid:
  - 2 columns of time slot pills
  - Each pill: `px-4 py-2 rounded-xl text-sm font-medium border`
  - Default: `border border-slate-200 text-slate-700 bg-white`
  - Selected/active: `bg-blue-500 text-white border-blue-500`
  - Disabled/past: `bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed`
  - Example slots: 11:00AM, 11:30AM, 12:00AM (active), 01:00AM, 01:30AM, 03:00AM, 03:30AM, 04:00AM, 05:00AM, 05:30AM, 06:00AM
- CTA at bottom of this card: `Book an appointment` — full-width blue button `w-full bg-blue-500 text-white rounded-xl py-3 font-medium`

---

## 5. Full Page & Screen Inventory

Build every screen listed below matching the visual style described above. All screens share the same sidebar, topnav, and color system.

---

### AUTH SCREENS
These use a **centered two-column layout**: left = decorative panel (blue gradient with app brand), right = form.

#### `/login`
- Form card: `max-w-sm mx-auto bg-white rounded-2xl p-8 shadow-sm`
- Fields: Email (`Input`), Password (`Input` with show/hide)
- CTA: `Log In` — full-width blue button
- Link: `Forgot password?` below password field, right-aligned
- Footer: `Don't have an account? Sign up` — centered link

#### `/signup`
- Fields: Full Name, Email, Password
- Same card style as login
- After submit: navigates to `/verify-otp`

#### `/verify-otp`
- Centered card
- Heading: "Check your email"
- Subtext: "We sent a 6-digit code to your@email.com"
- shadcn `InputOTP` — 6 cells, large and prominent
- CTA: `Verify` — blue full-width button
- Link: `Resend code` with a countdown timer (e.g., `Resend in 0:42`)

#### `/forgot-password`
- Step 1: Email input + "Send reset link" button
- Step 2: OTP input (same as verify-otp)
- Step 3: New password + confirm password inputs + "Reset password" button
- Use a `Stepper` indicator at top showing steps 1 / 2 / 3

---

### CUSTOMER SCREENS

#### `/home` — Appointment Overview
- Page heading: `Book Appointment` in `text-2xl font-semibold`
- Category tabs (same as reference)
- Three-column inner layout: Doctor list | Doctor detail | Calendar + slots
- This IS the reference image — implement it exactly

#### `/book/[appointmentId]` — Multi-Step Booking Wizard
Show a **progress bar / step indicator** at the top of the main content area:
```
① Select Provider  →  ② Choose Date & Time  →  ③ Capacity  →  ④ Questions  →  ⑤ Payment
```
- Step indicator: horizontal pill row, completed = blue filled, active = blue outlined, upcoming = gray
- Each step renders in the main content area; right panel always shows a **Booking Summary** card (appointment name, selected date, selected time, price if applicable)

**Step 1 — Select Provider**
- Same doctor list UI as the home screen left panel
- Selected doctor gets a prominent selected state

**Step 2 — Date & Time**
- Same Calendar + Visit Hours right panel layout
- Main content area shows the selected doctor's info summary at the top

**Step 3 — Capacity** *(only if manage_capacity = true)*
- Clean number stepper:
  ```
  Number of people
  [−]  [ 3 ]  [+]
  Max: 10 available
  ```
- `−` and `+` as icon buttons `rounded-full border`
- Counter in a bordered input `w-16 text-center`

**Step 4 — Questions Form**
- Card with heading: "A few quick questions"
- Each question rendered as a labeled field (`Input`, `Textarea`, `Select`, `Checkbox`)
- shadcn form components, clean vertical stack with `gap-4`
- CTA: `Confirm` (if no payment) or `Proceed to Payment` (if advance_payment = true) — blue full-width button

**Step 5 — Payment** *(only if advance_payment = true)*
- Two-column layout:
  - **Left:** "Choose a payment method"
    - Radio group: Credit Card | UPI Pay | Paypal — shadcn `RadioGroup`, each option as a bordered card
    - Credit card sub-form:
      ```
      [ Cardholder name          ]
      [ Card number              ]
      [ Expiry Date  ] [ CVV     ]
      [ Submit Card              ]
      ```
    - All inputs `rounded-xl border border-slate-200`
  - **Right:** Order Summary card
    ```
    Order Summary
    ─────────────────────
    Dental care       1000
    Subtotal          1000
    Taxes              100
    ─────────────────────
    Total             1100
    ─────────────────────
    [ Pay Now ]   ← blue full-width button
    ```

#### `/confirmation` — Booking Confirmed
- Centered card layout (no three-column layout here)
- Top: green check icon in a `bg-green-50 rounded-full p-4` circle
- Heading: `Appointment Confirmed` — shadcn `Badge` variant success next to it OR a green badge chip
- Details list (clean label-value rows with a divider between each):
  ```
  Time          Dec 12, 9:00 am
  Duration      30 min
  No. of people 10              ← only if manage_capacity = true
  Venue         Doctor's Office
                64 Dexter Street
                Springfield 380005, Ahmedabad
  ```
- Calendar add links: `[+ Add to Google Calendar]` `[+ Add to iCal]` — outlined blue buttons side by side
- *If manual_confirmation = true:*
  - Amber info card: `bg-amber-50 border border-amber-200 rounded-xl p-4`
  - Text: "Appointment Reserved — You'll receive an email when the organiser confirms your booking."
- *If appointment is confirmed:*
  - Green info card: "Thank you for your booking, we look forward to meeting you."
- Bottom action row: `[ Cancel ]` (outline red button) `[ Reschedule ]` (blue button)

#### `/reschedule` — Reschedule Appointment
- Heading: "Reschedule your appointment"
- Subtext card: `Current reservation: Friday 15th of December – 9:00` in a `bg-slate-50 rounded-xl p-3 border`
- Same Calendar + slot grid as booking Step 2
- Below calendar: italic description text (from appointment, e.g. "Schedule your visit today…")
- CTA: `Confirm Reschedule` — blue full-width button

#### `/profile` — Customer Profile
- Left: profile info card (avatar large, name, email, edit button)
- Right: shadcn `Tabs` — `Upcoming` | `Past`
- Each tab shows a table/card list:
  ```
  [Service name]  [Doctor]  [Date & Time]  [Status badge]  [Actions]
  ```
- Status badges: `Confirmed` (green), `Pending` (amber), `Cancelled` (red), `Reserved` (blue)
- Actions for upcoming: `Reschedule` link, `Cancel` link

---

### ORGANISER SCREENS

All organiser screens use the same sidebar/topnav but the sidebar nav highlights the organiser section icon.

#### `/organiser/appointments` — Appointment List
- Page heading: "My Appointments" with `+ New Appointment` button top-right (blue)
- shadcn `Table` with columns: Name · Duration · Type · Status · Actions
- Status: `Published` (green badge), `Draft` (gray badge)
- Actions per row: Edit icon · Publish/Unpublish toggle · Copy link icon · Preview icon · Delete icon
- All icons as `Button variant="ghost" size="icon"` from shadcn

#### `/organiser/appointments/new` and `/[id]/edit` — Create/Edit Appointment
- Full-page form, sections separated by headings + dividers
- Left: form (takes ~65% width)
- Right: sticky preview card showing how it looks to customers (~35%)
- Sections:

**Basic Info:**
```
Appointment name  [ text input            ]
Duration          [ Select: 30 min ▾     ]
Type              (●) User-based  (○) Resource-based
Description       [ textarea              ]
```

**Resources / Users:**
- Multi-select list: each provider as a row with avatar, name, checkbox
- Expandable working hours per selected provider:
  ```
  Mon [✓]  09:00  to  17:00
  Tue [✓]  09:00  to  17:00
  ...
  ```
  - Day toggles as shadcn `Switch`
  - Time pickers as `Input type="time"`

**Slot Schedule:**
- Toggle: `(●) Weekly  (○) Flexible`
- Weekly: 7-day grid
- Flexible: date range picker + time entries

**Booking Rules:**
```
Max bookings per slot     [ 1      ] (number input)
Manage capacity           [  ○  ]  (Switch)
Advance payment           [  ○  ]  (Switch)
Manual confirmation       [  ○  ]  (Switch)
Resource assignment       (●) Auto  (○) Manual
```
Each switch: label on left, `Switch` on right, full-width row with `justify-between`

**Custom Questions:**
- "Add Question" button (+ icon, outlined)
- Each question row:
  ```
  [ Question text input     ]  [ Type ▾ ]  [ Required toggle ]  [ 🗑 ]
  ```
- Drag handle icon on left for reordering

**Footer actions:**
- `Save Draft` (outline button) · `Publish` (blue button) · `Copy Share Link` (ghost button with link icon)

#### `/organiser/bookings` — Bookings View
- shadcn `Tabs`: `Calendar View` | `List View`
- **Calendar view:** month grid with booking event chips inside date cells
  - Event chip: `bg-blue-100 text-blue-800 text-xs rounded px-1 truncate`
  - Click chip → opens shadcn `Sheet` (drawer) from right with booking details
- **List view:** table — Customer · Service · Date & Time · Status · Actions
  - If `manual_confirmation = true`: "Confirm" and "Reject" buttons per pending row
- Filters bar above table: date range picker + service dropdown + status dropdown — all `rounded-xl`

**Booking detail Sheet (drawer):**
- Slides in from right, ~400px wide
- Customer name + avatar at top
- All booking details (service, date, time, duration, venue, people count)
- Answers to custom questions in a clean list
- Action buttons at bottom: `Confirm` (green) · `Cancel` (red outline)

#### `/organiser/reports` — Reports & Insights
- Three KPI cards at top:
  ```
  [ Total Appointments ]  [ Peak Booking Hours ]  [ Provider Utilization ]
       248                    2PM – 4PM                  Amanda 82%
  ```
  - shadcn `Card` with a large number, label, and a small trend indicator
- Below: bar chart for peak hours (recharts `BarChart`)
- Below: horizontal progress bars for each provider's utilization

---

### ADMIN SCREENS

#### `/admin/dashboard` — System Dashboard
- Three KPI stat cards (same style as organiser reports):
  ```
  [ Total Users ]  [ Total Service Providers ]  [ Total Appointments ]
  ```
- Below: recent activity table or user growth chart

#### `/admin/users` — User & Provider Management
- Search bar + Role filter dropdown + Status filter
- shadcn `Table`:
  - Columns: Avatar+Name · Email · Role · Status · Joined · Actions
  - Role: shown as a shadcn `Select` inline (Customer / Organiser / Admin) — saves on change
  - Status: shadcn `Switch` inline — toggling activates/deactivates account
- Pagination at bottom

---

## 6. Component Specifications (shadcn/ui Usage Guide)

| Component | shadcn Component | Customization |
|---|---|---|
| Buttons | `Button` | variant: default (blue), outline, ghost, destructive |
| Inputs | `Input` | `rounded-xl`, `h-10`, `border-slate-200` |
| Selects | `Select` | `rounded-xl` |
| Tabs | `Tabs` | pill variant using `rounded-full` |
| Calendar | `Calendar` | custom day cell styles for selected/today |
| Date picker | `Popover` + `Calendar` | standard pattern |
| OTP | `InputOTP` | 6 cells, large size |
| Switch | `Switch` | default blue accent |
| Radio | `RadioGroup` | card-style wrapper for payment options |
| Badges | `Badge` | custom variants: success, warning, destructive |
| Table | `Table` | standard, no zebra stripes, light header |
| Sheet | `Sheet` | side=right, width 400px |
| Alert Dialog | `AlertDialog` | for cancel/destructive confirmations |
| Toast | `Sonner` | bottom-right, clean style |
| Skeleton | `Skeleton` | for slot grid and list loading states |
| Form | `Form` + `react-hook-form` + `zod` | all forms |

---

## 7. Micro-interactions & Motion

- **Page transitions:** `framer-motion` `AnimatePresence` with a soft `opacity` + `y: 8 → 0` fade-up on route change
- **Step wizard transitions:** slide left/right between steps using `framer-motion` `variants`
- **Slot selection:** scale pulse on click (`scale-95 → scale-100`) with background color transition `duration-150`
- **Doctor card selection:** smooth `border-l` color transition + `bg` shift `duration-200`
- **Button hover:** subtle `scale-[1.02]` on primary buttons
- **Calendar date hover:** `bg-blue-50 rounded-full` transition `duration-100`
- **Sheet open:** smooth slide-in from right, shadcn default works
- **Switch toggle:** shadcn default animation, accent color blue
- **Skeleton loading:** `animate-pulse` on slot grid while fetching

---

## 8. Responsive Behavior

| Breakpoint | Layout |
|---|---|
| Desktop `≥1280px` | Three-column (sidebar + list + detail + right panel) |
| Tablet `768–1279px` | Sidebar collapses to bottom nav, two-column (list+detail / right panel stacks below) |
| Mobile `<768px` | Single column, bottom nav, booking wizard is full-screen steps, right panel becomes a bottom sheet |

- On mobile, the "Visit Hours" slot grid becomes a horizontally scrollable row of pills
- On mobile, doctor list becomes a vertical scrollable feed; detail opens as a full-screen sheet

---

## 9. Key Conditional UI Rules (Do Not Skip)

These flags come from the API and must gate entire sections of the UI:

| API Flag | UI Effect |
|---|---|
| `manage_capacity = true` | Show Step 3 (capacity stepper) in booking wizard AND show "No. of people" row on confirmation |
| `advance_payment = true` | CTA on Step 4 becomes "Proceed to Payment" and Step 5 (payment screen) is shown |
| `manual_confirmation = true` | Confirmation page shows amber "Appointment Reserved" card instead of green confirmed card |
| `slot_schedule = "flexible"` | Organiser form shows date-range + custom slot entries instead of weekly grid |
| `assignment = "manual"` | Organiser booking rules shows manual assignment UI |

---

## 10. File Structure to Generate

```
app/
  (auth)/
    login/page.tsx
    signup/page.tsx
    verify-otp/page.tsx
    forgot-password/page.tsx
  (customer)/
    layout.tsx               ← sidebar + topnav wrapper
    home/page.tsx
    book/[appointmentId]/
      page.tsx               ← multi-step wizard
    confirmation/page.tsx
    reschedule/page.tsx
    profile/page.tsx
  (organiser)/
    layout.tsx
    appointments/
      page.tsx
      new/page.tsx
      [id]/edit/page.tsx
    bookings/page.tsx
    reports/page.tsx
  (admin)/
    layout.tsx
    dashboard/page.tsx
    users/page.tsx

components/
  shared/
    AppHeader.tsx
    AppSidebar.tsx
    StatusBadge.tsx
    MultiStepProgress.tsx
    EmptyState.tsx
    ConfirmDialog.tsx
  booking/
    DoctorCard.tsx
    DoctorDetail.tsx
    CalendarSlotPicker.tsx
    SlotGrid.tsx
    CapacityStepper.tsx
    QuestionsForm.tsx
    PaymentForm.tsx
    OrderSummary.tsx
    BookingSummaryCard.tsx
  organiser/
    AppointmentForm.tsx
    WorkingHoursEditor.tsx
    SlotScheduleEditor.tsx
    BookingRulesForm.tsx
    QuestionsEditor.tsx
    BookingDetailSheet.tsx
  admin/
    UserTable.tsx
    KpiCard.tsx
```

---

## 11. Global Styles (globals.css additions)

```css
/* Hide scrollbar but keep scrollability */
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

/* Custom calendar day active state */
.rdp-day_selected { background-color: #3B82F6 !important; border-radius: 50% !important; }

/* Slot pill transition */
.slot-pill { transition: all 150ms ease; }
.slot-pill:hover:not(:disabled) { background-color: #EFF6FF; border-color: #3B82F6; color: #3B82F6; }
.slot-pill.selected { background-color: #3B82F6; color: white; border-color: #3B82F6; }
.slot-pill:disabled { opacity: 0.4; cursor: not-allowed; }
```

---

## 12. Environment & Package Setup

```bash
# Init
npx create-next-app@latest appointment-app --typescript --tailwind --app --src-dir

# shadcn
npx shadcn@latest init
npx shadcn@latest add button input select tabs calendar sheet alert-dialog badge table form radio-group switch sonner skeleton input-otp

# Additional packages
npm install react-hook-form zod @hookform/resolvers
npm install framer-motion
npm install date-fns
npm install recharts
npm install @dnd-kit/core @dnd-kit/sortable   # for drag-to-reorder questions
npm install next-themes                        # for future dark mode support
```

---

## Summary for Agent

Build a full appointment booking web app in Next.js 14 (App Router) + Tailwind + shadcn/ui. The visual design matches the reference: a **clean, airy medical-professional UI** with a deep navy `#0F172A` icon-only sidebar, white content cards, a `#3B82F6` blue primary color, slate text hierarchy, pill-style category tabs, and a three-column layout (sidebar · main content · right calendar+slots panel).

The app has three distinct user roles — Customer, Organiser, Admin — each with their own route group and layout. All screens must be implemented. The booking flow is a multi-step wizard (provider → date/time → capacity → questions → payment) with conditional steps driven by API flags. The confirmation screen has two variants (confirmed vs reserved) based on the `manual_confirmation` flag. The organiser can configure appointments with fully dynamic booking rules, custom question forms, and publish/share controls. The admin has system-level user management on top of all organiser capabilities.

Do not simplify the flow. Every screen, every conditional state, every component listed above must be built.
