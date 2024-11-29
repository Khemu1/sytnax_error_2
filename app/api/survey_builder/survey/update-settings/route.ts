import { updateSurveySettingsService } from "@/backendServices/survey_builder/surveyService";
import { errorHandler } from "@/middleware/CustomError";
import { SurveySettings } from "@/types/survey";
import { NextRequest, NextResponse } from "next/server";


export const PATCH = async (request: NextRequest) => {
  try {
    const { settings, surveyId } = (await request.json()) as {
      settings: SurveySettings;
      surveyId: string;
    };
    const survey = await updateSurveySettingsService(surveyId, settings);
    return NextResponse.json( survey , { status: 200 });
  } catch (error) {
    return errorHandler(error);
  }
};
