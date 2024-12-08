import { CustomError } from "@/middleware/CustomError";
import { PrismaClient } from "@prisma/client/edge";
import { NextRequest, NextResponse } from "next/server";
import { withAccelerate } from "@prisma/extension-accelerate";
import { QuizParticipantFormProps } from "@/types/quiz";
import { validateWithSchema } from "@/utils/validations/validations";
import { newQuizSchema, quizUserFormschema } from "@/utils/validations/quiz";
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
    console.log("found survey for quiz");

    if (!survey.startTime || !survey.endTime) {
      throw new CustomError(
        "Survey has no intervals",
        403,
        "noIntervals",
        true
      );
    }
    console.log("survey has intervals");
    const currrentDate = new Date();
    const startTime = new Date(survey.startTime);
    const endTime = new Date(survey.endTime);
    if (!startTime || !endTime) {
      throw new CustomError("Survey is closed", 403, "surveyIntervals", true);
    }
    if (currrentDate < startTime || currrentDate > endTime) {
      throw new CustomError("Survey is not open", 403, "getSurveyError", true);
    }

    console.log("survey existense check done for quiz");
    const repsonse = NextResponse.next();

    return repsonse;
  } catch (error) {
    throw error;
  }
};

export const validateQuizParticipant = async (
  _req: NextRequest,
  data: QuizParticipantFormProps
) => {
  try {
    quizUserFormschema().parse(data.userInfo);
    newQuizSchema().parse({ ...data.userQuizAnswers, ...data.questions });
    return NextResponse.next();
  } catch (error) {
    throw new CustomError(
      "Invalid data",
      400,
      "validateQuizParticipant",
      true,
      "",
      validateWithSchema(error)
    );
  }
};
