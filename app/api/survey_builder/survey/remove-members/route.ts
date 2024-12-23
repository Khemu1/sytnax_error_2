import { deleteMembersFromSurveyService } from "@/backendServices/survey_builder/surveyService";
import { errorHandler } from "@/middleware/CustomError";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (req: NextRequest) => {
  try {
    const { surveyId, members } = (await req.json()) as {
      surveyId: string;
      members: string[];
    };
    const removedMembers = await deleteMembersFromSurveyService(
      surveyId,
      members
    );
    return NextResponse.json(
      { members: removedMembers, surveyId },
      { status: 200 }
    );
  } catch (error) {
    return errorHandler(error);
  }
};
