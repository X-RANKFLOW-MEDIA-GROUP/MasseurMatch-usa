import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-a07b692d/health", (c) => {
  return c.json({ status: "ok" });
});

// KV Store Endpoints
app.get("/make-server-a07b692d/kv", async (c) => {
  const key = c.req.query("key");
  if (!key) return c.json({ error: "Key is required" }, 400);
  try {
    const value = await kv.get(key);
    return c.json({ value });
  } catch (e) {
    console.error(e);
    return c.json({ error: e.message }, 500);
  }
});

app.post("/make-server-a07b692d/kv", async (c) => {
  try {
    const body = await c.req.json();
    const { key, value } = body;
    if (!key || value === undefined) return c.json({ error: "Key and value are required" }, 400);
    await kv.set(key, value);
    return c.json({ success: true });
  } catch (e) {
    console.error(e);
    return c.json({ error: e.message }, 500);
  }
});

Deno.serve(app.fetch);