import { CustomError } from "@/middleware/CustomError";
import { PrismaClient } from "@prisma/client/edge";
import { NextRequest, NextResponse } from "next/server";
import { withAccelerate } from "@prisma/extension-accelerate";
const prisma = new PrismaClient().$extends(withAccelerate());

export const checkSurveyExistsForQuiz = async (
  _req: NextRequest,
  surveyId: string
) => {
  try {
    if (!surveyId) {
      throw new CustomError(
        "Survey Id not doesn't exists",
        400,
        "survey check",
        false
      );
    }

    const survey = await prisma.survey.findUnique({
      where: { id: surveyId },
    });

    if (!survey) {
      console.error("Survey not found for ID:", surveyId);
      throw new CustomError("Survey not found", 404, "survey check", true);
    }
    console.log("survey existense check done for quiz");
    const repsonse = NextResponse.next();

    return repsonse;
  } catch (error) {
    throw error;
  }
};
