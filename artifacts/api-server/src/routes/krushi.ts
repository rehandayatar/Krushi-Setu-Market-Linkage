import { Router, type IRouter } from "express";
import {
  AcceptBuyerOfferParams,
  AcceptBuyerOfferResponse,
  CreateBuyerOfferBody,
  CreateBuyerOfferParams,
  CreateBuyerOfferResponse,
  CreateDiagnosisBody,
  CreateDiagnosisResponse,
  CreateGroupSaleBody,
  CreateGroupSaleResponse,
  CreateSahayakAppointmentBody,
  CreateSahayakAppointmentResponse,
  CreateTransactionBody,
  CreateTransactionResponse,
  GetAdminAnalyticsResponse,
  GetBuyerParams,
  GetBuyerResponse,
  GetCropRecommendationsQueryParams,
  GetCropRecommendationsResponse,
  GetMarketPricesByCropParams,
  GetMarketPricesByCropResponse,
  ListSahayaksResponse,
  GetSoilReportResponse,
  GetTransactionParams,
  GetTransactionResponse,
  GetWeatherResponse,
  JoinGroupSaleBody,
  JoinGroupSaleParams,
  JoinGroupSaleResponse,
  ListAdminBuyersResponse,
  ListAdminFarmersResponse,
  ListAdminReportsResponse,
  ListAdminTransactionsResponse,
  ListBuyersQueryParams,
  ListBuyersResponse,
  ListGroupSalesResponse,
  ListMandisResponse,
  ListMarketPricesQueryParams,
  ListMarketPricesResponse,
  ListTransactionsResponse,
  LoginBody,
  LoginResponse,
  RateBuyerBody,
  RateBuyerParams,
  RateBuyerResponse,
  ReportBuyerBody,
  ReportBuyerParams,
  ReportBuyerResponse,
  UpdateBuyerStatusBody,
  UpdateBuyerStatusParams,
  UpdateBuyerStatusResponse,
  UploadSoilReportBody,
  UploadSoilReportResponse,
} from "@workspace/api-zod";
import {
  buyers,
  crops,
  demoUsers,
  farmers,
  groupSales,
  makeId,
  mandiSeed,
  mandis,
  marketPrices,
  reports,
  sahayaks,
  soilReport,
  transactions,
} from "../lib/krushi-data";

const router: IRouter = Router();

const idParam = (value: string | string[]) => (Array.isArray(value) ? value[0] : value);

router.post("/auth/login", (req, res): void => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const user = demoUsers.find((candidate) => candidate.email === parsed.data.email && candidate.password === parsed.data.password);
  if (!user) {
    res.status(401).json({ error: "That demo email or password is not correct." });
    return;
  }
  res.json(LoginResponse.parse({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    location: user.location,
    primaryCrop: user.primaryCrop,
  }));
});

router.get("/market-prices", (req, res): void => {
  const parsed = ListMarketPricesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const query = parsed.data;
  const result = marketPrices.filter((item) =>
    (!query.crop || item.crop.toLowerCase() === query.crop.toLowerCase()) &&
    (!query.state || item.state.toLowerCase() === query.state.toLowerCase()) &&
    (!query.district || item.district.toLowerCase() === query.district.toLowerCase()) &&
    (!query.mandi || item.mandi.toLowerCase() === query.mandi.toLowerCase()) &&
    (!query.variety || item.variety.toLowerCase() === query.variety.toLowerCase()) &&
    (!query.grade || item.grade.toLowerCase() === query.grade.toLowerCase()) &&
    (!query.search || `${item.mandi} ${item.crop} ${item.district}`.toLowerCase().includes(query.search.toLowerCase())),
  );
  res.json(ListMarketPricesResponse.parse(result));
});

router.get("/market-prices/:crop", (req, res): void => {
  const parsed = GetMarketPricesByCropParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const crop = parsed.data.crop;
  const rows = marketPrices.filter((item) => item.crop.toLowerCase() === crop.toLowerCase());
  const currentPrice = rows[0]?.modalPrice ?? 2850;
  const labels = ["22 Sep", "23 Sep", "24 Sep", "25 Sep", "26 Sep", "27 Sep", "28 Sep"];
  const history7 = labels.map((label, index) => ({ label, price: currentPrice - 190 + index * 32 + (index % 2 ? 8 : 0) }));
  const history30 = Array.from({ length: 10 }, (_, index) => ({ label: `Week ${index + 1}`, price: currentPrice - 340 + index * 40 }));
  const history90 = Array.from({ length: 12 }, (_, index) => ({ label: `W${index + 1}`, price: currentPrice - 520 + index * 62 }));
  res.json(GetMarketPricesByCropResponse.parse({
    crop: rows[0]?.crop ?? crop,
    currentPrice,
    localTraderOffer: 2300,
    indicativeLow: 2700,
    indicativeHigh: 3050,
    history7,
    history30,
    history90,
    isPrototype: true,
  }));
});

