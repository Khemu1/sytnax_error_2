import { SurveyPreviewModel } from "@/types/survey";
import { CustomError } from "@/middleware/CustomError";

export const getSurveyForPreview = async (
  surveyPath: string,
): Promise<SurveyPreviewModel> => {
  try {
    const response = await fetch(`/api/preview-survey/${surveyPath}`, {
      method: "GET",
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
