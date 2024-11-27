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
  body.surveyId = surveyId ?? body.surveyId;

  // perform checks for workspace existence and membership
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
          if (
            pathName ===
            `/api/survey_builder/survey/${surveyId}/update-settings`
          ) {
            return await handleUpdateSurveySettings(req, authUser);
          }
          if (
            pathName === `/api/survey_builder/survey/${surveyId}/update-status`
          ) {
            const { checkMemberShip } = await performCommonSurveyChecks(req, authUser);
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
    throw error;
  }
};