router.get("/mandis", (_req, res): void => {
  res.json(ListMandisResponse.parse(mandis));
});

router.get("/buyers", (req, res): void => {
  const parsed = ListBuyersQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const query = parsed.data;
  const result = buyers.filter((buyer) =>
    (!query.crop || buyer.crop.toLowerCase() === query.crop.toLowerCase()) &&
    (query.maxDistance === undefined || buyer.distanceKm <= query.maxDistance) &&
    (query.minQuantity === undefined || buyer.requiredQuantity >= query.minQuantity) &&
    (query.minPrice === undefined || buyer.offerPrice >= query.minPrice) &&
    (!query.verifiedOnly || buyer.verificationStatus === "verified"),
  );
  res.json(ListBuyersResponse.parse(result));
});

router.get("/buyers/:id", (req, res): void => {
  const parsed = GetBuyerParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const buyer = buyers.find((candidate) => candidate.id === parsed.data.id);
  if (!buyer) {
    res.status(404).json({ error: "Buyer not found" });
    return;
  }
  res.json(GetBuyerResponse.parse(buyer));
});

router.post("/buyers/:id/report", (req, res): void => {
  const params = ReportBuyerParams.safeParse(req.params);
  const body = ReportBuyerBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Please provide a report reason and description." });
    return;
  }
  const buyer = buyers.find((candidate) => candidate.id === params.data.id);
  if (!buyer) {
    res.status(404).json({ error: "Buyer not found" });
    return;
  }
  const report = {
    id: makeId("report"),
    buyerId: buyer.id,
    buyerName: buyer.businessName,
    reason: body.data.reason,
    description: body.data.description,
    evidence: body.data.evidence ?? "",
    reviewStatus: "open",
    createdAt: new Date().toISOString(),
  };
  reports.unshift(report);
  res.status(201).json(ReportBuyerResponse.parse(report));
});

router.post("/buyers/:id/rating", (req, res): void => {
  const params = RateBuyerParams.safeParse(req.params);
  const body = RateBuyerBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Please provide all four rating factors." });
    return;
  }
  const rating = { id: makeId("rating"), buyerId: params.data.id, ...body.data };
  res.status(201).json(RateBuyerResponse.parse(rating));
});

router.get("/group-sales", (_req, res): void => {
  res.json(ListGroupSalesResponse.parse(groupSales));
});

router.post("/group-sales", (req, res): void => {
  const body = CreateGroupSaleBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const group = {
    id: makeId("group"),
    code: `KS${String(1024 + groupSales.length).padStart(4, "0")}`,
    crop: body.data.crop,
    location: body.data.location,
    farmerCount: 1,
    pooledQuantity: body.data.quantity,
    targetQuantity: body.data.targetQuantity,
    individualQuantity: body.data.quantity,
    localOffer: 2300,
    bestOffer: 0,
    status: "open",
    createdAt: new Date().toISOString(),
    offers: [],
  };
  groupSales.unshift(group);
  res.status(201).json(CreateGroupSaleResponse.parse(group));
});

router.post("/group-sales/:id/join", (req, res): void => {
  const params = JoinGroupSaleParams.safeParse(req.params);
  const body = JoinGroupSaleBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Quantity must be greater than zero." });
    return;
  }
  const group = groupSales.find((candidate) => candidate.id === params.data.id);
  if (!group) {
    res.status(404).json({ error: "Group sale not found" });
    return;
  }
  group.pooledQuantity += body.data.quantity;
  group.farmerCount += 1;
  res.json(JoinGroupSaleResponse.parse(group));
});

router.post("/group-sales/:id/offers", (req, res): void => {
  const params = CreateBuyerOfferParams.safeParse(req.params);
  const body = CreateBuyerOfferBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Offer price and quantity are required." });
    return;
  }
  const group = groupSales.find((candidate) => candidate.id === params.data.id);
  if (!group) {
    res.status(404).json({ error: "Group sale not found" });
    return;
  }
  const offer = { id: makeId("offer"), ...body.data, status: "submitted", createdAt: new Date().toISOString() };
  group.offers.push(offer);
  group.bestOffer = Math.max(group.bestOffer, offer.price);
  group.status = "offer_received";
  res.status(201).json(CreateBuyerOfferResponse.parse(offer));
});

