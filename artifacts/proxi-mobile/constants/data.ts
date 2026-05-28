export interface Seller {
  id: string;
  name: string;
  score: number;
  verified: boolean;
  phoneVerified: boolean;
  memberSince: string;
}

export interface Listing {
  id: string;
  title: string;
  price: number;
  negotiable: boolean;
  category: string;
  condition: "New" | "Used" | "Refurbished";
  location: string;
  distance: string;
  description: string;
  delivery: "Pickup" | "Delivery" | "Both";
  seller: Seller;
  tags: string[];
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  budget: number;
  budgetType: "Fixed" | "Hourly";
  category: string;
  location: string;
  remote: boolean;
  deadline: string;
  description: string;
  poster: Seller;
  urgency: "High" | "Medium" | "Low";
  createdAt: string;
}

export interface Message {
  id: string;
  from: "me" | "them";
  text: string;
  time: string;
  isOffer?: boolean;
  offerAmount?: number;
}

export interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  score: number;
  listingTitle?: string;
  messages: Message[];
}

export interface OrderStep {
  label: string;
  done: boolean;
  active: boolean;
}

export interface Order {
  id: string;
  status: "Escrow" | "Delivered" | "Completed" | "Disputed";
  listingTitle: string;
  amount: number;
  buyerName: string;
  sellerName: string;
  timeline: OrderStep[];
}

export const MY_USER = {
  id: "me",
  name: "Tunde Adebayo",
  phone: "+234 812 345 6789",
  bio: "Verified trader based in Lagos. Fast delivery guaranteed.",
  location: "Ikeja, Lagos",
  type: "Trader" as const,
  score: 82,
  phoneVerified: true,
  idVerified: true,
  memberSince: "Jan 2024",
  listings: 12,
  completedOrders: 47,
  reviews: 38,
  walletBalance: 12400,
  escrowHeld: 5000,
};

export const SELLERS: Seller[] = [
  { id: "s1", name: "Chidi Okonkwo", score: 88, verified: true, phoneVerified: true, memberSince: "Mar 2023" },
  { id: "s2", name: "Ada Nwachukwu", score: 75, verified: true, phoneVerified: true, memberSince: "Jul 2023" },
  { id: "s3", name: "Emeka Dike", score: 92, verified: true, phoneVerified: true, memberSince: "Jan 2023" },
  { id: "s4", name: "Bola Adeyemi", score: 61, verified: false, phoneVerified: true, memberSince: "Nov 2023" },
  { id: "s5", name: "Ngozi Eze", score: 45, verified: false, phoneVerified: true, memberSince: "Dec 2023" },
  { id: "s6", name: "Kola Fashola", score: 78, verified: true, phoneVerified: true, memberSince: "Apr 2023" },
  { id: "s7", name: "Amaka Obi", score: 84, verified: true, phoneVerified: true, memberSince: "Feb 2023" },
];

