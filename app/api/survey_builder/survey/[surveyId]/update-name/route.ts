import { updateSurveyNameService } from "@/backendServices/survey_builder/surveyService";
import { errorHandler } from "@/middleware/CustomError";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: Promise<{ surveyId: string }>;
}

export const PATCH = async (req: NextRequest, { params }: Props) => {
  try {
    const { surveyId } = await params;
    const { name } = await req.json();
    const survey = await updateSurveyNameService(name, surveyId);
    return NextResponse.json(survey, {
      status: 200,
    });
  } catch (error) {
    return errorHandler(error);
  }
};
