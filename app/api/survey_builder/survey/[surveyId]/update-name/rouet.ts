import { updateSurveyNameService } from "@/backendServices/survey_builder/surveyService";
import { errorHandler } from "@/middleware/CustomError";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: { surveyId: string };
}

export const PATCH = async (req: NextRequest, { params }: Props) => {
  try {
    const { name } = await req.json();
    const survey = await updateSurveyNameService(name, params.surveyId);
    return NextResponse.json(
      { survey },
      {
        status: 200,
      }
    );
  } catch (error) {
    return errorHandler(error);
  }
};
