import { getParticpantForQuizService } from "@/backendServices/quiz/quiz";
import { errorHandler } from "@/middleware/CustomError";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { studentId, surveyId } = (await req.json()) as {
      studentId: string;
      surveyId: string;
    };
    const participant = await getParticpantForQuizService(studentId, surveyId);
    return NextResponse.json(participant, { status: 200 });
  } catch (error) {
    return errorHandler(error);
  }
};
