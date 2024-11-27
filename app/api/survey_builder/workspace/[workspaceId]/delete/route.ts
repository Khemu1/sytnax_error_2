import { deleteWorkspaceService } from "@/backendServices/survey_builder/workspaceService";
import { errorHandler } from "@/middleware/CustomError";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: Promise<{ workspaceId: string }>;
}

export const DELETE = async (req: NextRequest, { params }: Props) => {
  try {
    const { workspaceId } = await params;
    await deleteWorkspaceService(workspaceId);
    return NextResponse.json({ workspaceId: workspaceId }, { status: 200 });
  } catch (error) {
    return errorHandler(error);
  }
};
