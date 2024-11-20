import { deleteWorkspaceService } from "@/backendServices/survey_builder/workspaceService";
import { errorHandler } from "@/middleware/CustomError";
import { WorkSpaceModel } from "@/types/survey";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (req: NextRequest) => {
  try {
    const workspace = JSON.parse(
      req.headers.get("workspace")!
    ) as WorkSpaceModel;
    await deleteWorkspaceService(workspace.id);
    return NextResponse.json({ workspaceId: workspace.id }, { status: 200 });
  } catch (error) {
    return errorHandler(error);
  }
};