router.post("/group-sales/:id/offers/:offerId/accept", (req, res): void => {
  const params = AcceptBuyerOfferParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid group sale or offer." });
    return;
  }
  const group = groupSales.find((candidate) => candidate.id === params.data.id);
  const offer = group?.offers.find((candidate: any) => candidate.id === params.data.offerId);
  if (!group || !offer) {
    res.status(404).json({ error: "Offer not found" });
    return;
  }
  group.offers.forEach((candidate: any) => { candidate.status = candidate.id === offer.id ? "selected" : "declined"; });
  group.status = "completed";
  const previous = transactions[0]?.currentHash ?? "GENESIS-KRUSHI-SETU";
  const transaction = {
    id: `TX-KS-${new Date().getTime()}`,
    farmerId: "farmer_ramesh",
    farmerName: "Ramesh Patil",
    buyerId: offer.buyerId,
    buyerName: offer.buyerName,
    groupSaleId: group.id,
    crop: group.crop,
    quantity: Math.min(group.pooledQuantity, offer.quantity),
    agreedPrice: offer.price,
    totalValue: Math.min(group.pooledQuantity, offer.quantity) * offer.price,
    date: new Date().toISOString(),
    mandi: "Lasalgaon",
    paymentStatus: "simulated_paid",
    previousHash: previous,
    currentHash: `hash-${Date.now()}-${offer.id}`,
    integrityStatus: "verified",
    ledgerLabel: "Blockchain-inspired / append-only transaction ledger",
  };
  transactions.unshift(transaction);
  res.status(201).json(AcceptBuyerOfferResponse.parse(transaction));
});

router.get("/transactions", (_req, res): void => {
  res.json(ListTransactionsResponse.parse(transactions));
});

router.post("/transactions", (req, res): void => {
  const body = CreateTransactionBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const previous = transactions[0]?.currentHash ?? "GENESIS-KRUSHI-SETU";
  const transaction = {
    id: `TX-KS-${new Date().getTime()}`,
    ...body.data,
    groupSaleId: body.data.groupSaleId ?? null,
    totalValue: body.data.quantity * body.data.agreedPrice,
    date: new Date().toISOString(),
    paymentStatus: "simulated_paid",
    previousHash: previous,
    currentHash: `hash-${Date.now()}`,
    integrityStatus: "verified",
    ledgerLabel: "Blockchain-inspired / append-only transaction ledger",
  };
  transactions.unshift(transaction);
  res.status(201).json(CreateTransactionResponse.parse(transaction));
});

router.get("/transactions/:id", (req, res): void => {
  const params = GetTransactionParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const transaction = transactions.find((candidate) => candidate.id === params.data.id);
  if (!transaction) {
    res.status(404).json({ error: "Transaction not found" });
    return;
  }
  res.json(GetTransactionResponse.parse(transaction));
});

router.get("/soil", (_req, res): void => {
  res.json(GetSoilReportResponse.parse(soilReport));
});

router.post("/soil", (req, res): void => {
  const body = UploadSoilReportBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  Object.assign(soilReport, body.data, { id: soilReport.id, overallScore: 78 });
  res.status(201).json(UploadSoilReportResponse.parse(soilReport));
});

router.get("/crops/recommendations", (req, res): void => {
  const parsed = GetCropRecommendationsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const recommendations = [
    { crop: "Onion", suitability: "High", demand: "High", priceTrend: "Rising", estimatedCost: 55000, expectedYield: 80, estimatedMargin: 40000, waterRequirement: "Moderate", risk: "Moderate", why: ["Niphad soil profile is suitable", "Local onion demand is high", "Recent modal price trend is rising"], isPrototype: true },
    { crop: "Grapes", suitability: "Medium", demand: "High", priceTrend: "Stable", estimatedCost: 82000, expectedYield: 48, estimatedMargin: 52000, waterRequirement: "High", risk: "High", why: ["Strong export demand", "Requires reliable irrigation", "Higher crop-care cost"], isPrototype: true },
    { crop: "Soybean", suitability: "High", demand: "Medium", priceTrend: "Stable", estimatedCost: 28000, expectedYield: 32, estimatedMargin: 21000, waterRequirement: "Low", risk: "Low", why: ["Lower water requirement", "Fits rotation planning", "Steady local demand"], isPrototype: true },
  ];
  res.json(GetCropRecommendationsResponse.parse(recommendations));
});

