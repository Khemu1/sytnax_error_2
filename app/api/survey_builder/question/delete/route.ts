import { deleteQuestionService } from "@/backendServices/survey_builder/questionServices";
import { errorHandler } from "@/middleware/CustomError";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (req: NextRequest) => {
  try {
    const { questionId } = await req.json();
    await deleteQuestionService(questionId);
    return NextResponse.json(questionId, { status: 200 });
  } catch (error) {
    return errorHandler(error);
  }
};
