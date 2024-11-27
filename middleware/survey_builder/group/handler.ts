import {
  authenticateUser,
  checkDashBoardRoles,
} from "@/middleware/auth/authMiddleware";
import { NextRequest, NextResponse } from "next/server";
import { checkDoesUserExistForAdding, checkDoesUserExistForDeleting } from ".";

const handleAddUser = async (
  req: NextRequest,
  authUser: NextResponse,
  username: string,
  groupId: string,
  groupOwnerId: number
) => {
  return await checkDoesUserExistForAdding(
    req,
    authUser,
    username,
    groupId,
    groupOwnerId
  );
};

const handleRemoveUser = async (
  req: NextRequest,
  authUser: NextResponse,
  userId: number,
  groupId: string,
  groupOwnerId: number
) => {
  await checkDoesUserExistForDeleting(
    req,
    authUser,
    userId,
    groupId,
    groupOwnerId
  );
};

export const groupBuilderRoutes = async (req: NextRequest) => {
  try {
    const authUser = await authenticateUser();
    await checkDashBoardRoles(authUser);
    const body = (await req.json()) as {
      groupId: string;
      username: string;
      userId: number;
    };
    const groupOwnerId = +authUser.headers.get("User-Id")! as number;
    const method = req.method;
    const pathName = req.nextUrl.pathname;

    if (pathName.startsWith("/api/survey_builder/group")) {
      switch (method) {
        case "POST":
          if (pathName === "/api/survey_builder/group/add-user") {
            return await handleAddUser(
              req,
              authUser,
              body.username,
              body.groupId,
              groupOwnerId
            );
          }
          break;
        case "DELETE":
          if (pathName === `/api/survey_builder/group/remove-user`) {
            return await handleRemoveUser(
              req,
              authUser,
              body.userId,
              body.groupId,
              groupOwnerId
            );
          }
          break;
        default:
          return NextResponse.json(
            { message: "Method not allowed" },
            { status: 405 }
          );
      }
    }

    return NextResponse.json(
      { message: " Group Method Not found" },
      { status: 404 }
    );
  } catch (error) {
    throw error;
  }
};
