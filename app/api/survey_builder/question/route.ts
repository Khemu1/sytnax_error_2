import { addQuestionService } from "@/backendServices/survey_builder/questionServices";
import { errorHandler } from "@/middleware/CustomError";
import { parseAndValidateNewQuestionFormData } from "@/utils/survey_builder/question";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const rawFormData = await req.formData();
    const formData = parseAndValidateNewQuestionFormData(rawFormData);
    const questoin = await addQuestionService(formData);
    return NextResponse.json(questoin, { status: 201 });
  } catch (error) {
    return errorHandler(error);
  }
};
