import { NextRequest, NextResponse } from "next/server";
import { checkSurveyExistsForQuiz } from "./index";

const handleGetSurveyForQuiz = async (req: NextRequest, surveyId: string) => {
  return checkSurveyExistsForQuiz(req, surveyId);
};

export const quizRoutes = async (req: NextRequest) => {
  try {
    const surveyIdFromParams = req.nextUrl.pathname.split("/")[4];
    console.log("surveyIdFromParams", surveyIdFromParams);
    const method = req.method;
    const pathName = req.nextUrl.pathname;
    console.log("pathName", pathName);
    console.log(`/api/quiz/${surveyIdFromParams}`);
    // Handle survey routes
    if (pathName.startsWith("/api/quiz")) {
      switch (method) {
        case "GET":
          if (pathName === `/api/quiz/${surveyIdFromParams}`) {
            return handleGetSurveyForQuiz(req, surveyIdFromParams);
          }
          break;
        // case "POST":
        //   if (pathName === "/api/quiz/survey/add-survey") {
        //     return await handleAddSurvey(req, authUser);
        //   }

        default:
          return NextResponse.json(
            { message: "Quiz Method not allowed" },
            { status: 405 }
          );
      }
    }

    // Handle move/duplicate survey routes
    return NextResponse.json(
      { message: "Survey Method Not found" },
      { status: 404 }
    );
  } catch (error) {
    throw error;
  }
};
