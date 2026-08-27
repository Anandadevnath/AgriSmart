import express from 'express';
import { BASE_PRICES } from '../data/marketPrices.js';

const router = express.Router();

// Deterministic pseudo-random factor per crop per day so the feed is stable
// within a day but "moves" day to day (no external API needed for the demo).
function dailyFactor(seedStr) {
  const day = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  let h = day;
  for (let i = 0; i < seedStr.length; i++) {
    h = (h * 31 + seedStr.charCodeAt(i)) & 0xffffffff;
  }
  // map to roughly -8% .. +8%
  const pct = ((Math.abs(h) % 1600) / 100) - 8;
  return pct;
}

function buildFeed(filterCrop) {
  return BASE_PRICES
    .filter((p) => !filterCrop || p.cropType.toLowerCase() === filterCrop.toLowerCase())
    .map((p) => {
      const changePct = Number(dailyFactor(p.cropType).toFixed(1));
      const price = Math.max(1, Math.round(p.base * (1 + changePct / 100)));
      return {
        cropType: p.cropType,
        bn: p.bn,
        unit: p.unit,
        pricePerKg: price,
        currency: 'BDT',
        changePct,
        trend: changePct > 0.5 ? 'up' : changePct < -0.5 ? 'down' : 'stable',
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
