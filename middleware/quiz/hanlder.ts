import { NextRequest, NextResponse } from "next/server";
import { checkSurveyExistsForQuiz, validateQuizParticipant } from "./index";
import { parseAndValidateQuizParticipantFormData } from "@/utils/quiz";

const handleGetSurveyForQuiz = async (req: NextRequest, surveyId: string) => {
  return checkSurveyExistsForQuiz(req, surveyId);
};
const handleAddQuizParticipant = async (req: NextRequest) => {
  const rawFormData = await req.formData();
  const data = parseAndValidateQuizParticipantFormData(rawFormData);
  await checkSurveyExistsForQuiz(req, data.surveyId);
  console.log("know validing for new quiz participant");
  return validateQuizParticipant(req, data);
};

export const quizRoutes = (req: NextRequest) => {
  try {
    const surveyIdFromParams = req.nextUrl.pathname.split("/")[3];
    console.log("surveyIdFromParams", surveyIdFromParams);
    const method = req.method;
    const pathName = req.nextUrl.pathname;
    // Handle survey routes
    if (pathName.startsWith("/api/quiz")) {
      switch (method) {
        case "GET":
          if (pathName === `/api/quiz/${surveyIdFromParams}`) {
            return handleGetSurveyForQuiz(req, surveyIdFromParams);
          }
          break;
        case "POST":
          if (pathName === "/api/quiz/add-participant") {
            return handleAddQuizParticipant(req);
          }

        default:
          return NextResponse.json(
            { message: "Quiz Method not allowed" },
            { status: 405 }
          );
      }
    }

    // Handle move/duplicate survey routes
    return NextResponse.json(
      { message: "Quiz Method Not found" },
      { status: 404 }
    );
  } catch (error) {
    throw error;
  }
};
