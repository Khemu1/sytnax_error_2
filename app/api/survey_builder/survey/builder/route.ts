import { returnSurveyForBuilderService } from "@/backendServices/survey_builder/surveyService";
import { errorHandler } from "@/middleware/CustomError";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { surveyId } = await req.json();

    console.log("in controller", surveyId);
    const survey = await returnSurveyForBuilderService(surveyId);
    return NextResponse.json( survey, { status: 200 });
  } catch (error) {
    return errorHandler(error);
  }
};
