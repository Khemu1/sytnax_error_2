import { deleteSurveyService } from "@/backendServices/survey_builder/surveyService";
import { errorHandler } from "@/middleware/CustomError";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: Promise<{ surveyId: string }>;
}

export const DELETE = async (req: NextRequest, { params }: Props) => {
  try {
    const { surveyId } = await params;
    const { workspaceId } = await req.json();
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
