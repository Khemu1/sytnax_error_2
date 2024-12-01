import { fromHono } from "chanfana";
import { Hono } from "hono";
import { sendEmail } from "endpoints/sendEmail";
import { decryptAndComparePassword } from "endpoints/decryptPassword";
import { encryptPassword } from "endpoints/encryptPassword";

// Start a Hono app
const app = new Hono();

// Setup OpenAPI registry
const openapi = fromHono(app, {
	docs_url: "/",
});

// Register OpenAPI endpoints
openapi.post("/send-email", sendEmail);
openapi.post("/decrypt-password", decryptAndComparePassword);
openapi.post("/encrypt-password", encryptPassword);



openapi.use("*", async (c) => {
	return c.json({ error: "Route Not found" }, 404);
});

// Export the Hono app
export default app;
