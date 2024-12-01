import { Context } from "hono";
import bcrypt from "bcryptjs";

export const decryptAndComparePassword = async (c: Context) => {
  try {
    const { hashedPassword, password } = await c.req.json();

    if (!hashedPassword || !password) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    const result = await bcrypt.compare(password, hashedPassword);
    return c.json({ success: true, result });
  } catch (error) {
    console.error("Error in /decrypt-password:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
};


