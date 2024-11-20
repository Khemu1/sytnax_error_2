import { addWorkSpaceService } from "@/backendServices/survey_builder/workspaceService";
import { errorHandler } from "@/middleware/CustomError";
import { NextResponse, NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const userId = req.headers.get("User-Id")!;
    const body = (await req.json()) as { userId: number; name: string };
    const workspace = await addWorkSpaceService(+userId, body.name);
    return NextResponse.json({ workspace }, { status: 201 });
  } catch (error) {
    errorHandler(error);
  }
};
