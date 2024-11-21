import { moveSuveryService } from "@/backendServices/survey_builder/surveyService";
import { errorHandler } from "@/middleware/CustomError";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: { surveyId: string };
}

export const PATCH = async (req: NextRequest, { params }: Props) => {
  try {
    const {  targetWorkspaceId } = await req.json();
    await moveSuveryService(params.surveyId, targetWorkspaceId);
    return NextResponse.json(
      { targetWorkspaceId, surveyId: params.surveyId },
      {
        status: 200,
      }
    );
  } catch (error) {
    return errorHandler(error);
  }
};