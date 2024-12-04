import { duplicateQuestionService } from "@/backendServices/survey_builder/questionServices";
import { errorHandler } from "@/middleware/CustomError";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { questionId } = await req.json();
    const question = await duplicateQuestionService(questionId);
    return NextResponse.json(
      { question, orignalQuestionId: questionId },
      { status: 200 }
    );
  } catch (error) {
    return errorHandler(error);
  }
};
