import { getMembersForSurveyService } from "@/backendServices/survey_builder/surveyService";
import { errorHandler } from "@/middleware/CustomError";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    console.log("in controller");
    const { surveyId } = (await req.json()) as {
      surveyId: string;
    };

    const members = await getMembersForSurveyService(surveyId);
    return NextResponse.json(members);
  } catch (error) {
    return errorHandler(error);
  }
};
