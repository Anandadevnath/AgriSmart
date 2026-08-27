import express from 'express';
import { BASE_PRICES } from '../data/marketPrices.js';

const router = express.Router();

// ---------- Deterministic market-price model ----------
//
// No external price API (they need keys, quotas and aren't reliable for the
// demo). Instead we model a live market: a slow-moving *hourly* trend per crop
// plus a fast *5-minute* jitter. Both are seeded by (time-bucket + crop) so the
// feed is stable within each bucket but visibly ticks on every refresh/poll.

/** FNV-1a 32-bit hash → stable pseudo-random number from a string seed. */
function seededHash(seedStr) {
  let h = 2166136261;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Hourly drift per crop: roughly -6% .. +6% (the displayed Change %). */
function hourFactor(cropType) {
  const hour = Math.floor(Date.now() / (1000 * 60 * 60));
  const h = seededHash(`${hour}:${cropType}`);
  return ((h % 1201) / 100) - 6;
}

/** 5-minute jitter per crop: -1.5% .. +1.5%, so prices tick while the page is open. */
function minuteJitter(cropType) {
  const bucket = Math.floor(Date.now() / (1000 * 60 * 5));
  const h = seededHash(`${bucket}:${cropType}`);
  return ((h % 301) / 100) - 1.5;
}

function buildFeed(filterCrop) {
  return BASE_PRICES
    .filter((p) => !filterCrop || p.cropType.toLowerCase() === filterCrop.toLowerCase())
    .map((p) => {
      const changePct = Number(hourFactor(p.cropType).toFixed(1));
      const jitter = minuteJitter(p.cropType);
      const price = Math.max(1, Math.round(p.base * (1 + changePct / 100) * (1 + jitter / 100)));
      return {
        cropType: p.cropType,
        bn: p.bn,
        unit: p.unit,
        pricePerKg: price,
        currency: 'BDT',
        changePct,
        trend: changePct > 0.5 ? 'up' : changePct < -0.5 ? 'down' : 'stable',
        source: 'model',
      };
    });
}

// GET /market-price  (optional ?crop=Rice)
router.get('/', (req, res) => {
  try {
    const feed = buildFeed(req.query.crop);
    return res.json({ success: true, updatedAt: new Date(), data: feed });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
