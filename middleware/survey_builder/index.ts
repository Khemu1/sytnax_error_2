import { NextResponse } from "next/server";
import { authenticateUser, checkDashBoardRoles } from "../auth/authMiddleware";
import { validateNewWorkSpace } from "./workspace";
import { CustomNextRequest } from "@/types";
export const surveyBuilderRoutes = async (req: CustomNextRequest) => {
  const authUser = await authenticateUser();
  const method = req.method;
  const { pathname } = req.nextUrl;

  await checkDashBoardRoles(authUser);

  // workspaces
  if (method === "POST") {
    return await validateNewWorkSpace(req, authUser);
  }

  return authUser;
};
