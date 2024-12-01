import { Context } from "hono";
import bcrypt from "bcryptjs";

export const encryptPassword = async (c: Context) => {
  try {
    const { password } = await c.req.json();

    if (!password) {
      return c.json({ error: "Missing required password" }, 400);
    }

    const result = await bcrypt.hash(password, 10);
    return c.json({ success: true, result });
  } catch (error) {
    console.error("Error in /decrypt-password:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
};
