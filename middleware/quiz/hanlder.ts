import { NextRequest, NextResponse } from "next/server";
import {
  checkDoesQuizExist,
  checkSurveyExistsForQuiz,
  validateQuizParticipant,
} from "./index";
import { parseAndValidateQuizParticipantFormData } from "@/utils/quiz";

const handleGetSurveyForQuiz = async (req: NextRequest, surveyId: string) => {
  return checkSurveyExistsForQuiz(req, surveyId);
};
const handleAddQuizParticipant = async (req: NextRequest) => {
  const rawFormData = await req.formData();
  const data = parseAndValidateQuizParticipantFormData(rawFormData);
  await checkSurveyExistsForQuiz(req, data.surveyId, data.submissionDate);
  console.log("know validing for new quiz participant");
  return validateQuizParticipant(req, data);
};

export const quizRoutes = (req: NextRequest) => {
  try {
    const surveyIdFromParams = req.nextUrl.pathname.split("/")[3];
    const method = req.method;
    const pathName = req.nextUrl.pathname;

    if (pathName.startsWith("/api/quiz")) {
      switch (method) {
        case "GET":
          if (pathName === `/api/quiz/${surveyIdFromParams}`) {
            return handleGetSurveyForQuiz(req, surveyIdFromParams);
          }

          const quizIdFromParams = req.nextUrl.pathname.split("/")[4];
          if (pathName === `/api/quiz/check-grade/${quizIdFromParams}`) {
            return checkDoesQuizExist(req, quizIdFromParams);
          }

          break;
        case "POST":
          if (pathName === "/api/quiz/add-participant") {
            return handleAddQuizParticipant(req);
          }
        case "POST":
          if (pathName === "/api/quiz/get-particpant") {
            return NextResponse.next();
          }

        default:
          return NextResponse.json(
            { message: "Quiz Method not allowed" },
            { status: 405 }
          );
      }
    }

    return NextResponse.json(
      { message: "Quiz Method Not found" },
      { status: 404 }
    );
  } catch (error) {
    throw error;
  }
};
