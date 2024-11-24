import { Hono } from "hono";
import bcrypt from "bcryptjs";

const app = new Hono();

// POST /decrypt-password route
app.post("/decrypt-password", async (c) => {
  try {
    const { hashedPassword, password } = (await c.req.json()) as {
      hashedPassword: string;
      password: string;
    };

    if (!hashedPassword || !password) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    // Compare the passwords using bcrypt
    const result = await bcrypt.compare(password, hashedPassword);
    return c.json({ result }, 200);
  } catch (error) {
    console.error(error); // Log error for debugging
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

// Default route for unmatched requests
app.all("*", (c) => {
  return c.json({ error: "Not Found" }, 404);
});

// Export the fetch handler
export default {
  async fetch(request: Request): Promise<Response> {
    return app.fetch(request);
  },
};
