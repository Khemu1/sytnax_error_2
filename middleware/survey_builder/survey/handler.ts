import { NextRequest, NextResponse } from "next/server";
import {
  checkGroupMembershipForSurvey,
  checkWorkspaceExistsForSurvey,
  checkSurveyExists,
  checkSurveyTitle,
  validateNewSurvey,
  checkSurveyForDuplicatingOrMoving,
  validateSurveySettings,
  checkSurveyExistsForQuiz,
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
  console.log(body);
  // Perform checks for workspace existence and membership
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
  console.log("in handle add survey");
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

const handleGetSurveyForQuiz = async (req: NextRequest) => {
  const body = (await req.json()) as {
    name: string;
    workspaceId: string;
    surveyId: string;
    targetWorkspaceId: string;
    settings: SurveySettings;
  };
  return checkSurveyExistsForQuiz(req, body.surveyId);
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

const handleDuplicateOrMoveSurvey = async (
  req: NextRequest,
  authUser: NextResponse
) => {
  const { surveyExists, body } = await performCommonSurveyChecks(req, authUser);
  console.log("common check done");
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
      switch (method) {
        case "GET":
          if (pathName === "/api/survey_builder/survey/quiz") {
            return handleGetSurveyForQuiz(req);
          }
          break;
        case "POST":
          if (pathName === "/api/survey_builder/survey/add-survey") {
            return await handleAddSurvey(req, authUser);
          }

          if (pathName === "/api/survey_builder/survey/builder") {
            return await handleGetSurvey(req, authUser);
          }
          break;
        case "DELETE":
          if (pathName === `/api/survey_builder/survey/delete`) {
            return await handleDeleteSurvey(req, authUser);
          }
          break;
        case "PATCH":
          if (pathName === `/api/survey_builder/survey/update-name`) {
            return await handleUpdateSurvey(req, authUser);
          }
          if (pathName === `/api/survey_builder/survey/update-settings`) {
            return await handleUpdateSurveySettings(req, authUser);
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
          return await handleDuplicateOrMoveSurvey(req, authUser);
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