export const LISTINGS: Listing[] = [
  {
    id: "l1",
    title: "iPhone 14 Pro Max 256GB – Space Black",
    price: 350000,
    negotiable: true,
    category: "Electronics",
    condition: "Used",
    location: "Ikeja, Lagos",
    distance: "1.2km",
    description: "Excellent condition iPhone 14 Pro Max. Bought in the UK, no fault whatsoever. Comes with original box, charger, and 6 months warranty. Battery health 91%. Face ID fully functional.",
    delivery: "Both",
    seller: SELLERS[0],
    tags: ["iPhone", "Apple", "Smartphone"],
    createdAt: "2 hours ago",
  },
  {
    id: "l2",
    title: "Toyota Camry 2019 SE – Silver",
    price: 4200000,
    negotiable: true,
    category: "Vehicles",
    condition: "Used",
    location: "Lekki Phase 1, Lagos",
    distance: "4.5km",
    description: "Foreign-used Toyota Camry 2019 model, SE trim. Lagos cleared with full customs papers. AC perfect, leather seats, reverse camera. First body, no accident history.",
    delivery: "Pickup",
    seller: SELLERS[2],
    tags: ["Toyota", "Camry", "Car"],
    createdAt: "5 hours ago",
  },
  {
    id: "l3",
    title: "DSTV Premium Decoder + Dish Complete Set",
    price: 45000,
    negotiable: false,
    category: "Electronics",
    condition: "New",
    location: "Surulere, Lagos",
    distance: "2.8km",
    description: "Brand new DSTV decoder with dish, LNB, cables, and remote. Full installation included if you're within Surulere. Ready to start watching immediately after installation.",
    delivery: "Both",
    seller: SELLERS[5],
    tags: ["DSTV", "Satellite", "TV"],
    createdAt: "1 day ago",
  },
  {
    id: "l4",
    title: "Men's 3-Piece Corporate Blazer Set",
    price: 15000,
    negotiable: true,
    category: "Fashion",
    condition: "New",
    location: "Yaba, Lagos",
    distance: "3.1km",
    description: "Premium quality 3-piece suit: blazer, trousers, and waistcoat. Available in sizes M, L, XL. Navy blue color. Perfect for corporate events and interviews.",
    delivery: "Delivery",
    seller: SELLERS[1],
    tags: ["Suit", "Corporate", "Fashion"],
    createdAt: "2 days ago",
  },
  {
    id: "l5",
    title: "MacBook Air M2 – Midnight – 8GB/256GB",
    price: 750000,
    negotiable: false,
    category: "Electronics",
    condition: "Used",
    location: "Victoria Island, Lagos",
    distance: "6.2km",
    description: "MacBook Air M2 chip, barely used (6 months). No scratches or dents. Full charger included. Battery cycles at 48. Perfect for students and professionals.",
    delivery: "Pickup",
    seller: SELLERS[2],
    tags: ["MacBook", "Apple", "Laptop"],
    createdAt: "3 days ago",
  },
  {
    id: "l6",
    title: "Binatone Standing Fan – 18 Inches",
    price: 12500,
    negotiable: false,
    category: "Home",
    condition: "Used",
    location: "Ojodu Berger, Lagos",
    distance: "7.4km",
    description: "Binatone 18-inch standing fan, used for 8 months. Works perfectly, all 3 speeds functional. Oscillates 120 degrees. Clean and well maintained.",
    delivery: "Pickup",
    seller: SELLERS[3],
    tags: ["Fan", "Home Appliance", "Cooling"],
    createdAt: "4 days ago",
  },
  {
    id: "l7",
    title: "Honda CRV 2020 – Pearl White",
    price: 8500000,
    negotiable: true,
    category: "Vehicles",
    condition: "Used",
    location: "Ikorodu, Lagos",
    distance: "18.3km",
    description: "Tokunbo Honda CRV 2020, automatic transmission. Full option: sunroof, leather seats, 360 camera, lane assist. Low mileage (42,000 miles). Full Lagos papers.",
    delivery: "Pickup",
    seller: SELLERS[6],
    tags: ["Honda", "CRV", "SUV"],
    createdAt: "1 week ago",
  },
  {
    id: "l8",
    title: "Samsung Galaxy A54 5G – 128GB",
    price: 185000,
    negotiable: true,
    category: "Electronics",
    condition: "New",
    location: "Ajah, Lagos",
    distance: "9.1km",
    description: "Brand new Samsung Galaxy A54 5G in sealed box. 6.4-inch AMOLED display, 5000mAh battery, 50MP triple camera. Black color. 1 year Samsung warranty.",
    delivery: "Both",
    seller: SELLERS[4],
    tags: ["Samsung", "Android", "5G"],
    createdAt: "5 hours ago",
  },
  {
    id: "l9",
    title: "Ankara Dutch Wax Fabric – 12 Yards",
    price: 8000,
    negotiable: false,
    category: "Fashion",
    condition: "New",
    location: "Balogun Market, Lagos",
    distance: "5.5km",
    description: "Genuine Holland Dutch wax Ankara fabric, 12 yards. Beautiful vibrant patterns, suitable for aso-ebi and events. Multiple designs available, contact to see options.",
    delivery: "Delivery",
    seller: SELLERS[1],
    tags: ["Ankara", "Fabric", "African Print"],
    createdAt: "6 hours ago",
  },
  {
    id: "l10",
    title: "Midea Rice Cooker – 1.8L Capacity",
    price: 18000,
    negotiable: false,
    category: "Home",
    condition: "New",
    location: "Mushin, Lagos",
    distance: "4.0km",
    description: "Brand new Midea 1.8L digital rice cooker. Non-stick pot, delay timer, keep-warm function. Perfect for a family of 4-5. 1 year warranty. Box intact.",
    delivery: "Both",
    seller: SELLERS[5],
    tags: ["Cooker", "Kitchen", "Appliance"],
    createdAt: "2 days ago",
  },
];

