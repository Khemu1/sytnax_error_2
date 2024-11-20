import { NextResponse } from "next/server";
import { authenticateUser, checkDashBoardRoles } from "../auth/authMiddleware";
import {
  checkGroupMembershipForWorkspace,
  checkWorkspaceExists,
  checkWorkspaceTitle,
  validateNewWorkSpace,
} from "./workspace";
import { CustomNextRequest } from "@/types";

export const surveyBuilderRoutes = async (req: CustomNextRequest) => {
  const authUser = await authenticateUser();
  const method = req.method;
  await checkDashBoardRoles(authUser);
  if (method === "GET") {
    return authUser;
  }
  if (method === "POST") {
    return await validateNewWorkSpace(req, authUser);
  }

  if (method === "DELETE") {
    const checkworkspace = await checkWorkspaceExists(req, authUser);
    return await checkGroupMembershipForWorkspace(req, checkworkspace);
  }

  if (method === "PATCH") {
    const checkworkspace = await checkWorkspaceExists(req, authUser);
    const checkMemberShip = await checkGroupMembershipForWorkspace(
      req,
      checkworkspace
    );
    return await checkWorkspaceTitle(req, checkMemberShip);
  }

  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
};
