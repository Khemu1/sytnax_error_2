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

interface Props {
  params: Promise<{
    workspaceId: string;
    surveyId: string;
  }>;
}
export const questionBuilderRoutes = async (
  req: NextRequest,
  { params }: Props
) => {
  try {
    const authUser = await authenticateUser();
    await checkDashBoardRoles(authUser);
    const rawFormData = await req.formData();
    const formData = {
      question: rawFormData.get("question")!,
      options: rawFormData.get("options")!,
    };
    const { workspaceId, surveyId } = (await params) as {
      workspaceId: string;
      surveyId: string;
    };
    const method = req.method;
    const pathName = req.nextUrl.pathname;

    if (pathName.startsWith("/api/survey_builder/question")) {
      switch (method) {
        case "POST":
          if (pathName === "/api/survey_builder/question") {
            return await handleAddQuestion(
              req,
              authUser,
              surveyId,
              workspaceId,
              {}
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
  formData: { question: FormDataEntryValue; options: FormDataEntryValue }
) => {
  const { checkMemberShip } = await performCommonQuestionChecks(
    req,
    authUser,
    surveyId,
    workspaceId
  );
  console.log("formData", formData);
  // return await vlidateForNewQuestion(req, checkMemberShip, formData);
};
