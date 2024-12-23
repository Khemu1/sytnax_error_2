import { errorHandler } from "@/middleware/CustomError";
import { NextRequest, NextResponse } from "next/server";
import { returnSurveySubmissionsService } from "@/backendServices/survey_builder/surveyService";

export const POST = async (req: NextRequest) => {
  try {
    const { surveyId } = await req.json();
    console.log("arrived in submissions route");
    const res = await returnSurveySubmissionsService(surveyId);
    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    return errorHandler(error);
  }
};
