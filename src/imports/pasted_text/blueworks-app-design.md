Design a multi-page, responsive web application called "BlueWorks" — a hyperlocal 
blue-collar workforce platform that connects customers with verified skilled workers 
(plumbers, electricians, carpenters, etc.) within their barangay or nearby areas 
in the Philippines. Use realistic Filipino dummy data throughout for demo purposes.

Make this application functional with interactive navigation — clicking buttons, 
links, and nav items should navigate to the correct pages. All flows must be 
connected end-to-end.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BRAND & VISUAL IDENTITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: BlueWorks
Tagline: "Your trusted local workforce, one tap away."
Primary Color: Deep professional blue (#1B3A6B)
Accent Color: Bright sky blue (#3B82F6)
Neutral: Light gray backgrounds (#F4F6FA), white cards
Dark Mode Background: #0F172A, cards #1E293B, text #E2E8F0
Typography: Inter or Poppins — bold headings, regular body
Style: Modern, trustworthy, corporate-lite. Card-based layouts, 
soft shadows, rounded corners (12px cards, 8px buttons, 999px badges)
Include a light/dark mode toggle in the top navigation bar on every page.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE FLOW STRUCTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Organize pages in this exact order and grouping:

── SHARED ──────────────────────────
  Page 1: Landing Page (shared, role selector)
  Page 2: Customer Login
  Page 3: Customer Registration
  Page 4: Worker Login
  Page 5: Worker Registration

── CUSTOMER FLOW ───────────────────
  Page 6:  BlueBot Onboarding ("What service do you need?")
  Page 7:  Worker Discovery + Map
  Page 8:  Worker Profile
  Page 9:  Booking Flow
  Page 10: Customer AI Assistant Chat (BlueBot)
  Page 11: Reviews & Ratings

── WORKER FLOW ─────────────────────
  Page 12: Worker Dashboard (home)
  Page 13: My Jobs
  Page 14: Schedule / Calendar
  Page 15: Messages
  Page 16: Worker Profile Editor
  Page 17: Earnings

── ADMIN ───────────────────────────
  Page 18: Admin Dashboard

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE 1 — LANDING PAGE (SHARED)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Top navigation bar:
- Left: BlueWorks logo (blue wordmark with a small wrench/tool icon)
- Right: light/dark mode toggle, [Log In] ghost button, [Get Started] 
  solid blue button

Hero section:
- Large bold headline: "Find Trusted Workers Near You"
- Subheading: "BlueWorks connects you with verified electricians, plumbers, 
  carpenters and more — right in your barangay."
- Role selector — two large side-by-side cards (centered, prominent):
  Left card: 👤 "I'm a Customer" — "I need to hire a skilled worker"
              [Find a Worker →] button (solid blue)
  Right card: 🔧 "I'm a Worker" — "I want to offer my skills"
              [Offer My Skills →] button (outlined blue)
- Clicking "Find a Worker" navigates to Page 2 (Customer Login)
- Clicking "Offer My Skills" navigates to Page 4 (Worker Login)

Below hero — 3 feature highlight cards in a row:
1. "AI-Powered Matching" — sparkle icon
2. "Verified Professionals" — shield/check icon
3. "Book in Minutes" — calendar icon

Below that — "Most Requested Skills" horizontal chip row:
Electrician | Plumber | Carpenter | Painter | Aircon Technician | Mason
(each chip has an icon + label)

Below that — "Top Rated Workers Near You" horizontal scroll:
4 worker preview cards:
- Juan dela Cruz — Electrician — ⭐4.9 — 0.8 km — ✅ Verified
- Maria Santos — Plumber — ⭐4.7 — 1.2 km — ✅ Verified
- Rico Reyes — Carpenter — ⭐4.8 — 2.1 km — ✅ Verified
- Liza Bautista — Painter — ⭐4.6 — 3.5 km — ✅ Verified

Footer: logo, nav links, social icons, "© 2025 BlueWorks"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE 2 — CUSTOMER LOGIN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Centered card layout on a soft blue-gray background.
- BlueWorks logo at top of card
- Label above card: "Customer Portal"
- Fields: Email, Password
- [Log In] primary button → navigates to Page 6 (BlueBot Onboarding)
- "Forgot password?" link
- Divider: "or"
- [Continue with Google] outlined button
- Bottom: "Don't have an account? Register here" → navigates to Page 3

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE 3 — CUSTOMER REGISTRATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Same centered card layout.
- Label: "Create a Customer Account"
- Fields: Full Name, Contact Number, Email, Password, 
  Confirm Password, Address, Barangay (dropdown)
- [Create Account] → navigates to Page 6 (BlueBot Onboarding)
- Bottom: "Already have an account? Log in" → navigates to Page 2

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE 4 — WORKER LOGIN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Same centered card layout.
- Label: "Worker Portal"
- Fields: Email, Password
- [Log In] → navigates to Page 12 (Worker Dashboard)
- "Forgot password?" link
- Divider: "or"
- [Continue with Google] outlined button
- Bottom: "Don't have an account? Register here" → navigates to Page 5

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE 5 — WORKER REGISTRATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Same centered card layout.
- Label: "Create a Worker Account"
- Fields: Full Name, Contact Number, Email, Password, 
  Confirm Password, Address, Barangay (dropdown), 
  Primary Skill (dropdown: Electrician, Plumber, Carpenter, 
  Painter, Mason, Welder, Aircon Technician)
- [Register as Worker] → navigates to Page 12 (Worker Dashboard)
- Bottom: "Already have an account? Log in" → navigates to Page 4

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE 6 — BLUEBOT ONBOARDING (CUSTOMER)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IMPORTANT: This is the FIRST page a customer sees after logging in or 
registering. It must feel like a welcoming AI assistant experience, 
NOT a typical dashboard or form.

This page is inspired by a "What do you want to make?" full-screen 
prompt interface — clean, centered, immersive. 

Layout:
- Full-page dark blue gradient background (#0F172A to #1B3A6B)
- Vertically and horizontally centered content

Top: BlueBot avatar (friendly robot icon, white/blue) + name "BlueBot"
Heading (large, white, bold): "What service do you need?"
Subheading (gray, smaller): 
  "Describe your problem and I'll find the right worker for you — 
   fast and hassle-free."

Large centered input box (like the Figma Make prompt box):
- Rounded, slightly glowing blue border on focus
- Placeholder text: "e.g. My sink is leaking, I need an electrician..."
- Inside bottom-left: a microphone icon and an image/attach icon
- Inside bottom-right: [Find Worker →] solid blue button

Below the input box — example suggestion chips in a row:
"🔧 Leaking pipe" | "💡 No electricity" | "🪟 Broken door" | 
"❄️ Aircon not cooling" | "🪣 Clogged drain"
(clicking any chip fills the input with that problem)

Bottom of page (subtle):
"Prefer to search manually? → Browse Workers" 
→ clicking this navigates to Page 7 (Worker Discovery + Map)

Top-right corner: notification bell + profile avatar dropdown
(minimal nav — this page should feel focused and uncluttered)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE 7 — WORKER DISCOVERY + MAP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Top navigation bar (customer nav):
- Left: BlueWorks logo
- Center nav links: Home | Find Workers (active) | My Bookings | Messages
- Right: notification bell, profile avatar, dark mode toggle

Split-screen layout (40% left panel / 60% right map):

LEFT PANEL — Search & Filters:
- Search bar: "Search by name, skill, or service..."
- Filter groups (collapsible):
  • Skill: Plumber, Electrician, Mason, Carpenter, Painter (checkboxes)
  • Distance: Within 1km, 3km, 5km (radio)
  • Availability: Today, Tomorrow, This Week
  • Experience: 1+, 3+, 5+ Years
  • Rating: 4★ and above, 4.5★ and above
  • Verification: Verified Only (toggle switch)
- Scrollable worker result cards below filters.
  Each card: avatar, name, skill badge, star rating, distance, 
  verified badge, availability dot, [View Profile] button
  → [View Profile] navigates to Page 8

  Results:
  1. Juan dela Cruz — Electrician — ⭐4.9 — 0.8km — ✅ — 🟢 Available Today
  2. Maria Santos — Plumber — ⭐4.7 — 1.2km — ✅ — 🟢 Available Today
  3. Rico Reyes — Carpenter — ⭐4.8 — 2.1km — ✅ — 🟡 Available Tomorrow
  4. Liza Bautista — Painter — ⭐4.6 — 3.5km — ✅ — 🟢 Available Today
  5. Ben Villanueva — Mason — ⭐4.5 — 4.8km — ✅ — 🔴 Unavailable

RIGHT PANEL — Dark Night Map:
- Style: Dark/night map — dark charcoal streets, muted colors, 
  white street labels. Styled like Mapbox Dark or Google Maps night mode.
  NOT a plain white or default map. This must look modern and techy.
- Map centered on Quezon City / Caloocan, Philippines area
- "You are here" marker: pulsing blue dot with a soft glowing blue ring
- Worker pins: circular avatar chips (profile photo inside a blue-bordered 
  circle with a pointed tail like a map pin). Show initials if no photo.
- On hover/click of a worker pin: floating tooltip card showing name, 
  skill, rating, distance, [View Profile] button
- Radius rings: transparent dashed blue circles at 1km, 3km, 5km 
  around the customer's location
- Map controls: zoom in/out, re-center button — all dark themed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE 8 — WORKER PROFILE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Same customer top nav bar.

Header card (wide):
- Large profile photo (left)
- Name: Juan dela Cruz
- Skill badges: Electrician | Rewiring | Lighting Installation
- ✅ Verified Identity | ✅ Verified Skills
- ⭐ 4.9 (128 reviews) | 📋 143 Jobs | 🔁 87 Repeat Customers
- 📍 Barangay Fairview, Quezon City
- 🕐 Responds within 30 minutes
- Trust Score: 92/100 (circular blue progress badge)
- Buttons: [Book Now] (primary) → navigates to Page 9 | 
           [Message] (secondary) → navigates to Page 10 (BlueBot/chat)

Tabs: About | Portfolio | Reviews | Availability

About Tab (default):
- Bio: "Licensed electrician with 8 years of experience specializing 
  in residential rewiring, panel upgrades, and lighting systems."
- Experience: 8 Years
- Service Area: Fairview, Novaliches, Batasan, Lagro (QC)
- Pricing: Inspection Fee ₱300 | Hourly ₱500/hr | Fixed from ₱800
- Certifications: TESDA NC II & NC III Electrical Installation

Portfolio Tab:
- 6 before/after photo pair cards with captions

Reviews Tab:
- 4 review cards: avatar, name, stars, date, comment, job type tag

Availability Tab:
- Weekly grid: Mon–Sat hours shown, Wed & Sun marked unavailable

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE 9 — BOOKING FLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Same customer top nav bar.
Progress bar at top: Step 1 → Step 2 → Step 3 → Step 4

Step 1 — Job Details:
- Job Title (text input)
- Job Description (textarea)
- Upload Photos (drag-and-drop zone, optional)
- Address (pre-filled, editable)
- [Next →] button

Step 2 — Schedule:
- Month calendar date picker
- Time slot selector: Morning | Afternoon | Evening (highlight selected in blue)
- [Next →] and [← Back] buttons

Step 3 — Confirm & Review:
- Summary card:
  • Worker: Juan dela Cruz — Electrician
  • Job: Ceiling Light Installation
  • Date: Friday, July 18, 2025 — Morning (8AM–12PM)
  • Address: 123 Sampaguita St., Barangay Fairview, Quezon City
  • Estimated Cost: ₱1,500 – ₱3,000
- [Confirm Booking] primary button → navigates to Step 4
- [← Back] link

Step 4 — Booking Confirmed:
- Large blue circle with white checkmark (success state)
- Heading: "Booking Sent!"
- Message: "Juan dela Cruz will review your request and confirm shortly. 
  You'll be notified once accepted."
- Reference: #BW-20250718-0042
- [View Booking Status] and [Go to Home] buttons

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE 10 — CUSTOMER AI ASSISTANT (BlueBot Chat)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Same customer top nav bar.
Full-page chat layout (like a modern messaging app):

Left sidebar — chat history:
- "Leaking sink repair" — 2 days ago
- "Electrician for rewiring" — 1 week ago
- "Aircon cleaning" — 2 weeks ago
[+ New Chat] button at top of sidebar

Main chat area:
- Top bar: BlueBot robot avatar + "BlueBot" name + "AI Assistant" label 
  + blue online dot
- Chat thread (show a demo conversation):

  [BlueBot]: "Hi Ana! 👋 What service do you need today? 
   Describe your problem and I'll find the right worker for you."

  [User - Ana Reyes]: "My sink is leaking under the kitchen cabinet."

  [BlueBot]: "Got it! Sounds like a pipe or drain leak — you need a 
   plumber. Let me find the best ones near you 🔧"

  [BlueBot — inline worker result cards, 3 cards side by side]:
  • Maria Santos — Plumber — ⭐4.7 — 1.2km — [Book]
  • Dennis Ramos — Plumber — ⭐4.5 — 2.4km — [Book]
  • Carlo Abad — Plumber — ⭐4.4 — 3.1km — [Book]

  [BlueBot]: "Would you like me to check availability and book one for you?"

  [User]: "Yes, book Maria Santos for tomorrow morning."

  [BlueBot]: "Maria Santos is available tomorrow morning! 
   Taking you to confirm the booking now. 📅"
  [Proceed to Booking →] button shown inline in chat

- Bottom input bar: text field "Ask BlueBot anything..." 
  + mic icon + attach icon + [Send] blue button

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE 11 — REVIEWS & RATINGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Same customer top nav bar.

Top summary (for Juan dela Cruz):
- Large "4.9" + star display + "(128 reviews)"
- Rating breakdown bars:
  • Work Quality: 4.9
  • Professionalism: 4.8
  • Punctuality: 4.7
  • Communication: 4.9

Filter tabs: All Reviews | 5 Stars | 4 Stars | 3 Stars & below

Review cards (5 shown):
1. Ana Reyes — ⭐⭐⭐⭐⭐ — July 10 — "Electrical Repair"
   "Very professional. Arrived on time, cleaned up after. Will hire again!"
2. Carlo Mendoza — ⭐⭐⭐⭐⭐ — June 28 — "Rewiring"
   "Fixed our short circuit quickly. Highly recommended!"
3. Jenny Cruz — ⭐⭐⭐⭐ — June 15 — "Panel Inspection"
   "Good work, arrived 30 mins late. Great overall though."
4. Mark Lim — ⭐⭐⭐⭐⭐ — June 5 — "Lighting Installation"
   "Very affordable and honest. My go-to electrician."
5. Rose Dela Torre — ⭐⭐⭐⭐⭐ — May 29 — "Outlet Repair"
   "Fast, efficient, and polite. Highly recommended!"

Leave a Review section (shown after a completed booking):
- 1–5 star tap selector
- Category sliders: Work Quality, Professionalism, Punctuality, Communication
- Textarea: "Share your experience..."
- [Submit Review] primary button

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE 12 — WORKER DASHBOARD (HOME)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Layout: persistent left sidebar + main content area

Left Sidebar (dark blue #1B3A6B, white icons and labels):
- BlueWorks logo at top
- Navigation items (with icons):
  • 🏠 Dashboard (active on this page)
  • 📋 My Jobs → Page 13
  • 📅 Schedule → Page 14
  • 💬 Messages → Page 15
  • 👤 My Profile → Page 16
  • 💰 Earnings → Page 17
- Bottom of sidebar: profile avatar + name + [Log Out]

Main content:

Greeting: "Good morning, Juan! 👋"
Today's date: Tuesday, July 15, 2025

4 stat cards in a row:
- Jobs Today: 2
- Pending Requests: 3
- This Month's Earnings: ₱18,500
- Average Rating: ⭐ 4.9

Upcoming Jobs section:
3 job cards, each showing: customer avatar, name, job title, 
date & time, address, status badge, [View Details] button
1. Ana Reyes — "Ceiling fan installation" — Today 10:00 AM — 
   45 Rosal St. Fairview — 🟢 In Progress
2. Carlo Mendoza — "Outlet rewiring" — Today 2:00 PM — 
   12 Dahlia Ave. Novaliches — 🔵 Accepted
3. Jenny Cruz — "Panel check" — Tomorrow 9:00 AM — 
   88 Iris St. Batasan — 🟡 Pending

BlueBot Worker Assistant (right-side floating panel):
- Header: BlueBot avatar + "Ask BlueBot"
- Demo conversation:
  [Juan]: "What jobs do I have tomorrow?"
  [BlueBot]: "You have 1 job tomorrow — Panel check with Jenny Cruz 
   at 9:00 AM in Batasan. Don't forget your tools! 🔧"
- Input field at bottom

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE 13 — MY JOBS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Same worker sidebar (My Jobs active).

Tabs at top: All | Pending | Accepted | In Progress | Completed | Cancelled

Table or card list of jobs:
Columns: Customer | Job Title | Date & Time | Address | Status | Action

Show 6 jobs across different statuses:
1. Ana Reyes — Ceiling fan install — July 15, 10AM — Fairview — 🟢 In Progress — [View]
2. Carlo Mendoza — Outlet rewiring — July 15, 2PM — Novaliches — 🔵 Accepted — [View]
3. Jenny Cruz — Panel check — July 16, 9AM — Batasan — 🟡 Pending — [Accept] [Reject]
4. Mark Lim — Lighting install — July 12 — Lagro — ✅ Completed — [View]
5. Rose Dela Torre — Outlet repair — July 10 — Fairview — ✅ Completed — [View]
6. Bong Santos — Rewiring — July 8 — Novaliches — ❌ Cancelled — [View]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE 14 — SCHEDULE / CALENDAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Same worker sidebar (Schedule active).

Full month calendar view (July 2025):
- Color coding: 
  Blue = booked/job scheduled
  Green = available
  Gray = blocked/unavailable
- Booked dates (July 15, 16, 18, 20, 22) show small job count badges
- Wednesday July 16 and Sunday July 20 shown as unavailable (gray)

Below calendar — Set Availability section:
- Day-by-day working hours table:
  Mon: 8AM–5PM ✅ | Tue: 8AM–5PM ✅ | Wed: ❌ Unavailable |
  Thu: 8AM–5PM ✅ | Fri: 8AM–5PM ✅ | Sat: 9AM–12PM ✅ | Sun: ❌ Unavailable
- [Block Date] and [Set Hours] action buttons

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE 15 — MESSAGES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Same worker sidebar (Messages active).

Two-column layout:
Left: conversation list
  • Ana Reyes — "On my way po!" — 10:02 AM — unread dot
  • Carlo Mendoza — "Salamat!" — Yesterday
  • Jenny Cruz — "Pwede ba bukas?" — Yesterday
  • Mark Lim — "Kumusta yung parts?" — 2 days ago

Right: active chat with Ana Reyes:
- Chat header: Ana Reyes avatar + name + green online dot
- Chat bubbles:
  [Ana]: "Kamusta po, nakalabas na po ba kayo?"
  [Juan]: "Oo po, on my way na. 15 mins pa lang."
  [Ana]: "Sige po, bukas na po yung gate."
  [Juan]: "Ok po! Salamat." 
  [Ana]: "On my way po!" (latest, unread)
- Input bar: text field + photo attach icon + [Send] button

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE 16 — WORKER PROFILE EDITOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Same worker sidebar (My Profile active).

Profile preview card at top (read-only display of current profile):
Same layout as Page 8 Worker Profile — showing Juan's current info.

Below — Edit Profile form sections (collapsible accordions):

Basic Information:
- Profile Photo upload
- Full Name, Bio (textarea), Contact Number, Address, Barangay

Skills & Experience:
- Primary Skill (dropdown), Additional Skills (multi-select chips)
- Years of Experience (number input)

Certifications:
- Upload area for TESDA certificates (drag and drop)
- List of uploaded certs with delete option

Portfolio:
- Upload before/after photos with caption input
- Grid of existing uploads

Service & Pricing:
- Service Area (checkboxes for barangays/municipalities)
- Inspection Fee (₱), Hourly Rate (₱/hr), Fixed Rate (₱)

[Save Changes] primary button at bottom of each section

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE 17 — EARNINGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Same worker sidebar (Earnings active).

Top summary cards (3 in a row):
- This Month: ₱18,500
- Last Month: ₱21,200
- Total Earned: ₱184,750

Line chart — Monthly Earnings (Jan–Jul 2025):
Data: ₱14,000 | ₱16,500 | ₱19,000 | ₱17,800 | ₱22,000 | ₱21,200 | ₱18,500

Earnings breakdown table:
Columns: Date | Customer | Job | Amount | Status

Rows:
1. July 15 — Ana Reyes — Ceiling fan install — ₱1,200 — ✅ Paid
2. July 12 — Mark Lim — Lighting install — ₱2,500 — ✅ Paid
3. July 10 — Rose Dela Torre — Outlet repair — ₱800 — ✅ Paid
4. July 8 — Bong Santos — Rewiring — ₱4,500 — ❌ Cancelled
5. July 5 — Jenny Cruz — Panel check — ₱1,500 — ✅ Paid

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE 18 — ADMIN DASHBOARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Layout: Left sidebar + main content

Admin Sidebar (same dark blue as worker sidebar):
- 🏠 Overview (active)
- 👥 Users
- 🔧 Workers
- 📋 Bookings
- 🚩 Reports
- 📊 Analytics
- ⚙️ Settings

Top stat cards (6 cards, 2 rows of 3):
- Total Users: 4,821
- Total Workers: 1,203
- Jobs Completed: 9,540
- Pending Verifications: 37
- Active Reports: 12
- Platform Revenue: ₱245,000

Charts section (2 charts side by side):
Left — Line chart "Jobs Completed Per Month" (Jan–Jul 2025):
320 | 410 | 580 | 620 | 750 | 890 | 940

Right — Horizontal bar chart "Most Requested Skills":
Electrician 1,840 | Plumber 1,620 | Carpenter 1,100 | 
Painter 890 | Aircon Tech 760 | Mason 540

Pending Verifications table:
Columns: Worker Name | Date Submitted | ID Type | Skill Cert | Actions
4 rows of pending workers with [Approve ✅] and [Reject ❌] buttons

Active Reports table:
Columns: Report ID | Type | Filed By | Against | Date | Status | Action
3 rows:
- #R-001 — Fake Profile — Customer — Rico Delos Santos — July 14 — 
  🔴 Open — [Review]
- #R-002 — Customer Complaint — Customer — Lito Perez — July 13 — 
  🟡 Under Review — [Review]
- #R-003 — Fraud Report — Customer — Alma Cruz — July 10 — 
  🟢 Resolved — [View]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NAVIGATION CONNECTIONS SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ensure all these links are functional and clickable:

Landing → Customer Login (via "Find a Worker")
Landing → Worker Login (via "Offer My Skills")
Customer Login → BlueBot Onboarding (Page 6)
Customer Registration → BlueBot Onboarding (Page 6)
BlueBot Onboarding → Worker Discovery + Map (via "Browse Workers")
BlueBot Onboarding → BlueBot Chat (via submitting a prompt)
Worker Discovery → Worker Profile (via "View Profile")
Worker Profile → Booking Flow (via "Book Now")
Worker Profile → BlueBot Chat (via "Message")
Booking Flow Step 3 → Step 4 Confirmation
Worker Login → Worker Dashboard
Worker Registration → Worker Dashboard
Worker Sidebar → All worker pages (My Jobs, Schedule, Messages, Profile, Earnings)
Admin Sidebar → All admin sub-pages

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GLOBAL DESIGN RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Border radius: 12px cards, 8px buttons, 999px badges
- All pages support light AND dark mode via a toggle in the nav
- Consistent icon set throughout (Heroicons style)
- Status dots: 8px — green (available), yellow (busy), red (unavailable)
- All tables: zebra stripe rows, sortable headers
- Buttons: Primary = solid blue | Secondary = outlined blue | Danger = red
- Badges: pill-shaped, color-coded
- Filipino-context dummy data throughout (names, barangays, cities, 
  prices in Philippine Peso ₱)
- Dark mode: #0F172A background, #1E293B cards, #E2E8F0 text