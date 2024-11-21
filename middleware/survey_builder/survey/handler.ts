import { NextRequest, NextResponse } from "next/server";
import {
  checkGroupMembershipForWorkspace,
  checkWorkspaceExistsForSurvey,
  checkSurveyExists,
  checkSurveyTitle,
  validateNewSurvey,
  checkSurveyForDuplicatingOrMoving,
} from "./index";
import {
  authenticateUser,
  checkDashBoardRoles,
} from "@/middleware/auth/authMiddleware";

/**
 * This method performs common checks for all the survey routes
 * @param req
 * @param authUser
 * @param surveyId
 */
const performCommonSurveyChecks = async (
  req: NextRequest,
  authUser: NextResponse,
  surveyId?: string
) => {
  // Parse body only once here and pass it along
  const body = (await req.json()) as {
    name: string;
    workspaceId: string;
    surveyId: string;
    targetWorkspaceId: string;
  };
  body.surveyId = surveyId ?? body.surveyId; // Optional surveyId, if provided

  // Perform checks for workspace existence and membership
  const workspaceExists = await checkWorkspaceExistsForSurvey(
    req,
    authUser,
    body.workspaceId
  );
  const checkMemberShip = await checkGroupMembershipForWorkspace(
    req,
    workspaceExists
  );

  let surveyExists;
  if (surveyId) {
    surveyExists = await checkSurveyExists(req, checkMemberShip, surveyId);
  }

  return { workspaceExists, checkMemberShip, surveyExists, body };
};

const handleAddSurvey = async (req: NextRequest, authUser: NextResponse) => {
  const { checkMemberShip, body } = await performCommonSurveyChecks(
    req,
    authUser
  );
  return await validateNewSurvey(req, checkMemberShip, body.name);
};

const handleGetSurvey = async (req: NextRequest, authUser: NextResponse) => {
  const surveyId = req.nextUrl.pathname.split("/")[4];
  const { surveyExists } = await performCommonSurveyChecks(
    req,
    authUser,
    surveyId
  );
  return surveyExists
    ? surveyExists
    : NextResponse.json({ message: "Survey not found" }, { status: 404 });
};

const handleDeleteSurvey = async (req: NextRequest, authUser: NextResponse) => {
  const surveyId = req.nextUrl.pathname.split("/")[4];
  const { surveyExists } = await performCommonSurveyChecks(
    req,
    authUser,
    surveyId
  );
  return surveyExists;
};

const handleUpdateSurvey = async (req: NextRequest, authUser: NextResponse) => {
  const surveyId = req.nextUrl.pathname.split("/")[4]; // Extract surveyId from the path
  const { checkMemberShip, surveyExists, body } =
    await performCommonSurveyChecks(req, authUser, surveyId);
  if (!surveyExists) {
    return NextResponse.json({ message: "Survey not found" }, { status: 404 });
  }
  return await checkSurveyTitle(req, checkMemberShip, body.name); // Pass body here
};

const handleDuplicateOrMoveSurvey = async (
  req: NextRequest,
  authUser: NextResponse,
  surveyId: string
) => {
  const { surveyExists, body } = await performCommonSurveyChecks(
    req,
    authUser,
    surveyId
  );
  return await checkSurveyForDuplicatingOrMoving(
    req,
    surveyExists!,
    body.targetWorkspaceId
  );
};

export const surveyBuilderRoutes = async (req: NextRequest) => {
  try {
    const authUser = await authenticateUser();
    const method = req.method;
    const pathName = req.nextUrl.pathname;
    const surveyId = req.nextUrl.pathname.split("/")[4];
    const moveOrDuplicateSurveyRegexPath =
      /^\/api\/survey_builder\/survey\/([a-z0-9]{25})\/(move|duplicate)$/;
    if (!surveyId) {
      return NextResponse.json(
        { message: "Survey ID not found" },
        { status: 400 }
      );
    }

    await checkDashBoardRoles(authUser);

    if (pathName.startsWith("/api/survey_builder/survey")) {
      switch (method) {
        case "GET":
          if (pathName === `/api/survey_builder/survey/${surveyId}`) {
            return await handleGetSurvey(req, authUser);
          }
          break;
        case "POST":
          if (pathName === "/api/survey_builder/survey/add-survey") {
            return await handleAddSurvey(req, authUser);
          }
          break;
        case "DELETE":
          if (pathName === `/api/survey_builder/survey/${surveyId}/delete`) {
            return await handleDeleteSurvey(req, authUser);
          }
          break;
        case "PATCH":
          if (
            pathName === `/api/survey_builder/survey/${surveyId}/update-name`
          ) {
            return await handleUpdateSurvey(req, authUser);
          }
          break;
        default:
          return NextResponse.json(
            { message: "Survey Method not allowed" },
            { status: 405 }
          );
      }
    }

    // Handle duplication and moving of surveys
    console.log("pathName", pathName);
    console.log("moveOrDuplicateSurveyRegexPath", moveOrDuplicateSurveyRegexPath.test(pathName));
    if (moveOrDuplicateSurveyRegexPath.test(pathName)) {
      switch (method) {
        case "PATCH":
          return await handleDuplicateOrMoveSurvey(req, authUser, surveyId);
        default:
          return NextResponse.json(
            { message: "Method not allowed" },
            { status: 405 }
          );
      }
    }
    if (moveOrDuplicateSurveyRegexPath.test(pathName)) {
      switch (method) {
        case "PATCH":
          return await handleDuplicateOrMoveSurvey(req, authUser, surveyId);
        default:
          return NextResponse.json(
            { message: "Method not allowed" },
            { status: 405 }
          );
      }
    }

    return NextResponse.json(
      { message: " Survey Method Not found" },
      { status: 404 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};
