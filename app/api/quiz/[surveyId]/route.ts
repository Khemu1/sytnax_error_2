import { returnSurveyQuizService } from "@/backendServices/survey_builder/surveyService";
import { errorHandler } from "@/middleware/CustomError";
import { NextRequest, NextResponse } from "next/server";

interface QuizParams {
  params: Promise<{ surveyId: string }>;
}
export const GET = async (req: NextRequest, { params }: QuizParams) => {
  try {
    const { surveyId } = (await params) as { surveyId: string };
    console.log("in controller");
    const survey = await returnSurveyQuizService(surveyId);
    return NextResponse.json(survey);
  } catch (error) {
    return errorHandler(error);
  }
};
