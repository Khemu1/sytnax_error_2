import { CustomError } from "@/middleware/CustomError";
import { SurveyParticipantModel } from "@/types/survey";

export const addQuizParticipantService = async (
  quizData: FormData
): Promise<{
  id: string;
  QuizTotalScore: number | null;
  totalUserScore: number | null;
  clean: boolean;
}> => {
  try {
    const response = await fetch(`/api/quiz/add-participant`, {
      method: "POST",

      body: quizData,
    });

    if (!response.ok) {
      const errorData: CustomError = await response.json();

      const errorMessage = errorData.message ?? "Unknown Error Occurred";

      const err = new CustomError(
        errorMessage,
        response.status,
        "addQuizParticipantError",
        true,
        errorData.details,
        errorData.errors
      );
      throw err;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getParticpantForQuiz = async (
  studentId: string,
  surveyId: string
): Promise<SurveyParticipantModel> => {
  try {
    const response = await fetch(`/api/quiz/get-particpant`, {
      method: "POST",
      body: JSON.stringify({ studentId, surveyId }),
    });
    if (!response.ok) {
      const errorData: CustomError = await response.json();

      const errorMessage = errorData.message ?? "Unknown Error Occurred";

      const err = new CustomError(
        errorMessage,
        response.status,
        "getQuizGradesError",
        true,
        errorData.details,
        errorData.errors
      );
      throw err;
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getQuizGrade = async (
  quizId: string
): Promise<{
  totalPoints: number | null;
  givenPoints: number | null;
  cleanSubmission: boolean | null;
  gradesVisibility: "hidden" | "visibleAfterSurveyCloses" | "visible";
  isOpen: boolean;
  endTime: string | null;
}> => {
  try {
    const response = await fetch(`/api/quiz/check-grade/${quizId}`, {
      method: "GET",
    });

    if (!response.ok) {
      const errorData: CustomError = await response.json();

      const errorMessage = errorData.message ?? "Unknown Error Occurred";

      const err = new CustomError(
        errorMessage,
        response.status,
        "getQuizGradesError",
        true,
        errorData.details,
        errorData.errors
      );
      throw err;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
