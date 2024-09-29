import nodemailer from "nodemailer";
import { CustomError } from "@/middleware/CustomError";

export const sendEmail = async (
  email: string,
  subject: string,
  html: string
) => {
  try {
    // Validate environment variables
    const { EMAIL_HOST, EMAIL_PORT, EMAIL_AUTH_USER, EMAIL_AUTH_PASS } =
      process.env;

    if (!EMAIL_HOST || !EMAIL_AUTH_USER || !EMAIL_AUTH_PASS) {
      throw new CustomError(
        "Missing email service configuration",
        500,
        "Check environment variables.",
        true
      );
    }

    // Create a transporter
    const transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: parseInt(EMAIL_PORT || "465", 10),
      secure: true,
      auth: {
        user: EMAIL_AUTH_USER,
        pass: EMAIL_AUTH_PASS,
      },
    });

    // Define mail options
    const mailOptions = {
      from: EMAIL_AUTH_USER,
      to: email,
      subject: subject,
      html: `${html}`,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log("Email sent: " + email);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new CustomError(
      "Failed to send email",
      500,
      "Check the email service configuration.",
      true
    );
  }
};
