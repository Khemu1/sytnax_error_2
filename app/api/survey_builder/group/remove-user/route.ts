import { removeUserFromGroupService } from "@/backendServices/survey_builder/groupServices";
import { errorHandler } from "@/middleware/CustomError";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (req: NextRequest) => {
  try {
    const { userId,groupId } = await req.json() as { userId: number ,groupId: string};
    await removeUserFromGroupService(groupId, userId);
    return NextResponse.json(userId, {
      status: 200,
    });
  } catch (error) {
    return errorHandler(error);
  }
};  