export type DemoUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "farmer" | "buyer" | "sahayak" | "admin";
  location: string;
  primaryCrop: string;
};

export const demoUsers: DemoUser[] = [
  {
    id: "usr_farmer_ramesh",
    name: "Ramesh Patil",
    email: "farmer@krushisetu.demo",
    password: "password123",
    role: "farmer",
    location: "Niphad, Nashik, Maharashtra",
    primaryCrop: "Onion",
  },
  {
    id: "usr_buyer_demo",
    name: "Maharashtra Agro Foods",
    email: "buyer@krushisetu.demo",
    password: "password123",
    role: "buyer",
    location: "Nashik, Maharashtra",
    primaryCrop: "Onion",
  },
  {
    id: "usr_admin_demo",
    name: "Maharashtra Market Cell",
    email: "admin@krushisetu.demo",
    password: "password123",
    role: "admin",
    location: "Mumbai, Maharashtra",
    primaryCrop: "All crops",
  },
  {
    id: "usr_sahayak_demo",
    name: "Sunita Patil",
    email: "sahayak@krushisetu.demo",
    password: "password123",
    role: "sahayak",
    location: "Nashik, Maharashtra",
    primaryCrop: "Onion",
  },
];

export const mandiSeed = [
  ["Lasalgaon", "Nashik", 42, 20.07, 74.24],
  ["Pimpalgaon", "Nashik", 36, 20.17, 73.99],
  ["Niphad", "Nashik", 8, 20.08, 74.11],
  ["Yeola", "Nashik", 54, 20.04, 74.49],
  ["Manmad", "Nashik", 64, 20.25, 74.44],
  ["Sangamner", "Ahmednagar", 88, 19.57, 74.21],
  ["Pune", "Pune", 182, 18.52, 73.86],
  ["Solapur", "Solapur", 254, 17.66, 75.91],
  ["Sangli", "Sangli", 276, 16.85, 74.58],
  ["Kolhapur", "Kolhapur", 302, 16.70, 74.24],
] as const;

export const crops = [
  ["Onion", 2400, 3150, 2850],
  ["Tomato", 1800, 2650, 2280],
  ["Soybean", 4200, 5050, 4680],
  ["Wheat", 2250, 2720, 2480],
  ["Grapes", 5200, 7600, 6400],
  ["Pomegranate", 7800, 11200, 9400],
  ["Maize", 1950, 2400, 2180],
  ["Cotton", 6400, 7350, 6880],
  ["Bajra", 2300, 2900, 2600],
  ["Chickpea", 5200, 6400, 5800],
] as const;

export const mandis = mandiSeed.map(([name, district, distanceKm, latitude, longitude], index) => ({
  id: `mandi_${index + 1}`,
  name,
  district,
  state: "Maharashtra",
  distanceKm,
  latitude,
  longitude,
}));

export const marketPrices: any[] = mandis.flatMap((mandi, mandiIndex) =>
  crops.map(([crop, min, max, modal], cropIndex) => {
    const adjustment = crop === "Onion" ? [0, 70, -70, -20, 40, -110, -180, -220, -250, -300][mandiIndex] : (mandiIndex % 3) * 40;
    const nextModal = modal + adjustment;
    return {
      id: `price_${mandiIndex + 1}_${cropIndex + 1}`,
      crop,
      mandi: mandi.name,
      district: mandi.district,
      state: mandi.state,
      variety: crop === "Onion" ? "N-53" : "Local standard",
      grade: crop === "Onion" ? "A" : "FAQ",
      minPrice: Math.max(800, min + adjustment),
      maxPrice: Math.max(1000, max + adjustment),
      modalPrice: nextModal,
      arrivalQuantity: crop === "Onion" ? 1240 - mandiIndex * 37 : 420 + cropIndex * 22,
      distanceKm: mandi.distanceKm,
      source: "Market Data",
      observedAt: "2026-09-28T08:30:00.000Z",
      trendPercent: crop === "Onion" ? 8.4 : cropIndex % 2 === 0 ? 3.1 : -1.8,
      isPrototype: true,
    };
  }),
);

