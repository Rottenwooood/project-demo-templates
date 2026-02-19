import { Hono } from "hono";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";

// API Router
const apiRouter = new Hono();

// Health check
apiRouter.get("/health", (c) => {
  return c.json({ status: "ok", timestamp: Date.now() });
});

// Example API endpoint - modify for your project
apiRouter.get("/api/v1/hello", (c) => {
  return c.json({ message: "Hello from my-app!" });
});

// Example POST endpoint
apiRouter.post("/api/v1/echo", async (c) => {
  const body = await c.req.json();
  return c.json({ received: body });
});

// Main app
const app = new Hono();

app.use("*", cors());
app.use("*", prettyJSON());
app.use("*", async (c, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${c.req.method} ${c.req.url} - ${c.res.status} - ${ms}ms`);
});

app.route("/", apiRouter);

app.onError((err, c) => {
  console.error("Error:", err);
  return c.json({ error: err.message }, 500);
});

const PORT = process.env.PORT || 3000;

Bun.serve({
  port: PORT,
  fetch: app.fetch,
});

console.log(`Server running on http://localhost:${PORT}`);
