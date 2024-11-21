import { NextResponse } from "next/server";
import {
  checkWorkspaceExists,
  checkWorkspaceTitle,
  validateNewWorkSpace,
  checkGroupMembershipForWorkspace,
} from "./index";
import { CustomNextRequest } from "@/types";
import {
  authenticateUser,
  checkDashBoardRoles,
} from "@/middleware/auth/authMiddleware";

/**
 * does common checks for all workspace routes
 * @param req
 * @param authUser
 */
const performCommonWorkspaceChecks = async (
  req: CustomNextRequest,
  authUser: NextResponse
) => {
  const workspaceExists = await checkWorkspaceExists(req, authUser);

  const checkMembership = await checkGroupMembershipForWorkspace(
    req,
    workspaceExists
  );

  return { workspaceExists, checkMembership };
};

const handleAddWorkspace = async (
  req: CustomNextRequest,
  authUser: NextResponse,
) => {
  return await validateNewWorkSpace(req, authUser);
};

const handleDeleteWorkspace = async (
  req: CustomNextRequest,
  authUser: NextResponse
) => {
  const { checkMembership } = await performCommonWorkspaceChecks(req, authUser);
  return checkMembership;
};

const handleUpdateWorkspace = async (
  req: CustomNextRequest,
  authUser: NextResponse
) => {
  const { checkMembership } = await performCommonWorkspaceChecks(req, authUser);

  return await checkWorkspaceTitle(req, checkMembership);
};

export const workspaceBuilderRoutes = async (req: CustomNextRequest) => {
  try {
    const authUser = await authenticateUser();
    const method = req.method;
    const pathName = req.nextUrl.pathname;

    await checkDashBoardRoles(authUser);

    if (pathName.startsWith("/api/survey_builder/workspace")) {
      switch (method) {
        case "GET":
          return authUser;
        case "POST":
          return await handleAddWorkspace(req, authUser);
        case "DELETE":
          return await handleDeleteWorkspace(req, authUser);
        case "PATCH":
          return await handleUpdateWorkspace(req, authUser);
        default:
          return NextResponse.json(
            { message: "Method not allowed" },
            { status: 405 }
          );
      }
    }

    return NextResponse.json(
      { message: "Workspace Method Not found" },
      { status: 404 }
    );
  } catch (error) {
    throw error;
  }
};
