import nodemailer from "nodemailer";
import { CustomError } from "@/middleware/CustomError";
import { RegisterCourseFormProps } from "@/types";

// Load environment variables
const { EMAIL_HOST, EMAIL_PORT, EMAIL_AUTH_USER, EMAIL_AUTH_PASS } =
  process.env;

// Validate required environment variables
const validateEnvVariables = () => {
  if (!EMAIL_HOST || !EMAIL_AUTH_USER || !EMAIL_AUTH_PASS) {
    throw new CustomError(
      "Missing email service configuration",
      500,
      "Check environment variables.",
      true
    );
  }
};

// Create transporter only once
const createTransporter = () => {
  validateEnvVariables();

  return nodemailer.createTransport({
    host: EMAIL_HOST,
    port: parseInt(EMAIL_PORT || "465", 10),
    secure: true,
    auth: {
      user: EMAIL_AUTH_USER,
      pass: EMAIL_AUTH_PASS,
    },
  });
};

// Send email helper function
const sendEmail = async (to: string, subject: string, html: string) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: EMAIL_AUTH_USER,
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent: " + to);
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

export const sendRegistrationNotification = async (
  data: RegisterCourseFormProps
) => {
  const subject = "New Registration Notification";
  const html = `
    <p>New registration added:</p>
    <ul>
      <li>Name: ${data.name}</li>
      <li>GPA: ${data.gpa}</li>
      <li>Branch: ${data.branch}</li>
      <li>Course: ${data.course}</li>
      <li>WhatsApp: ${data.whatsapp}</li>
      <li>Email: ${data.email}</li>
    </ul>
  `;

  await sendEmail(process.env.NOTIFICATION_TO as string, subject, html);
};

export const sendResetPasswordEmail = async (
  email: string,
  resetLink: string
) => {
  const subject = "Password Reset Request";
  const html = `
    <p>You requested a password reset. Click the link below to reset your password:</p>
    <p><a href="${resetLink}">${resetLink}</a></p>
  `;

  await sendEmail(email, subject, html);
};
