import { resetAllMembersAttemptsService } from "@/backendServices/survey_builder/surveyService";
import { errorHandler } from "@/middleware/CustomError";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (req: NextRequest) => {
  try {
    const { surveyId } = (await req.json()) as {
      surveyId: string;
    };
    const updatedMembers = await resetAllMembersAttemptsService(surveyId);
    return NextResponse.json(
      { members: updatedMembers, surveyId },
      { status: 200 }
    );
  } catch (error) {
    return errorHandler(error);
  }
};
