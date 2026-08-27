import mongoose from "mongoose";

/**
 * Cached Mongoose connection for Vercel serverless.
 *
 * In serverless environments the function instance is frozen between
 * invocations, so a connected mongoose singleton survives warm starts. We
 * cache the **promise** itself to avoid racing concurrent cold starts — but a
 * cached promise means "an in-flight connect is running", not "we're healthy".
 */
let cached = global._mongooseCache;
if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null };
}

const connectDB = async () => {
  // 1) A connect is already in flight (cold start) — wait on it rather than
  //    starting a second one. Mongoose's default connection is a singleton, so
  //    calling mongoose.connect() twice while one is pending can misbehave.
  if (cached.promise) {
    return cached.promise;
  }

  // 2) Reuse a healthy connection only, and VERIFY it is actually alive with a
  //    ping. readyState: 0=disconnected, 1=connected, 2=connecting, 3=disconnecting.
  //    On serverless the pooled connection can go STALE between warm
  //    invocations: readyState can still report "connected" while the socket is
  //    dead, which makes the next query buffer and time out (the "worked then
  //    stopped" failure). A ping is the only reliable liveness check.
  if (cached.conn && mongoose.connection.readyState === 1) {
    try {
      await cached.conn.db.admin().command({ ping: 1 });
      return cached.conn;
    } catch (e) {
      // Stale socket — break the cache and reconnect below.
      console.warn("MongoDB connection is stale, reconnecting...");
      cached.conn = null;
    }
  }

  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI environment variable is missing");

  console.log("Attempting to connect to MongoDB...");
  const promise = mongoose
    .connect(uri, {
      serverSelectionTimeoutMS: 10000,
      // Fail fast rather than buffering a query against a dead pool. The
      // requireDB middleware awaits connectDB() before any query, so a query
      // should never reach a connection that isn't ready. (If you want queries
      // to queue instead, set this to true.)
      bufferCommands: false,
    })
    .then((m) => {
      cached.conn = m;
      console.log("MongoDB connected successfully");
      return m;
    })
    .catch((err) => {
      // Reset everything so a future request retries the connection.
      cached.promise = null;
      cached.conn = null;
      console.error("MongoDB connection error:", err.message);
      throw err;
    });

  cached.promise = promise;

  try {
    await promise;
  } finally {
    // Settled — clear the in-flight marker. The next call takes the ping path
    // (healthy) or reconnects (if this failed).
    cached.promise = null;
  }
  return cached.conn;
};

export default connectDB;
