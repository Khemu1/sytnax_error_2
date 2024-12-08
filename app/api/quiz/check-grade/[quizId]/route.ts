import { getQuizSubmission } from "@/backendServices/quiz/quiz";
import { errorHandler } from "@/middleware/CustomError";
import { NextResponse, NextRequest } from "next/server";

interface QuizCheckGradeProps {
  params: Promise<{ quizId: string }>;
}
export const GET = async (
  _req: NextRequest,
  { params }: QuizCheckGradeProps
) => {
  try {
    const { quizId } = await params;
    const data = await getQuizSubmission(quizId);
    console.log("data", data);
    return NextResponse.json(data);
  } catch (error) {
    return errorHandler(error);
  }
};