export const buyers: any[] = [
  ["Maharashtra Agro Foods", "Nashik", 100, 2820, 248, 4.6, "2 hrs", "trusted"],
  ["Nashik Fresh Exports", "Nashik", 220, 2925, 187, 4.8, "4 hrs", "trusted"],
  ["Sahyadri Farmer Connect", "Pune", 180, 2890, 325, 4.5, "6 hrs", "trusted"],
  ["Deccan Produce Co.", "Ahmednagar", 150, 2785, 142, 4.2, "1 day", "review"],
  ["Godavari Foods", "Niphad", 80, 2860, 94, 4.4, "3 hrs", "trusted"],
  ["Maharashtra Retail Link", "Mumbai", 500, 3010, 410, 4.7, "1 day", "trusted"],
  ["Western India Commodities", "Sangli", 300, 2740, 278, 4.1, "2 days", "review"],
  ["KisanKart Wholesale", "Pune", 250, 2960, 201, 4.6, "5 hrs", "trusted"],
  ["Pragati Onion Traders", "Lasalgaon", 125, 2790, 167, 4.3, "4 hrs", "trusted"],
  ["Sahyadri Organics", "Kolhapur", 90, 2875, 76, 4.9, "3 hrs", "trusted"],
  ["FarmGate Maharashtra", "Nashik", 180, 2935, 115, 4.4, "8 hrs", "trusted"],
  ["Aapli Bhaji Network", "Aurangabad", 160, 2810, 98, 4.0, "1 day", "review"],
  ["Green Basket B2B", "Mumbai", 400, 2995, 360, 4.7, "6 hrs", "trusted"],
  ["Vidarbha Foods", "Nagpur", 260, 2760, 188, 4.2, "1 day", "trusted"],
  ["Mandi Direct Partners", "Pune", 210, 2850, 132, 4.5, "5 hrs", "trusted"],
  ["Shivneri Agri Trade", "Nashik", 100, 2800, 88, 4.1, "2 hrs", "trusted"],
  ["Shetkari Bazaar", "Solapur", 240, 2730, 164, 4.0, "1 day", "review"],
  ["FreshRoute Retail", "Pune", 300, 2910, 229, 4.6, "7 hrs", "trusted"],
  ["Jai Maharashtra Foods", "Nashik", 140, 2840, 154, 4.3, "4 hrs", "trusted"],
  ["HarvestBridge Exports", "Mumbai", 600, 3040, 520, 4.8, "1 day", "trusted"],
].map(([businessName, location, requiredQuantity, offerPrice, completedTransactions, trustScore, responseTime, trustStatus], index) => ({
  ...(() => {
    const score = Number(trustScore);
    return {
  id: `buyer_${index + 1}`,
  businessName,
  location,
  crop: "Onion",
  requiredQuantity: Number(requiredQuantity),
  offerPrice: Number(offerPrice),
  verificationStatus: index === 11 ? "under_review" : "verified",
  trustStatus,
  completedTransactions: Number(completedTransactions),
  trustScore: score,
  responseTime,
  distanceKm: 15 + index * 11,
  paymentReliability: Math.min(5, score + 0.1),
  priceFairness: Math.max(3.8, score - 0.1),
  communication: Math.min(5, score + 0.2),
  transactionCompletion: Math.min(5, score + 0.1),
    };
  })(),
}));

export const farmers: any[] = Array.from({ length: 30 }, (_, index) => ({
  id: index === 0 ? "farmer_ramesh" : `farmer_${index + 1}`,
  name: index === 0 ? "Ramesh Patil" : `Demo Farmer ${index + 1}`,
  village: index === 0 ? "Niphad" : ["Pimpalgaon", "Yeola", "Manmad", "Sinnar", "Dindori"][index % 5],
  district: ["Nashik", "Pune", "Ahmednagar", "Sangli", "Solapur"][index % 5],
  farmSize: index === 0 ? 2.5 : Number((1.5 + (index % 7) * 0.5).toFixed(1)),
  primaryCrop: crops[index % crops.length][0],
  status: index % 8 === 0 ? "Needs assistance" : "Active",
  onboardedAt: "2026-07-12T10:00:00.000Z",
}));

