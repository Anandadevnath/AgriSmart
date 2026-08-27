import connectDB from '../database/db.js';

/**
 * Guarantees a live Mongo connection before a request reaches a controller.
 *
 * On Vercel serverless, mongoose's singleton connection can go stale between
 * warm invocations — readyState may still report "connected" while the socket
 * is dead. Without this gate, a controller's `Model.find()` would buffer
 * against the dead pool and die with a "buffering timed out" error (the
 * "worked then stopped" symptom). connectDB() now pings and reconnects, so
 * awaiting it here ensures the query always runs against a verified-open pool.
 */
export const requireDB = async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('MongoDB unavailable:', err.message);
    return res.status(503).json({ success: false, message: 'Database unavailable' });
  }
};
