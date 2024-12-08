import { NextRequest, NextResponse } from "next/server";
import {
  checkGroupMembershipForSurvey,
  checkWorkspaceExistsForSurvey,
  checkSurveyExists,
  checkSurveyTitle,
  validateNewSurvey,
  checkSurveyForDuplicatingOrMoving,
  validateSurveySettings,
} from "./index";
import {
  authenticateUser,
  checkDashBoardRoles,
} from "@/middleware/auth/authMiddleware";
import { SurveySettings } from "@/types/survey";

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
  const body = (await req.json()) as {
    name: string;
    workspaceId: string;
    surveyId: string;
    targetWorkspaceId: string;
    settings: SurveySettings;
  };
  body.surveyId = body.surveyId ?? surveyId;

  const workspaceExists = await checkWorkspaceExistsForSurvey(
    req,
    authUser,
    body.workspaceId
  );
  const checkMemberShip = await checkGroupMembershipForSurvey(
    req,
    workspaceExists
  );

  let surveyExists;
  if (surveyId) {
    surveyExists = await checkSurveyExists(req, checkMemberShip, body.surveyId);
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
  return surveyExists;
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
  const surveyId = req.nextUrl.pathname.split("/")[4];
  const { checkMemberShip, body } = await performCommonSurveyChecks(
    req,
    authUser,
    surveyId
  );
  return await checkSurveyTitle(req, checkMemberShip, body.name);
};

const handleUpdateSurveySettings = async (
  req: NextRequest,
  authUser: NextResponse
) => {
  const surveyId = req.nextUrl.pathname.split("/")[4];
  const { checkMemberShip, body } = await performCommonSurveyChecks(
    req,
    authUser,
    surveyId
  );
  return await validateSurveySettings(req, checkMemberShip, body.settings);
};

const handleMoveSurveySurvey = async (
  req: NextRequest,
  authUser: NextResponse
) => {
  const { surveyExists, body } = await performCommonSurveyChecks(req, authUser);
  return checkSurveyForDuplicatingOrMoving(
    req,
    surveyExists!,
    body.targetWorkspaceId
  );
};

const handleDuplicateSurvey = async (
  req: NextRequest,
  authUser: NextResponse
) => {
  const { surveyExists, body, workspaceExists } =
    await performCommonSurveyChecks(req, authUser);
  await checkSurveyTitle(req, workspaceExists, body.name);
  return checkSurveyForDuplicatingOrMoving(
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

    const moveOrDuplicateSurveyRegexPath =
      /^\/api\/survey_builder\/survey\/(move|duplicate)$/;

    await checkDashBoardRoles(authUser);

    // Handle survey routes
    if (pathName.startsWith("/api/survey_builder/survey")) {
      console.log("pathName", pathName);
      switch (method) {
        case "POST":
          if (pathName === "/api/survey_builder/survey/add-survey") {
            return handleAddSurvey(req, authUser);
          }

          if (pathName === "/api/survey_builder/survey/builder") {
            return handleGetSurvey(req, authUser);
          }
          if (pathName === "/api/survey_builder/survey/submissions") {
            return handleGetSurvey(req, authUser);
          }
          break;
        case "DELETE":
          if (pathName === `/api/survey_builder/survey/delete`) {
            return handleDeleteSurvey(req, authUser);
          }
          break;
        case "PATCH":
          if (pathName === `/api/survey_builder/survey/update-name`) {
            return handleUpdateSurvey(req, authUser);
          }
          if (pathName === `/api/survey_builder/survey/update-settings`) {
            return handleUpdateSurveySettings(req, authUser);
          }
          if (pathName === `/api/survey_builder/survey/update-status`) {
            const { checkMemberShip } = await performCommonSurveyChecks(
              req,
              authUser
            );
            return checkMemberShip;
          }
          break;
        default:
          return NextResponse.json(
            { message: "Survey Method not allowed" },
            { status: 405 }
          );
      }
    }

    // Handle move/duplicate survey routes
    if (moveOrDuplicateSurveyRegexPath.test(pathName)) {
      switch (method) {
        case "PATCH":
          return handleMoveSurveySurvey(req, authUser);
        case "POST":
          return handleDuplicateSurvey(req, authUser);
        default:
          return NextResponse.json(
            { message: "Method not allowed" },
            { status: 405 }
          );
      }
    }

    return NextResponse.json(
      { message: "Survey Method Not found" },
      { status: 404 }
    );
  } catch (error) {
    throw error;
  }
};
