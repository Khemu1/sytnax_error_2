import { CustomError } from "@/middleware/CustomError";
import { QuestionModel } from "@/types/buildSurvey";
import { participantAnswers, QuizUserFormProps } from "@/types/quiz";

export function parseAndValidateQuizParticipantFormData(rawFormData: FormData) {
  const userInfoRaw = rawFormData.get("userInfo");
  const userQuizAnswersRaw = rawFormData.get("userQuizAnswers");
  const questionsRaw = rawFormData.get("questions");
  const rawSurveyId = rawFormData.get("surveyId");
  const cleanRaw = rawFormData.get("clean");
  const rawSubmissionDate = rawFormData.get("submissionDate");

  if (!userInfoRaw) {
    throw new CustomError("Missing 'userInfo' field", 400, "new question");
  }
  if (!userQuizAnswersRaw) {
    throw new CustomError(
      "Missing 'userQuizAnswers' field",
      400,
      "new question"
    );
  }
  if (!questionsRaw) {
    throw new CustomError("Missing 'questions' field", 400, "new question");
  }
  if (!rawSurveyId) {
    throw new CustomError("Missing 'surveyId' field", 400, "new question");
  }
  if (!cleanRaw) {
    throw new CustomError("Missing 'clean' field", 400, "new question");
  }
  if (!rawSubmissionDate) {
    throw new CustomError(
      "Missing 'submissionDate' field",
      400,
      "new question"
    );
  }

  try {
    const userInfo = JSON.parse(String(userInfoRaw)) as QuizUserFormProps;
    const userQuizAnswers = JSON.parse(
      String(userQuizAnswersRaw)
    ) as participantAnswers[];
    const questions = JSON.parse(String(questionsRaw)) as Omit<
      QuestionModel,
      "correctAnswers"
    >[];
    const surveyId = JSON.parse(String(rawSurveyId)) as string;
    const clean = JSON.parse(String(cleanRaw)) as boolean;
    const submissionDate = new Date(JSON.parse(String(rawSubmissionDate)));

    return {
      userInfo,
      userQuizAnswers,
      questions,
      surveyId,
      clean,
      submissionDate,
    };
  } catch (error) {
    throw error;
  }
}
