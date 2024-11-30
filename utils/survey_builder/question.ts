import { CustomError } from "@/middleware/CustomError";
import { NewQuestionModel, QuestionOptions } from "@/types/buildSurvey";

export function parseAndValidateNewQuestionFormData(rawFormData: FormData) {
  const questionRaw = rawFormData.get("question");
  const optionsRaw = rawFormData.get("options");
  const workspaceIdRaw = rawFormData.get("workspaceId");
  const surveyIdRaw = rawFormData.get("surveyId");

  if (!questionRaw) {
    throw new CustomError("Missing 'question' field", 400, "new question");
  }
  if (!optionsRaw) {
    throw new CustomError("Missing 'options' field", 400, "new question");
  }
  if (!workspaceIdRaw) {
    throw new CustomError("Missing 'workspaceId' field", 400, "new question");
  }
  if (!surveyIdRaw) {
    throw new CustomError("Missing 'surveyId' field", 400, "new question");
  }

  try {
    const question = JSON.parse(String(questionRaw)) as NewQuestionModel;
    const options = JSON.parse(String(optionsRaw)) as QuestionOptions;
    const workspaceId = JSON.parse(String(workspaceIdRaw)) as string;
    const surveyId = JSON.parse(String(surveyIdRaw)) as string;

    return {
      question,
      options,
      workspaceId,
      surveyId,
    };
  } catch (error) {
    throw error;
  }
}