export const TASKS: Task[] = [
  {
    id: "t1",
    title: "Design website for my Mama Put restaurant",
    budget: 80000,
    budgetType: "Fixed",
    category: "Tech & Design",
    location: "Surulere, Lagos",
    remote: true,
    deadline: "7 days",
    urgency: "Medium",
    description: "I need a simple 5-page website for my food restaurant. Pages: Home, Menu, About Us, Gallery, Contact. Must be mobile-friendly. I'll provide photos and menu details.",
    poster: SELLERS[1],
    createdAt: "3 hours ago",
  },
  {
    id: "t2",
    title: "Help move furniture to new apartment in Ikoyi",
    budget: 25000,
    budgetType: "Fixed",
    category: "Moving & Delivery",
    location: "Ikoyi, Lagos",
    remote: false,
    deadline: "2 days",
    urgency: "High",
    description: "Moving from a 2-bedroom in Surulere to Ikoyi. Furniture includes 1 large sofa, dining table + 6 chairs, 2 beds, and miscellaneous boxes. Need strong hands and a truck.",
    poster: SELLERS[3],
    createdAt: "1 hour ago",
  },
  {
    id: "t3",
    title: "Fix leaking kitchen sink and toilet flush",
    budget: 15000,
    budgetType: "Fixed",
    category: "Home Repairs",
    location: "Gbagada, Lagos",
    remote: false,
    deadline: "Today",
    urgency: "High",
    description: "Kitchen sink has been dripping for 2 days. Toilet flush handle is broken. Need a licensed plumber who can handle both in one visit. Materials cost extra.",
    poster: SELLERS[0],
    createdAt: "30 minutes ago",
  },
  {
    id: "t4",
    title: "Logo design for clothing brand 'Kente Lagos'",
    budget: 35000,
    budgetType: "Fixed",
    category: "Design",
    location: "Remote",
    remote: true,
    deadline: "5 days",
    urgency: "Medium",
    description: "Modern, minimal logo for a premium African clothing brand. Inspired by Kente cloth patterns but contemporary. Deliverables: logo in PNG/SVG, brand colors, usage guide.",
    poster: SELLERS[6],
    createdAt: "4 hours ago",
  },
  {
    id: "t5",
    title: "English & Maths tutoring for JSS3 student",
    budget: 8000,
    budgetType: "Hourly",
    category: "Education",
    location: "Surulere, Lagos",
    remote: false,
    deadline: "Ongoing",
    urgency: "Low",
    description: "Looking for an experienced tutor for my JSS3 son. 3 sessions per week, 2 hours each. Must be patient and able to explain WAEC past questions. Recommended books provided.",
    poster: SELLERS[2],
    createdAt: "1 day ago",
  },
  {
    id: "t6",
    title: "Photography for traditional engagement ceremony",
    budget: 150000,
    budgetType: "Fixed",
    category: "Events",
    location: "Lekki, Lagos",
    remote: false,
    deadline: "Dec 14",
    urgency: "Medium",
    description: "Traditional engagement ceremony, approximately 5 hours. Need a professional photographer with DSLR, editing included. Final delivery: 300+ edited photos, 2-week turnaround.",
    poster: SELLERS[4],
    createdAt: "2 days ago",
  },
  {
    id: "t7",
    title: "Errand: pick up items from Computer Village",
    budget: 3500,
    budgetType: "Fixed",
    category: "Errands",
    location: "Ikeja, Lagos",
    remote: false,
    deadline: "Today",
    urgency: "High",
    description: "Need someone to pick up a laptop charger and power bank from a shop in Computer Village, Ikeja and deliver to Oshodi. Exact shop address will be provided. Must be trustworthy.",
    poster: SELLERS[5],
    createdAt: "15 minutes ago",
  },
  {
    id: "t8",
    title: "Set up Excel inventory tracking for retail shop",
    budget: 20000,
    budgetType: "Fixed",
    category: "Tech & Design",
    location: "Remote",
    remote: true,
    deadline: "3 days",
    urgency: "Low",
    description: "Need an Excel/Google Sheets expert to create an inventory management system for my shop. Auto-calculations, low stock alerts, monthly summary. Provide template + tutorial video.",
    poster: SELLERS[6],
    createdAt: "6 hours ago",
  },
];

