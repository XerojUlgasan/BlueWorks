export const P = "#1B3A6B"; // primary blue
export const A = "#3B82F6"; // accent sky blue

export const BLUEBOT_HISTORY: { label: string; ago: string; messages: { from: "user" | "bot"; text: string }[] }[] = [
  {
    label: "Leaking sink repair",
    ago: "2 days ago",
    messages: [
      { from: "user", text: "My kitchen sink has been leaking for 2 days now." },
      { from: "bot",  text: "I can help with that! Is the leak coming from the faucet, the drain, or the pipes under the sink?" },
      { from: "user", text: "It's under the sink, near the pipe joint." },
      { from: "bot",  text: "Got it — that's likely a loose or worn pipe fitting. I found 3 plumbers available today near you. Want me to show them?" },
      { from: "user", text: "Yes please." },
      { from: "bot",  text: "Here are the top matches: Juan dela Cruz (4.9★, 0.8 km), Maria Santos (4.7★, 1.2 km). Tap one to book!" },
    ],
  },
  {
    label: "Electrician for rewiring",
    ago: "1 week ago",
    messages: [
      { from: "user", text: "I need someone to rewire my living room. Some outlets stopped working." },
      { from: "bot",  text: "That sounds like a tripped breaker or faulty wiring. Is the whole room affected or just specific outlets?" },
      { from: "user", text: "Just 2 outlets on one wall." },
      { from: "bot",  text: "Likely a single circuit issue. I found 2 licensed electricians available this week near you." },
      { from: "user", text: "Can they come tomorrow?" },
      { from: "bot",  text: "Yes! Ben Villanueva is available tomorrow. Want me to send him a booking request?" },
    ],
  },
  {
    label: "Aircon cleaning",
    ago: "2 weeks ago",
    messages: [
      { from: "user", text: "My aircon is blowing warm air and smells musty." },
      { from: "bot",  text: "That usually means the filters are clogged or the unit needs a general cleaning. When was it last cleaned?" },
      { from: "user", text: "Maybe 8 months ago." },
      { from: "bot",  text: "Definitely overdue! I found an aircon technician available today — Rico Reyes (4.8★, 2.1 km). Shall I book?" },
    ],
  },
];

export const BARANGAYS = [
  "Fairview", "Novaliches", "Batasan Hills", "Lagro", "Commonwealth",
  "Bagong Silangan", "Holy Spirit", "Payatas", "Matandang Balara", "Tandang Sora",
];

// Barangay approximate center coordinates (Quezon City)
export const BARANGAY_COORDS: Record<string, { lat: number; lng: number }> = {
  "Fairview":           { lat: 14.7325, lng: 121.0588 },
  "Novaliches":         { lat: 14.7294, lng: 121.0448 },
  "Batasan Hills":      { lat: 14.6870, lng: 121.0980 },
  "Lagro":              { lat: 14.7176, lng: 121.0490 },
  "Commonwealth":       { lat: 14.7028, lng: 121.0882 },
  "Bagong Silangan":    { lat: 14.6944, lng: 121.1046 },
  "Holy Spirit":        { lat: 14.6985, lng: 121.0818 },
  "Payatas":            { lat: 14.7055, lng: 121.1058 },
  "Matandang Balara":   { lat: 14.6764, lng: 121.0682 },
  "Tandang Sora":       { lat: 14.6899, lng: 121.0448 },
};

export const SKILLS_LIST = [
  "Electrician", "Plumber", "Carpenter", "Painter", "Mason", "Welder", "Aircon Technician",
];

