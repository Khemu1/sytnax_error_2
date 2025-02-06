import { updateQuestionService } from "@/backendServices/survey_builder/questionServices";
import { errorHandler } from "@/middleware/CustomError";
import { parseAndValidateEditQuestionFormData } from "@/utils/survey_builder/question";
import { NextResponse, NextRequest } from "next/server";

export const PATCH = async (req: NextRequest) => {
  try {
    const rawFormData = await req.formData();
    const formData = parseAndValidateEditQuestionFormData(rawFormData);


    const question = await updateQuestionService(formData);
    return NextResponse.json(question, {
      status: 200,
    });
  } catch (error) {
    return errorHandler(error);
  }
};
