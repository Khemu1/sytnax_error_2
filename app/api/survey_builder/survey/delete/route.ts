import { deleteSurveyService } from "@/backendServices/survey_builder/surveyService";
import { errorHandler } from "@/middleware/CustomError";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (req: NextRequest) => {
  try {
    const { workspaceId, surveyId } = await req.json();
    await deleteSurveyService(surveyId);
    return NextResponse.json(
      { surveyId, workspaceId },
      {
        status: 200,
      }
    );
  } catch (error) {
    return errorHandler(error);
  }
};
