import { PrismaClient } from "@prisma/client/edge";
import { CustomError } from "@/middleware/CustomError";
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient().$extends(withAccelerate());

export const addSecretTokenService = async (
  token: string,
  userId: number,
  expiresAt: Date
) => {
  try {
    await prisma.token.create({
      data: {
        token: token,
        userId: userId,
        createdAt: new Date(),
        expiresAt: expiresAt,
      },
    });
    return true;
  } catch (error) {
    console.error("Error creating token:", error);
    throw new CustomError(
      "An error occurred while creating token",
      500,
      "token creation",
      true
    );
  }
};

export const getTokenService = async (token: string) => {
  try {
    const findToken = await prisma.token.findFirst({
      where: {
        token: token,
        used: false,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: true,
      },
    });

    if (!findToken) {
      throw new CustomError("Token expired or invalid", 400, "token", true);
    }

    return {
      userId: findToken.userId,
      expiresAt: findToken.expiresAt,
      token: token,
    };
  } catch (error) {
    console.error("Error fetching token:", error);
    throw error;
  }
};

export const setTokenToUsed = async (token: string) => {
  try {
    const updatedToken = await prisma.token.update({
      where: { token },
      data: { used: true },
    });

    if (!updatedToken) {
      throw new CustomError(
        "Token not found or couldn't be updated",
        404,
        "token",
        true
      );
    }
  } catch (error) {
    console.error("Error updating token:", error);
    throw error;
  }
};
