import { duplicateSurveyService } from "@/backendServices/survey_builder/surveyService";
import { errorHandler } from "@/middleware/CustomError";
import { NextRequest, NextResponse } from "next/server";
export const POST = async (req: NextRequest) => {
  try {
    const { surveyId, targetWorkspaceId,name } = await req.json();
    const res = await duplicateSurveyService(surveyId, targetWorkspaceId,name);
    return NextResponse.json(res, { status: 201 });
  } catch (error) {
    return errorHandler(error);
  }
};
