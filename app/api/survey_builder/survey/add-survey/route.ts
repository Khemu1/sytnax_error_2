import { addSurveyService } from "@/backendServices/survey_builder/surveyService";
import { errorHandler } from "@/middleware/CustomError";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { workspaceId, name } = await req.json();
    const survey = await addSurveyService(workspaceId, name);
    return NextResponse.json(survey, { status: 201 });
  } catch (error) {
    return errorHandler(error);
  }
};
