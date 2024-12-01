import { Context } from "hono";

const sendEmail = async (c: Context) => {
  try {
    // Get the validated data (in this case, from the request body)
    const { to, subject, html } = await c.req.json();

    // Validate required fields
    if (!to || !subject || !html) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    // Send the email
    const result = await sendEmailToService(c, to, subject, html);

    // Return a successful response
    return c.json({ success: true, message: result.message });
  } catch (error) {
    console.error("Error in /send-email:", error);
    return c.json({ error: error.message || "Unknown error" }, 500);
  }
};

// Email sending logic (you could extract this as well into another service if needed)
const sendEmailToService = async (
  c: Context,
  to: string,
  subject: string,
  html: string
) => {
  const { SENDGRID_API_KEY, SENDGRID_SENDER_EMAIL } = c.env;

  if (!SENDGRID_API_KEY || !SENDGRID_SENDER_EMAIL) {
    throw new Error("Missing SendGrid API key or sender email");
  }

  const emailData = {
    personalizations: [{ to: [{ email: to }], subject }],
    from: { email: SENDGRID_SENDER_EMAIL },
    content: [{ type: "text/html", value: html }],
  };

  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SENDGRID_API_KEY}`,
    },
    body: JSON.stringify(emailData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`SendGrid API Error: ${errorText}`);
  }

  return { message: "Email sent successfully!" };
};

export { sendEmail };
