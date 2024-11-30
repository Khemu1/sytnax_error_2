import {
  authenticateUser,
  checkDashBoardRoles,
} from "@/middleware/auth/authMiddleware";
import { NextRequest, NextResponse } from "next/server";
import {
  checkDoesSurveyExistForQuestion,
  checkDoesWorkspaceExistForQuestion,
  checkGroupMemberShipForQuestion,
  vlidateForNewQuestion,
} from ".";
import { parseAndValidateNewQuestionFormData } from "@/utils/survey_builder/question";
import { NewQuestionModel, QuestionOptions } from "@/types/buildSurvey";

export const questionBuilderRoutes = async (req: NextRequest) => {
  try {
    const authUser = await authenticateUser();
    await checkDashBoardRoles(authUser);

    const rawFormData = await req.formData();
    const formData = parseAndValidateNewQuestionFormData(rawFormData);
    const method = req.method;
    const pathName = req.nextUrl.pathname;

    if (pathName.startsWith("/api/survey_builder/question")) {
      switch (method) {
        case "POST":
          if (pathName === "/api/survey_builder/question") {
            return await handleAddQuestion(
              req,
              authUser,
              formData.surveyId,
              formData.workspaceId,
              formData
            );
          }
          break;

        default:
          return NextResponse.json(
            { message: "Question Method not allowed" },
            { status: 405 }
          );
      }
    }

    return NextResponse.json(
      { message: "Question Method Not found" },
      { status: 404 }
    );
  } catch (error) {
    throw error;
  }
};

const performCommonQuestionChecks = async (
  req: NextRequest,
  authUser: NextResponse,
  surveyId: string,
  workspaceId: string
) => {
  const checkWorkspaceExists = await checkDoesWorkspaceExistForQuestion(
    req,
    authUser,
    workspaceId
  );
  const checkSurveyExists = await checkDoesSurveyExistForQuestion(
    req,
    checkWorkspaceExists,
    surveyId,
    workspaceId
  );
  const checkMemberShip = await checkGroupMemberShipForQuestion(
    req,
    checkSurveyExists
  );
  return { checkWorkspaceExists, checkSurveyExists, checkMemberShip };
};

const handleAddQuestion = async (
  req: NextRequest,
  authUser: NextResponse,
  surveyId: string,
  workspaceId: string,
  formData: {
    question: NewQuestionModel;
    options: QuestionOptions;
    workspaceId: string;
    surveyId: string;
  }
) => {
  const { checkMemberShip } = await performCommonQuestionChecks(
    req,
    authUser,
    surveyId,
    workspaceId
  );
  return await vlidateForNewQuestion(req, checkMemberShip, formData);
};