export const CONVERSATIONS: Conversation[] = [
  {
    id: "c1",
    name: "Chidi Okonkwo",
    lastMessage: "Is the price still negotiable?",
    time: "2m",
    unread: 2,
    score: 88,
    listingTitle: "iPhone 14 Pro Max",
    messages: [
      { id: "m1", from: "them", text: "Hello, I saw your iPhone listing. Is it still available?", time: "10:30 AM" },
      { id: "m2", from: "me", text: "Yes, still available. Are you interested?", time: "10:32 AM" },
      { id: "m3", from: "them", text: "Very interested! Can you do ₦320,000?", time: "10:45 AM", isOffer: true, offerAmount: 320000 },
      { id: "m4", from: "me", text: "Best I can do is ₦340,000. It's in excellent condition.", time: "10:47 AM" },
      { id: "m5", from: "them", text: "Is the price still negotiable?", time: "11:02 AM" },
    ],
  },
  {
    id: "c2",
    name: "Ada Nwachukwu",
    lastMessage: "When can you start the project?",
    time: "1h",
    unread: 0,
    score: 75,
    listingTitle: "Restaurant Website Task",
    messages: [
      { id: "m1", from: "them", text: "Hi, I saw you applied for my website project. Can you share your portfolio?", time: "9:00 AM" },
      { id: "m2", from: "me", text: "Sure! Here's my portfolio: [link]. I've done 15+ websites this year.", time: "9:05 AM" },
      { id: "m3", from: "them", text: "Looks great! When can you start the project?", time: "9:20 AM" },
    ],
  },
  {
    id: "c3",
    name: "Emeka Dike",
    lastMessage: "I'll send payment through Proxi escrow",
    time: "3h",
    unread: 1,
    score: 92,
    listingTitle: "Toyota Camry 2019",
    messages: [
      { id: "m1", from: "them", text: "Good evening. Still interested in the Camry. Can we do inspection tomorrow?", time: "Yesterday" },
      { id: "m2", from: "me", text: "Of course! Come to Lekki by 10 AM. I'll be available all morning.", time: "Yesterday" },
      { id: "m3", from: "them", text: "Perfect. If all checks out, I'll send payment through Proxi escrow", time: "3h ago" },
    ],
  },
];