router.get("/weather", (_req, res): void => {
  res.json(GetWeatherResponse.parse({
    location: "Niphad, Nashik",
    currentTemperature: 29,
    rainProbability: 68,
    humidity: 74,
    wind: 18,
    forecast: [
      { day: "Today", temperature: 29, rainProbability: 68, humidity: 74, wind: 18 },
      { day: "Tue", temperature: 28, rainProbability: 72, humidity: 77, wind: 14 },
      { day: "Wed", temperature: 30, rainProbability: 44, humidity: 68, wind: 19 },
      { day: "Thu", temperature: 31, rainProbability: 25, humidity: 61, wind: 21 },
      { day: "Fri", temperature: 30, rainProbability: 36, humidity: 64, wind: 17 },
      { day: "Sat", temperature: 29, rainProbability: 58, humidity: 71, wind: 15 },
      { day: "Sun", temperature: 28, rainProbability: 62, humidity: 76, wind: 13 },
    ],
    risks: [
      { label: "Rain Risk", level: "high", value: 68 },
      { label: "Heat Risk", level: "low", value: 29 },
      { label: "Disease Risk", level: "moderate", value: 56 },
      { label: "Harvest Risk", level: "moderate", value: 48 },
    ],
    alert: "Heavy rainfall expected. Consider protecting harvested produce.",
    isPrototype: true,
  }));
});

router.post("/diagnosis", (req, res): void => {
  const body = CreateDiagnosisBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  res.status(201).json(CreateDiagnosisResponse.parse({
    id: makeId("diagnosis"),
    fileName: body.data.fileName,
    crop: body.data.crop,
    issue: "Onion Purple Blotch",
    confidence: 89,
    severity: "Moderate",
    recommendedActions: ["Monitor crop", "Follow locally approved agricultural guidance", "Consult an expert if necessary"],
    isPrototype: true,
  }));
});

router.get("/sahayaks", (_req, res): void => {
  res.json(ListSahayaksResponse.parse(sahayaks));
});

router.post("/sahayak/appointments", (req, res): void => {
  const body = CreateSahayakAppointmentBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  res.status(201).json(CreateSahayakAppointmentResponse.parse({
    id: makeId("appointment"),
    ...body.data,
    status: "Booked",
  }));
});

router.get("/admin/analytics", (_req, res): void => {
  res.json(GetAdminAnalyticsResponse.parse({
    farmersOnboarded: farmers.length,
    activeFarmers: farmers.filter((farmer) => farmer.status === "Active").length,
    priceDiscoveryUsers: 842,
    groupSellingVolume: groupSales.reduce((sum, group) => sum + group.pooledQuantity, 0),
    transactions: transactions.length,
    averageTransactionValue: Math.round(transactions.reduce((sum, transaction) => sum + transaction.totalValue, 0) / transactions.length),
    verifiedBuyers: buyers.filter((buyer) => buyer.verificationStatus === "verified").length,
    buyerReports: reports.length,
    sahayakSessions: 126,
    marketCoverage: 78,
    districtActivity: ["Nashik", "Pune", "Ahmednagar", "Kolhapur", "Nagpur", "Solapur", "Sangli"].map((label, index) => ({ label, value: 62 + index * 11 })),
    cropDemand: crops.slice(0, 6).map(([crop], index) => ({ label: crop, value: 78 - index * 7 })),
    adoptionTrend: ["Apr", "May", "Jun", "Jul", "Aug", "Sep"].map((label, index) => ({ label, value: 180 + index * 120 })),
    isPrototype: true,
  }));
});

router.get("/admin/farmers", (_req, res): void => {
  res.json(ListAdminFarmersResponse.parse(farmers));
});

router.get("/admin/buyers", (_req, res): void => {
  res.json(ListAdminBuyersResponse.parse(buyers));
});

router.patch("/admin/buyers/:id/status", (req, res): void => {
  const params = UpdateBuyerStatusParams.safeParse(req.params);
  const body = UpdateBuyerStatusBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Invalid buyer status." });
    return;
  }
  const buyer = buyers.find((candidate) => candidate.id === params.data.id);
  if (!buyer) {
    res.status(404).json({ error: "Buyer not found" });
    return;
  }
  buyer.verificationStatus = body.data.status;
  buyer.trustStatus = body.data.status === "under_review" ? "under_review" : buyer.trustStatus;
  res.json(UpdateBuyerStatusResponse.parse(buyer));
});

router.get("/admin/transactions", (_req, res): void => {
  res.json(ListAdminTransactionsResponse.parse(transactions));
});

router.get("/admin/reports", (_req, res): void => {
  res.json(ListAdminReportsResponse.parse(reports));
});

export default router;