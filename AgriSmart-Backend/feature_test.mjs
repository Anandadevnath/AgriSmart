// feature_test.mjs — exercise each proposal feature end-to-end against the live backend
const BASE = "http://localhost:8001";
const R = (label, ok, detail = "") =>
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${detail ? `  — ${detail}` : ""}`);

const j = (r) => r.json().catch(() => null);
const post = (p, b) => fetch(`${BASE}${p}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(b) });

const farmer = {
  name: "Feature Test Farmer",
  email: `ft${Date.now()}@test.com`,
  phone: "01712345678",
  password: "Pass12345",
  location: { division: "Rajshahi", district: "Natore", upazila: "Lalpur" },
};
const buyer = {
  name: "Feature Test Buyer",
  email: `fb${Date.now()}@test.com`,
  phone: "01812345678",
  password: "Pass12345",
  location: { division: "Dhaka", district: "Dhaka", upazila: "Uttara" },
};

async function register(p) {
  const r = await post("/user/register", p);
  return { json: await j(r), status: r.status };
}
async function login(p) {
  const r = await post("/user/login", { email: p.email, password: p.password });
  return await j(r);
}
const auth = (t) => ({ Authorization: `Bearer ${t}`, "Content-Type": "application/json" });

async function main() {
  // ===== FEATURE 1: Secure Registration & Login =====
  console.log("\n[1] Secure Registration & Login");
  let res = (await register(farmer)).json;
  const farmerId = res.data?._id;
  R("Farmer registers (bcrypt + JWT)", res.success === true && !!res.accessToken, `success=${res.success}`);
  const farmerToken = res.accessToken;
  res = (await register(buyer)).json;
  const buyerId = res.data?._id;
  const buyerToken = res.accessToken;
  res = await post("/user/login", { email: farmer.email, password: "WrongPass" }).then(j);
  R("Wrong password rejected", res.success === false && res.message, `status=${res.status}`);
  res = await fetch(`${BASE}/user/me`, { headers: auth(farmerToken) }).then(j);
  R("Authenticated /me works", res.success === true, `success=${res.success}`);

  // ===== FEATURE 2: Zero-Intermediary Marketplace (listings CRUD) =====
  console.log("\n[2] Direct Marketplace");
  res = await fetch(`${BASE}/listing`, { method: "POST", headers: auth(farmerToken), body: JSON.stringify({
    cropType: "Rice", title: "Premium Aman Rice", quantityKg: 500, pricePerKg: 38,
    location: { division: "Rajshahi", district: "Natore" }, description: "Fresh harvest",
  }) }).then(j);
  const listingId = res?.data?._id || res?.listing?._id || res?.data?.id;
  R("Farmer posts listing", res.success === true && !!listingId, `success=${res.success}`);
  res = await fetch(`${BASE}/listing`).then(j);
  const browseHasIt = (res.data || []).some((l) => l._id === listingId || l.id === listingId);
  R("Buyer browses all listings", res.success === true && browseHasIt, `count=${(res.data||[]).length}`);
  res = await fetch(`${BASE}/listing/mine/list`, { headers: auth(farmerToken) }).then(j);
  R("Farmer sees 'my listings'", res.success === true && (res.data || []).length >= 1, `count=${(res.data||[]).length}`);

  // ===== FEATURE 3: Direct Buyer-Farmer Chat (REST) =====
  console.log("\n[3] Direct Buyer-Farmer Chat");
  res = await fetch(`${BASE}/chat/conversations`, { method: "POST", headers: auth(buyerToken), body: JSON.stringify({ recipientId: farmerId, listingId }) }).then(j);
  const convoId = res?.data?._id || res?.data?.id || res?.conversation?._id;
  R("Buyer starts conversation with farmer", res.success === true && !!convoId, `success=${res.success}`);
  res = await fetch(`${BASE}/chat/conversations/${convoId}/messages`, { method: "POST", headers: auth(buyerToken), body: JSON.stringify({ text: "দাম কি আলোচনা করা যাবে?" }) }).then(j);
  R("Message sent in conversation", res.success === true, `success=${res.success}`);
  res = await fetch(`${BASE}/chat/conversations/${convoId}/messages`, { headers: auth(farmerToken) }).then(j);
  R("Farmer reads conversation messages", res.success === true && (res.data || []).length >= 1, `msgs=${(res.data||[]).length}`);
  res = await fetch(`${BASE}/chat/conversations`, { headers: auth(farmerToken) }).then(j);
  R("Farmer sees conversation list", res.success === true && (res.data || []).length >= 1, `convos=${(res.data||[]).length}`);

  // ===== FEATURE 4: Sales & Analytics Dashboard (data sources) =====
  console.log("\n[4] Sales Dashboard data sources");
  res = await fetch(`${BASE}/listing/mine/list`, { headers: auth(farmerToken) }).then(j);
  const my = res.data || [];
  R("Dashboard 'my listings' feed", my.length >= 1, `count=${my.length}`);
  res = await fetch(`${BASE}/listing/${listingId}`, { method: "PATCH", headers: auth(farmerToken), body: JSON.stringify({ status: "sold" }) }).then(j);
  R("Dashboard can mark listing sold", res.success === true, `success=${res.success}`);
  res = await fetch(`${BASE}/listing/mine/list`, { headers: auth(farmerToken) }).then(j);
  const hasSold = (res.data || []).some((l) => l.status === "sold");
  R("Dashboard shows sold revenue state", hasSold === true, `statuses=${(res.data||[]).map(l=>l.status).join(',')}`);

  // ===== FEATURE 5: Live Market Price & Weather =====
  console.log("\n[5] Live Market Price & Weather");
  res = await fetch(`${BASE}/market-price`).then(j);
  R("Market price feed returns data", res.success === true && (res.data || []).length > 0, `crops=${(res.data||[]).length}`);

  // ===== FEATURE 6: Emergency SMS / Smart Alerts (backend) =====
  console.log("\n[6] Emergency SMS / Smart Alerts");
  res = await fetch(`${BASE}/api/smart-alert`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ cropType: "Potato", storageType: "Warehouse", riskLevel: "Critical", temperature: 36, humidity: 85, rainProb: 90, etcl: 12 }) }).then(j);
  R("Smart alert (Critical) returns Bangla alert", res.ok === true && !!res.data?.alertMessage, `ok=${res.ok} risk=${res.data?.riskLevel}`);
  R("Alert flags emergency SMS", res.data?.shouldSimulateSMS === true, `simSMS=${res.data?.shouldSimulateSMS}`);

  // ===== FEATURE 7: AI Crop Disease & Pest Detection (live endpoints) =====
  console.log("\n[7] AI Crop Disease Detection (GET alive check — full POST verified earlier with real images)");
  res = await fetch(`${BASE}/api/predict`).then(j);
  R("AI predict endpoint alive", res.ok === true, `message=${res.message}`);

  // ===== FEATURE 8: Reference data (bilingual options) =====
  console.log("\n[8] Bilingual reference data");
  res = await fetch(`${BASE}/data/options`).then(j);
  R("Crop/storage/division options endpoint", res.success === true && !!res.data?.cropTypes, `crops=${res.data?.cropTypes?.length}`);

  console.log("\nDone.");
}

main().catch((e) => { console.error("SCRIPT ERROR:", e); process.exit(1); });
