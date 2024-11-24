import { SignInProps } from "@/types";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import bcrypt from "bcrypt";
import { CustomError } from "@/middleware/CustomError";
import { sendResetPasswordEmail } from "./emailService";
import { generatePasswordResetTokenForEmail } from "./jwtService";
import { calculateExpirationDate } from "@/utils";
import {
  addSecretTokenService,
  getTokenService,
  setTokenToUsed,
} from "./tokenService";

const prisma = new PrismaClient().$extends(withAccelerate());

export const signInService = async (data: SignInProps) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            email: data.usernameOrEmail,
          },
          {
            username: data.usernameOrEmail,
          },
        ],
      },
      include: {
        userRole: true,
      },
    });

    if (!user) {
      throw new CustomError("Invalid Credentials", 404, "Sign in Error", true);
    }
    const response = await fetch("http://localhost:8787/decrypt-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hashedPassword: user.passwordHash,
        password: data.password,
      }),
    });
    const result = (await response.json()) as Promise<boolean>;
    if (!result) {
      throw new CustomError("Invalid Credentials", 404, "Sign in Error", true);
    }
    // get user own group
    const userGroup = await prisma.group.findFirst({
      where: { ownerId: user.id },
    });
    // get group memebers
    const groupMemebers = await prisma.userGroup.findMany({
      where: { groupId: userGroup!.id },
    });

    return {
      id: user.id,
      role: user.userRole!.roleId,
      username: user.username,
      // todo : find a better way instead of assertion
      userOwnGroup: userGroup!.id,
      groupMemebers: groupMemebers.map((member) => member.userId),
    };
  } catch (error) {
    throw error;
  }
};

export const sendEmailService = async (email: string) => {
  try {
    const findUser = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!findUser) {
      throw new CustomError(
        "Email wasn't found",
        404,
        "User not found",
        true,
        "",
        { message: "Email wasn't found" }
      );
    }

    const token = await generatePasswordResetTokenForEmail({ id: findUser.id });

    const expirationTime = process.env.PASSWORD_RESET_TIME as string;

    const expiresAt = calculateExpirationDate(expirationTime);

    await addSecretTokenService(token, findUser.id, expiresAt);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const resetLink = `${baseUrl}/check-token?token=${token}`;

    const html = `
  <div style="font-family: Arial, sans-serif; padding: 20px;">
    <h2 style="color: #333;">Password Reset Request</h2>
    <p>Hello ${findUser.username || "User"},</p>
    <p>We received a request to reset your password. You can reset it using the link below:</p>
    <p>
      <a href="${resetLink}" style="background-color: #007BFF; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">
        Reset Password
      </a>
    </p>
    <p><strong>Note:</strong> This link will expire in 15 minutes.</p>
    <p>If you didn't request a password reset, please ignore this email. We recommend changing your account details for added security.</p>
    <p>Best Regards,<br>Syntax Error Team</p>
  </div>
`;
    await sendResetPasswordEmail(email, html);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new CustomError(
      "An error occurred while sending email",
      500,
      "email message",
      true
    );
  }
};

export const resetPasswordService = async (
  token: string,
  newPassword: string
) => {
  try {
    const { userId } = await getTokenService(token);

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        passwordHash: hashedPassword,
      },
    });

    await setTokenToUsed(token);

    return true;
  } catch (error) {
    console.error("Error in resetPasswordService:", error);
    throw new CustomError(
      "An error occurred while resetting the password",
      500,
      "password reset",
      true
    );
  }
};
