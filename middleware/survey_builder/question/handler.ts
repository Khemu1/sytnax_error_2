import {
  authenticateUser,
  checkDashBoardRoles,
} from "@/middleware/auth/authMiddleware";
import { NextRequest, NextResponse } from "next/server";
import {
  checkDoesSurveyExistForQuestion,
  checkDoesWorkspaceExistForQuestion,
  checkGroupMemberShipForQuestion,
  doesQuestionExists,
  vlidateForEditQuestion,
  vlidateForNewQuestion,
} from ".";
import {
  parseAndValidateEditQuestionFormData,
  parseAndValidateNewQuestionFormData,
} from "@/utils/survey_builder/question";
import {
  EditQuestionModel,
  NewQuestionModel,
  QuestionOptions,
} from "@/types/buildSurvey";
import { CustomError } from "@/middleware/CustomError";

export const questionBuilderRoutes = async (req: NextRequest) => {
  try {
    const authUser = await authenticateUser();
    await checkDashBoardRoles(authUser);

    const contentType = req.headers.get("content-type");

    let rawFormData = null;
    let bodyData = null;

    if (contentType?.includes("multipart/form-data")) {
      rawFormData = await req.formData();
    } else if (contentType?.includes("application/json")) {
      bodyData = await req.json();
    } else {
      throw new CustomError(
        "Unsupported Content-Type. Only FormData or JSON is allowed.",
        415,
        "question route"
      );
    }

    const workspaceId = (rawFormData?.get("workspaceId") ||
      bodyData?.workspaceId) as string;
    const surveyId = (rawFormData?.get("surveyId") ||
      bodyData?.surveyId) as string;
    const questionId = (rawFormData?.get("questionId") ||
      bodyData?.questionId) as string;

    console.log("workspaceId", workspaceId);
    console.log("surveyId", surveyId);
    console.log("questionId", questionId);

    const formDataNewQuestion = rawFormData
      ? parseAndValidateNewQuestionFormData(rawFormData)
      : null;

    const formDataEditQuestion = rawFormData
      ? parseAndValidateEditQuestionFormData(rawFormData)
      : null;

    const method = req.method;
    const pathName = req.nextUrl.pathname;

    if (pathName.startsWith("/api/survey_builder/question")) {
      switch (method) {
        case "POST":
          if (pathName === "/api/survey_builder/question") {
            if (!formDataNewQuestion) {
              throw new CustomError(
                "Missing question data",
                400,
                "question route"
              );
            }
            return handleAddQuestion(req, authUser, formDataNewQuestion);
          }
          if (pathName === "/api/survey_builder/question/duplicate") {
            await performCommonQuestionChecks(
              req,
              authUser,
              surveyId,
              workspaceId
            );
            return doesQuestionExists(questionId, surveyId);
          }
          break;
        case "PATCH":
          if (pathName === "/api/survey_builder/question/edit") {
            if (!formDataEditQuestion) {
              throw new CustomError(
                "Missing question data",
                400,
                "question route"
              );
            }
            return handleEditQuestion(
              req,
              authUser,

              formDataEditQuestion
            );
          }
          break;

        case "DELETE":
          if (pathName === `/api/survey_builder/question/delete`) {
            await performCommonQuestionChecks(
              req,
              authUser,
              surveyId,
              workspaceId
            );
            return doesQuestionExists(questionId, surveyId);
          }

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
    formData.surveyId,
    formData.workspaceId
  );
  return vlidateForNewQuestion(req, checkMemberShip, formData);
};

const handleEditQuestion = async (
  req: NextRequest,
  authUser: NextResponse,
  formData: {
    question: EditQuestionModel;
    options: QuestionOptions;
    workspaceId: string;
    surveyId: string;
  }
) => {
  const { checkMemberShip } = await performCommonQuestionChecks(
    req,
    authUser,
    formData.surveyId,
    formData.workspaceId
  );

  await vlidateForEditQuestion(req, checkMemberShip, formData);

  return doesQuestionExists(formData.question.id, formData.surveyId);
};