export const ORDERS: Order[] = [
  {
    id: "PRX-00124",
    status: "Escrow",
    listingTitle: "iPhone 14 Pro Max 256GB",
    amount: 350000,
    buyerName: "Emeka Dike",
    sellerName: "Chidi Okonkwo",
    timeline: [
      { label: "Offer accepted", done: true, active: false },
      { label: "Payment in escrow", done: true, active: true },
      { label: "Item delivered", done: false, active: false },
      { label: "Funds released", done: false, active: false },
    ],
  },
  {
    id: "PRX-00098",
    status: "Completed",
    listingTitle: "Logo Design – Kente Lagos",
    amount: 35000,
    buyerName: "Kola Fashola",
    sellerName: "Ada Nwachukwu",
    timeline: [
      { label: "Offer accepted", done: true, active: false },
      { label: "Payment in escrow", done: true, active: false },
      { label: "Work delivered", done: true, active: false },
      { label: "Funds released", done: true, active: true },
    ],
  },
];

export const TASK_APPLICATIONS: Record<string, { applicantName: string; score: number; rate: string; message: string }[]> = {
  t1: [
    { applicantName: "Kola Fashola", score: 78, rate: "₦75,000 fixed", message: "I've built 20+ restaurant websites. Portfolio available." },
    { applicantName: "Amaka Obi", score: 84, rate: "₦80,000 fixed", message: "Full-stack developer, 5 years experience. Can deliver in 5 days." },
    { applicantName: "Chidi Okonkwo", score: 88, rate: "₦65,000 fixed", message: "Freelance web designer. Let me show you my food sector portfolio." },
  ],
};

export const MY_LISTINGS: (Listing & { listingStatus: "Active" | "Sold" | "Draft" })[] = [
  {
    ...LISTINGS[0],
    id: "my1",
    title: "Nike Air Max 90 – Size 42",
    price: 45000,
    category: "Fashion",
    condition: "Used",
    seller: { id: "me", name: "Tunde Adebayo", score: 82, verified: true, phoneVerified: true, memberSince: "Jan 2024" },
    listingStatus: "Active",
  },
  {
    ...LISTINGS[4],
    id: "my2",
    title: "Canon EOS 250D Camera + 18-55mm Lens",
    price: 280000,
    category: "Electronics",
    condition: "Used",
    seller: { id: "me", name: "Tunde Adebayo", score: 82, verified: true, phoneVerified: true, memberSince: "Jan 2024" },
    listingStatus: "Active",
  },
  {
    ...LISTINGS[5],
    id: "my3",
    title: "2BR Apartment – Ikeja GRA",
    price: 450000,
    category: "Property",
    condition: "New",
    seller: { id: "me", name: "Tunde Adebayo", score: 82, verified: true, phoneVerified: true, memberSince: "Jan 2024" },
    listingStatus: "Sold",
  },
];

export const REVIEWS = [
  { id: "r1", from: "Chidi Okonkwo", score: 88, stars: 5, date: "Nov 2024", comment: "Excellent seller! The iPhone was exactly as described. Fast response and professional packaging." },
  { id: "r2", from: "Ada Nwachukwu", score: 75, stars: 4, date: "Oct 2024", comment: "Good product, minor delay in delivery but communicated well. Would buy again." },
  { id: "r3", from: "Emeka Dike", score: 92, stars: 5, date: "Sep 2024", comment: "Top notch! Delivered same day. The shoes were in perfect condition. 10/10 recommend." },
];

export const WALLET_TRANSACTIONS = [
  { id: "tx1", type: "credit", label: "Escrow release – Nike Air Max", amount: 45000, date: "Nov 28, 2024" },
  { id: "tx2", type: "debit", label: "Withdrawal to GTB", amount: 30000, date: "Nov 25, 2024" },
  { id: "tx3", type: "credit", label: "Escrow release – Canon Camera", amount: 280000, date: "Nov 20, 2024" },
  { id: "tx4", type: "credit", label: "Task payment – Excel Setup", amount: 20000, date: "Nov 15, 2024" },
  { id: "tx5", type: "debit", label: "Withdrawal to GTB", amount: 200000, date: "Nov 12, 2024" },
];