export const groupSales: any[] = [
  {
    id: "group_ks1024",
    code: "KS1024",
    crop: "Onion",
    location: "Nashik",
    farmerCount: 37,
    pooledQuantity: 184,
    targetQuantity: 250,
    individualQuantity: 5,
    localOffer: 2700,
    bestOffer: 2950,
    status: "offer_received",
    createdAt: "2026-09-22T10:00:00.000Z",
    offers: [
      { id: "offer_a", buyerId: buyers[0].id, buyerName: buyers[0].businessName, price: 2850, quantity: 100, status: "submitted", createdAt: "2026-09-25T09:00:00.000Z" },
      { id: "offer_b", buyerId: buyers[1].id, buyerName: buyers[1].businessName, price: 2920, quantity: 150, status: "submitted", createdAt: "2026-09-26T10:00:00.000Z" },
      { id: "offer_c", buyerId: buyers[5].id, buyerName: buyers[5].businessName, price: 2950, quantity: 200, status: "submitted", createdAt: "2026-09-27T11:00:00.000Z" },
    ],
  },
  ...Array.from({ length: 9 }, (_, index) => ({
    id: `group_${1025 + index}`,
    code: `KS${1025 + index}`,
    crop: crops[(index + 1) % crops.length][0],
    location: ["Pune", "Sangli", "Ahmednagar"][index % 3],
    farmerCount: 12 + index * 2,
    pooledQuantity: 72 + index * 8,
    targetQuantity: 140 + index * 10,
    individualQuantity: 4,
    localOffer: 2100 + index * 50,
    bestOffer: 2350 + index * 65,
    status: "open",
    createdAt: "2026-09-20T10:00:00.000Z",
    offers: [],
  })),
];

const seedTransaction = (index: number): any => {
  const quantity = 40 + (index % 6) * 10;
  const price = 2680 + (index % 8) * 35;
  return {
    id: `TX-KS-${String(20260901 + index).slice(-8)}`,
    farmerId: farmers[(index + 1) % farmers.length].id,
    farmerName: farmers[(index + 1) % farmers.length].name,
    buyerId: buyers[index % buyers.length].id,
    buyerName: buyers[index % buyers.length].businessName,
    groupSaleId: index % 3 === 0 ? groupSales[index % groupSales.length].id : null,
    crop: crops[index % crops.length][0],
    quantity,
    agreedPrice: price,
    totalValue: quantity * price,
    date: "2026-09-20T10:00:00.000Z",
    mandi: mandis[index % mandis.length].name,
    paymentStatus: index % 4 === 0 ? "simulated_paid" : "completed",
    previousHash: index === 0 ? "GENESIS-KRUSHI-SETU" : `hash-${index - 1}`,
    currentHash: `hash-${index}`,
    integrityStatus: "verified",
    ledgerLabel: "Blockchain-inspired / append-only transaction ledger",
  };
};

export const transactions: any[] = Array.from({ length: 50 }, (_, index) => seedTransaction(index));

export const reports: any[] = [
  {
    id: "report_001",
    buyerId: buyers[11].id,
    buyerName: buyers[11].businessName,
    reason: "Payment delay",
    description: "Prototype report awaiting admin review.",
    evidence: "Demo evidence attached",
    reviewStatus: "open",
    createdAt: "2026-09-26T12:00:00.000Z",
  },
];

export const soilReport: any = {
  id: "soil_ramesh",
  overallScore: 78,
  nitrogen: 72,
  phosphorus: 81,
  potassium: 76,
  ph: 7.1,
  organicMatter: 69,
  historicalScores: [{ year: "2025", score: 65 }, { year: "2026", score: 78 }],
  suggestions: ["Add compost after harvest", "Rotate with a legume crop", "Retest pH before the next season"],
  fileName: "ramesh-soil-report.pdf",
};

export const sahayaks: any[] = [
  { id: "sahayak_sunita", name: "Sunita Patil", location: "Nashik", languages: ["Marathi", "Hindi"], available: "Tomorrow", usedSessions: 3, totalSessions: 5, rating: 4.9 },
  { id: "sahayak_mahesh", name: "Mahesh Jadhav", location: "Pune", languages: ["Marathi", "Hindi", "English"], available: "Today", usedSessions: 2, totalSessions: 5, rating: 4.7 },
  { id: "sahayak_kavita", name: "Kavita Shinde", location: "Ahmednagar", languages: ["Marathi"], available: "Friday", usedSessions: 1, totalSessions: 5, rating: 4.8 },
];

export let nextId = 100;

export const makeId = (prefix: string) => `${prefix}_${nextId++}`;