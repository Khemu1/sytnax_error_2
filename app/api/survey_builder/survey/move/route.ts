import { moveSuveryService } from "@/backendServices/survey_builder/surveyService";
import { errorHandler } from "@/middleware/CustomError";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (req: NextRequest) => {
  try {
    const { targetWorkspaceId, workspaceId, surveyId } = (await req.json()) as {
      targetWorkspaceId: string;
      workspaceId: string;
      surveyId: string;
    };
    await moveSuveryService(surveyId, targetWorkspaceId);
    return NextResponse.json(
      { targetWorkspaceId, surveyId, soruceWorkspaceId: workspaceId },
      {
        status: 200,
      }
    );
  } catch (error) {
    return errorHandler(error);
  }
};