export const JOB_CATEGORIES = [
  { id: "electrician",      label: "Electrician",       icon: "⚡", desc: "Wiring, panels, outlets, lighting" },
  { id: "plumber",          label: "Plumber",           icon: "🔧", desc: "Pipes, leaks, drainage, fixtures"  },
  { id: "carpenter",        label: "Carpenter",         icon: "🪚", desc: "Furniture, doors, partitions"      },
  { id: "painter",          label: "Painter",           icon: "🖌️", desc: "Interior & exterior painting"     },
  { id: "mason",            label: "Mason",             icon: "🧱", desc: "Concrete, tiles, stonework"        },
  { id: "welder",           label: "Welder",            icon: "🔥", desc: "Metal fabrication & welding"       },
  { id: "aircon_tech",      label: "Aircon Technician", icon: "❄️", desc: "Installation, cleaning, repair"   },
  { id: "general_handyman", label: "General Handyman",  icon: "🛠️", desc: "Mixed repairs & maintenance"     },
];

export const SECONDARY_SKILLS: Record<string, string[]> = {
  electrician:      ["Rewiring", "Panel Upgrade", "Lighting Install", "Outlet Repair", "Aircon Wiring", "CCTV Install"],
  plumber:          ["Pipe Repair", "Drainage", "Water Heater", "Faucet Fix", "Bathroom Install", "Tank Repair"],
  carpenter:        ["Cabinet Making", "Door Install", "Flooring", "Framing", "Furniture Repair", "Partition"],
  painter:          ["Wall Painting", "Ceiling Paint", "Epoxy Coat", "Varnish", "Waterproofing", "Texture Paint"],
  mason:            ["Tile Setting", "Concrete Work", "Plastering", "Brick Laying", "Waterproofing", "Flooring"],
  welder:           ["Arc Welding", "TIG Welding", "Metal Cutting", "Gate Fabrication", "Steel Railing", "Grille"],
  aircon_tech:      ["AC Install", "AC Cleaning", "Refrigerant Recharge", "AC Repair", "Ventilation", "Exhaust Fan"],
  general_handyman: ["Minor Repairs", "Furniture Assembly", "Painting", "Plumbing Fix", "Electrical Fix", "Cleaning"],
};

export const WORKERS = [
  { id: 1, name: "Juan dela Cruz",  skill: "Electrician", rating: 4.9, dist: "0.8 km", status: "Today",       color: "#3B82F6", mx: 270, my: 258 },
  { id: 2, name: "Maria Santos",    skill: "Plumber",      rating: 4.7, dist: "1.2 km", status: "Today",       color: "#10B981", mx: 370, my: 205 },
  { id: 3, name: "Rico Reyes",      skill: "Carpenter",    rating: 4.8, dist: "2.1 km", status: "Tomorrow",    color: "#F59E0B", mx: 435, my: 305 },
  { id: 4, name: "Liza Bautista",   skill: "Painter",      rating: 4.6, dist: "3.5 km", status: "Today",       color: "#EC4899", mx: 188, my: 322 },
  { id: 5, name: "Ben Villanueva",  skill: "Mason",        rating: 4.5, dist: "4.8 km", status: "Unavailable", color: "#8B5CF6", mx: 510, my: 185 },
];

export const EARNINGS_DATA = [
  { month: "Jan", amount: 14000 }, { month: "Feb", amount: 16500 },
  { month: "Mar", amount: 19000 }, { month: "Apr", amount: 17800 },
  { month: "May", amount: 22000 }, { month: "Jun", amount: 21200 },
  { month: "Jul", amount: 18500 },
];

export const ADMIN_JOBS = [
  { month: "Jan", jobs: 320 }, { month: "Feb", jobs: 410 }, { month: "Mar", jobs: 580 },
  { month: "Apr", jobs: 620 }, { month: "May", jobs: 750 }, { month: "Jun", jobs: 890 },
  { month: "Jul", jobs: 940 },
];

export const SKILL_DEMAND = [
  { skill: "Electrician", count: 1840 }, { skill: "Plumber", count: 1620 },
  { skill: "Carpenter", count: 1100 }, { skill: "Painter", count: 890 },
  { skill: "Aircon Tech", count: 760 }, { skill: "Mason", count: 540 },
];
