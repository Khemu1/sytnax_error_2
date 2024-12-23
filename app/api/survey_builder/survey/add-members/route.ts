import { addMembersToSurveyService } from "@/backendServices/survey_builder/surveyService";
import { errorHandler } from "@/middleware/CustomError";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { surveyId, members } = (await req.json()) as {
      surveyId: string;
      members: string[];
    };
    const addedMembers = await addMembersToSurveyService(surveyId, members);
    return NextResponse.json(
      { members: addedMembers, surveyId },
      { status: 200 }
    );
  } catch (error) {
    return errorHandler(error);
  }
};
