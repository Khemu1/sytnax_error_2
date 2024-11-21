import { deleteSurveyService } from "@/backendServices/survey_builder/surveyService";
import { errorHandler } from "@/middleware/CustomError";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: { surveyId: string };
}

export const DELETE = async (req: NextRequest, { params }: Props) => {
  try {
    console.log("deleting survey", params.surveyId);
    await deleteSurveyService(params.surveyId);
    return NextResponse.json(
      { surveyId: params.surveyId },
      {
        status: 200,
      }
    );
  } catch (error) {
    return errorHandler(error);
  }
};
