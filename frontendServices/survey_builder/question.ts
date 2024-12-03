import { CustomError } from "@/middleware/CustomError";

export const addQuestion = async (question: FormData) => {
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
  questionId: number,
  worksapceAndSurvey: FormData
) => {
  try {
    const response = await fetch(`/api/question/delete/${questionId}`, {
      method: "DELETE",
      body: worksapceAndSurvey,
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
  questionId: number,
  worksapceAndSurvey: FormData
) => {
  try {
    const response = await fetch(`/api/question/duplicate/${questionId}`, {
      method: "POST",
      body: worksapceAndSurvey,
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

export const editQuestion = async (question: FormData) => {
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
