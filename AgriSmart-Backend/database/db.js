import mongoose from "mongoose";

/**
 * Cached Mongoose connection for Vercel serverless.
 *
 * In serverless environments the function instance is frozen between
 * invocations, so a connected mongoose singleton survives warm starts.
 * We cache the **promise** itself to avoid racing concurrent cold starts.
 */
let cached = global._mongooseCache;
if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null };
}

const connectDB = async () => {
  // Reuse a healthy connection only. readyState: 0=disconnected, 1=connected,
  // 2=connecting, 3=disconnecting. On serverless the pooled connection can go
  // stale between warm invocations, so we must reconnect rather than reuse a
  // dead one (which would cause "buffering timed out" on the next query).
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // Missing or stale — reset so we reconnect fresh.
  cached.conn = null;
  cached.promise = null;

  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI environment variable is missing");

  console.log("Attempting to connect to MongoDB...");
  cached.promise = mongoose
    .connect(uri, {
      serverSelectionTimeoutMS: 10000,
      // Buffer commands during the brief connect window so a query made right
      // after a cold start is queued rather than dropped. If you prefer
      // fail-fast, set mongoose.set("bufferCommands", false) globally instead.
    })
    .then((m) => {
      console.log("MongoDB connected successfully");
      return m;
    })
    .catch((err) => {
      // Reset the promise so a future request retries the connection.
      cached.promise = null;
      console.error("MongoDB connection error:", err.message);
      throw err;
    });

  cached.conn = await cached.promise;
  return cached.conn;
};

export default connectDB;
