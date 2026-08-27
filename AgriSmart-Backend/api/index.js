// Vercel serverless entry point.
// Vercel provides its own HTTP runtime and wraps this exported Express app as
// a single serverless function. All routes are mounted in ../index.js (or
// app.js), which exports `app` as the default handler.
import app from "../index.js";

export default app;
