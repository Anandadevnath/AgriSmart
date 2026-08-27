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
  if (cached.conn) {
    // Already connected — reuse.
    return cached.conn;
  }

  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI environment variable is missing");

  if (!cached.promise) {
    console.log("Attempting to connect to MongoDB...");
    cached.promise = mongoose
      .connect(`${uri}/note_app`, {
        serverSelectionTimeoutMS: 5000,
        // Mongoose's bufferCommands is left at the default (true) so
        // queries during a brief reconnection window are queued rather
        // than dropped. If you prefer fail-fast, set:
        //   mongoose.set("bufferCommands", false);
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
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export default connectDB;