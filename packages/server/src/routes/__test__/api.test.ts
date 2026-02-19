import { describe, it, expect, beforeEach } from "bun:test";
import { Hono } from "hono";

// Create test app with same routes as production
function createTestApp() {
  const app = new Hono();

  app.get("/health", (c) => {
    return c.json({ status: "ok", timestamp: Date.now() });
  });

  app.get("/api/v1/hello", (c) => {
    return c.json({ message: "Hello from my-app!" });
  });

  app.post("/api/v1/echo", async (c) => {
    const body = await c.req.json();
    return c.json({ received: body });
  });

  return app;
}

describe("Health Check", () => {
  it("returns health status", async () => {
    const app = createTestApp();
    const res = await app.request("/health");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe("ok");
    expect(body.timestamp).toBeDefined();
  });
});

describe("API Endpoints", () => {
  it("returns hello message", async () => {
    const app = createTestApp();
    const res = await app.request("/api/v1/hello");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.message).toBe("Hello from my-app!");
  });

  it("echoes POST body", async () => {
    const app = createTestApp();
    const res = await app.request("/api/v1/echo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ test: "data" }),
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.received).toEqual({ test: "data" });
  });

  it("returns 404 for unknown routes", async () => {
    const app = createTestApp();
    const res = await app.request("/api/v1/unknown");
    expect(res.status).toBe(404);
  });
});
