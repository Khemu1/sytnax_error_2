import { deleteAllMembersFromSurveyService } from "@/backendServices/survey_builder/surveyService";
import { errorHandler } from "@/middleware/CustomError";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (req: NextRequest) => {
  try {
    const { surveyId } = (await req.json()) as {
      surveyId: string;
    };
    const deletedMembers = await deleteAllMembersFromSurveyService(surveyId);
    return NextResponse.json(
      { members: deletedMembers, surveyId },
      { status: 200 }
    );
  } catch (error) {
    return errorHandler(error);
  }
};
