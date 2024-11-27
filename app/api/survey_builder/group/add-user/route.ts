import { addUserToGroupService } from "@/backendServices/survey_builder/groupServices";
import { errorHandler } from "@/middleware/CustomError";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { groupId } = await req.json();
    const userToInvite = JSON.parse(req.headers.get("User-to-Add")!);
    console.log(userToInvite);
    await addUserToGroupService(groupId, userToInvite.userId);
    return NextResponse.json(userToInvite, {
      status: 201,
    });
  } catch (error) {
    return errorHandler(error);
  }
};
