import { updateWorkspaceNameService } from "@/backendServices/survey_builder/workspaceService";
import { errorHandler } from "@/middleware/CustomError";
import { WorkSpaceModel } from "@/types/survey";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (req: NextRequest) => {
  try {
    const rawWorkspace = JSON.parse(req.headers.get("workspace")!);
    const currentWorkspace = JSON.parse(rawWorkspace) as WorkSpaceModel;
    const body = (await req.json()) as { name: string };
    const workspace = await updateWorkspaceNameService(
      body.name,
      currentWorkspace.id
    );
    return NextResponse.json({ workspace }, { status: 200 });
  } catch (error) {
    return errorHandler(error);
  }
};
