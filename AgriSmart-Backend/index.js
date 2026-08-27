// index.js — AgriSmart BD backend (Express + MongoDB + Socket.IO)
import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import connectDB from "./database/db.js";
import userRoute from "./routes/userRoute.js";
import listingRoute from "./routes/listingRoute.js";
import chatRoute from "./routes/chatRoute.js";
import marketPriceRoute from "./routes/marketPriceRoute.js";
import adminRoute from "./routes/adminRoute.js";
import pestRoute from "./routes/pestServer.js";
import { initSocket } from "./socket.js";
import { Buffer } from "buffer";

const app = express();
const PORT = process.env.PORT || 3000;

// -------------------- MIDDLEWARE --------------------

// JSON parsing, allow up to 10MB for image uploads (crop photos / disease scans)
app.use(express.json({ limit: "10mb" }));

// CORS: allow any origin with credentials (open for the demo).
app.use(cors({
  origin: (origin, callback) => callback(null, true),
  credentials: true,
}));

// -------------------- DATABASE --------------------
connectDB();

// -------------------- ROUTES --------------------
app.use("/user", userRoute);          // auth & profile
app.use("/listing", listingRoute);    // direct marketplace listings
app.use("/chat", chatRoute);          // buyer <-> farmer chat (REST + socket)
app.use("/market-price", marketPriceRoute); // live market price feed
app.use("/panel", adminRoute);        // admin panel
app.use("/", pestRoute);              // pest/disease identification helper

// -------------------- CROP DISEASE SCANNER (AI) --------------------

const HF_API_TOKEN = process.env.HF_API_TOKEN;
// Note: previous model "wambugu71/crop_leaf_diseases_vit" was deprecated and no
// longer served by hf-inference. This one (PlantVillage-based) is actively served.
const HF_MODEL_ID = "linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification";

if (!HF_API_TOKEN) {
  console.warn("Warning: HF_API_TOKEN is not set in .env");
}

// Simple GET to test API
app.get("/api/predict", (req, res) => {
  res.json({ ok: true, message: "GET /api/predict is alive" });
});

// POST for crop-leaf disease classification (image -> disease label)
app.post("/api/predict", async (req, res) => {
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: "imageBase64 is required" });
    }

    const base64Data = imageBase64.split(",")[1] || imageBase64;
    const imgBuffer = Buffer.from(base64Data, "base64");

    // Sniff the MIME type from a data-URL prefix (data:image/png;base64,...),
    // fall back to image/jpeg for raw base64 input.
    const dataUrlPrefix = imageBase64.split(",")[0];
    const mimeType = /^data:([a-zA-Z0-9.+\-]+\/[a-zA-Z0-9.+\-]+);/.test(dataUrlPrefix)
      ? dataUrlPrefix.match(/^data:([a-zA-Z0-9.+\-]+\/[a-zA-Z0-9.+\-]+);/)[1]
      : "image/jpeg";

    const hfRes = await fetch(
      `https://router.huggingface.co/hf-inference/models/${HF_MODEL_ID}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_API_TOKEN}`,
          "Content-Type": mimeType,
        },
        body: imgBuffer,
      }
    );

    if (!hfRes.ok) {
      const text = await hfRes.text();
      console.error("HF error:", hfRes.status, text);
      return res.status(hfRes.status).json({ error: "HF error", detail: text });
    }

    const result = await hfRes.json();
    return res.json(result);
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// -------------------- ROOT --------------------
app.get("/", (req, res) => {
  res.send(`
    <html>
      <body>
        <h1>AgriSmart BD — Backend API</h1>
        <ul>
          <li>User / Auth: <a href="/user">/user</a></li>
          <li>Marketplace listings: <a href="/listing">/listing</a></li>
          <li>Chat: <code>/chat/conversations</code> (auth) + Socket.IO</li>
          <li>Market prices: <a href="/market-price">/market-price</a></li>
          <li>Admin panel: <a href="/panel">/panel</a></li>
          <li>Disease scan: <a href="/api/predict">/api/predict</a></li>
        </ul>
      </body>
    </html>
  `);
});

// -------------------- START SERVER (with Socket.IO) --------------------
const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
  console.log(`AgriSmart BD server running on http://localhost:${PORT}`);
});

export default app;
