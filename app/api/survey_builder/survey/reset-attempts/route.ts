import { resetMembersAttemptsService } from "@/backendServices/survey_builder/surveyService";
import { errorHandler } from "@/middleware/CustomError";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (req: NextRequest) => {
  try {
    const { surveyId, members } = (await req.json()) as {
      surveyId: string;
      members: string[];
    };
    const updatedMembers = await resetMembersAttemptsService(surveyId, members);
    return NextResponse.json(
      { members: updatedMembers, surveyId },
      { status: 200 }
    );
  } catch (error) {
    return errorHandler;
  }
};
