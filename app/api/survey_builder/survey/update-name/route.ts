import { updateSurveyNameService } from "@/backendServices/survey_builder/surveyService";
import { errorHandler } from "@/middleware/CustomError";
import { NextRequest, NextResponse } from "next/server";


export const PATCH = async (req: NextRequest,) => {
  try {
    const { name, surveyId } = await req.json();
    const survey = await updateSurveyNameService(name, surveyId);
    return NextResponse.json(survey, {
      status: 200,
    });
  } catch (error) {
    return errorHandler(error);
  }
};
