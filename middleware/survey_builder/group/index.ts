import { CustomError } from "@/middleware/CustomError";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { NextResponse, NextRequest } from "next/server";

const prisma = new PrismaClient().$extends(withAccelerate());

export const checkDoesUserExistForAdding = async (
  _req: NextRequest,
  _res: NextResponse,
  username: string,
  groupId: string,
  groupOwnerId: number
) => {
  try {
    if (!username) {
      throw new CustomError(
        "Username is required inorder to invite them",
        400,
        "group middleware",
        true
      );
    }
    if (!groupId) {
      throw new CustomError(
        "Group ID is required",
        400,
        "group middleware",
        false
      );
    }
    const user = await prisma.user.findFirst({
      where: {
        username: username,
      },
    });

    if (!user) {
      throw new CustomError("User not found", 404, "group middleware", true);
    }
    if (user.id === groupOwnerId) {
      throw new CustomError(
        "You can't add/delete yourself",
        403,
        "group middleware",
        true
      );
    }
    const groupMemeber = await prisma.userGroup.findFirst({
      where: { groupId: groupId, userId: user.id },
    });
    if (groupMemeber) {
      throw new CustomError(
        "User already in group",
        403,
        "group middleware",
        true
      );
    }
    const updatedUser = {
      user: { username: user.username },
      userId: user.id,
      groupId: groupId,
      createdAt: new Date().toISOString(),
    };

    const response = NextResponse.next();
    response.headers.set("User-to-Add", JSON.stringify(updatedUser));
    return response;
  } catch (error) {
    throw error;
  }
};

export const checkDoesUserExistForDeleting = async (
  _req: NextRequest,
  _res: NextResponse,
  userId: number,
  groupId: string,
  groupOwnerId: number
) => {
  try {
    if (!userId) {
      throw new CustomError(
        "UserId is missing ",
        400,
        "group middleware",
        true
      );
    }
    if (!groupId) {
      throw new CustomError(
        "Group ID is required",
        400,
        "group middleware",
        false
      );
    }
    if (userId === groupOwnerId) {
      throw new CustomError(
        "You can't add/delete yourself",
        403,
        "group middleware",
        true
      );
    }
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new CustomError("User not found", 404, "group middleware", true);
    }
    const groupMemeber = await prisma.userGroup.findFirst({
      where: { groupId: groupId, userId: user.id },
    });
    if (!groupMemeber) {
      throw new CustomError(
        "User isn't in the group",
        403,
        "group middleware",
        true
      );
    }

    const response = NextResponse.next();
    return response;
  } catch (error) {
    throw error;
  }
};
