import { moveSuveryService } from "@/backendServices/survey_builder/surveyService";
import { errorHandler } from "@/middleware/CustomError";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: Promise<{ surveyId: string }>;
}

export const PATCH = async (req: NextRequest, { params }: Props) => {
  try {
    const { surveyId } = await params;
    const { targetWorkspaceId, workspaceId } = (await req.json()) as {
      targetWorkspaceId: string;
      workspaceId: string;
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
