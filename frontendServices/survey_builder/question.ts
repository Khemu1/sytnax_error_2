import { CustomError } from "@/middleware/CustomError";
import { QuestionModel } from "@/types/buildSurvey";

export const addQuestion = async (
  question: FormData
): Promise<QuestionModel> => {
  try {
    const response = await fetch(`/api/survey_builder/question`, {
      method: "POST",
      body: question,
    });

    if (!response.ok) {
      const errorData: CustomError = await response.json();

      const errorMessage = errorData.message ?? "Unknown Error Occurred";

      const err = new CustomError(
        errorMessage,
        response.status,
        "getSurveyError",
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

export const deleteQuestion = async (
  questionId: string,
  surveyId: string,
  workspaceId: string
): Promise<string> => {
  try {
    const response = await fetch(`/api/survey_builder/question/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ surveyId, workspaceId, questionId }),
    });

    if (!response.ok) {
      const errorData: CustomError = await response.json();

      const errorMessage = errorData.message ?? "Unknown Error Occurred";

      const err = new CustomError(
        errorMessage,
        response.status,
        "getSurveyError",
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

export const duplicateQuestion = async (
  questionId: string,
  surveyId: string,
  workspaceId: string
): Promise<{ question: QuestionModel; orignalQuestionId: string }> => {
  try {
    const response = await fetch(`/api/survey_builder/question/duplicate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ questionId, surveyId, workspaceId }),
    });

    if (!response.ok) {
      const errorData: CustomError = await response.json();

      const errorMessage = errorData.message ?? "Unknown Error Occurred";

      const err = new CustomError(
        errorMessage,
        response.status,
        "getSurveyError",
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

export const editQuestion = async (
  question: FormData
): Promise<QuestionModel> => {
  try {
    const response = await fetch(`/api/survey_builder/question/edit`, {
      method: "PATCH",

      body: question,
    });

    if (!response.ok) {
      const errorData: CustomError = await response.json();

      const errorMessage = errorData.message ?? "Unknown Error Occurred";

      const err = new CustomError(
        errorMessage,
        response.status,
        "getSurveyError",
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
