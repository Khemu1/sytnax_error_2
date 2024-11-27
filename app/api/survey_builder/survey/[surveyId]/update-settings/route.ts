import { updateSurveySettingsService } from "@/backendServices/survey_builder/surveyService";
import { errorHandler } from "@/middleware/CustomError";
import { SurveySettings } from "@/types/survey";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: Promise<{ surveyId: string }>;
}

export const PATCH = async (request: NextRequest, { params }: Props) => {
  try {
    const { surveyId } = await params;
    const { settings } = (await request.json()) as {
      settings: SurveySettings;
    };
    const survey = await updateSurveySettingsService(surveyId, settings);
    return NextResponse.json( survey , { status: 200 });
  } catch (error) {
    return errorHandler(error);
  }
};
