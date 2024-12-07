import { parseAndValidateQuizParticipantFormData } from "@/utils/quiz";
import { NextRequest, NextResponse } from "next/server";
import { addQuizParticipant } from "@/backendServices/quiz/quiz";
import { errorHandler } from "@/middleware/CustomError";

export const POST = async (req: NextRequest) => {
  try {
    const rawFormData = await req.formData();
    const data = parseAndValidateQuizParticipantFormData(rawFormData);
    const result = await addQuizParticipant(data);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return errorHandler(error);
  }
};
