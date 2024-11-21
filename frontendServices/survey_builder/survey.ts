import { CustomError } from "@/middleware/CustomError";
import { SurveyModel, UpdateSurveyTitleResponse } from "@/types/survey";

export const updateSurveyTitle = async (
  name: string,
  workspaceId: string,
  surveyId: string
): Promise<UpdateSurveyTitleResponse> => {
  try {
    const response = await fetch(
      `/api/survey_builder/survey/${surveyId}/update-name`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ workspaceId, name }),
      }
    );

    if (!response.ok) {
      const errorData: CustomError = await response.json();

      const errorMessage = errorData.message ?? "Unknown Error Occurred";

      const err = new CustomError(
        errorMessage,
        response.status,
        "MoveSurveyError",
        true,
        errorData.details,
        errorData.errors
      );
      throw err;
    }

    const data: UpdateSurveyTitleResponse = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const duplicateSurvey = async (
  title: string,
  workspaceId: string,
  surveyId: string,
  targetWorkspaceId: number
): Promise<SurveyModel> => {
  try {
    const response = await fetch(`/api/survey/${surveyId}/duplicate`, {
      method: "POST",

      body: JSON.stringify({ workspaceId, title, targetWorkspaceId }),
    });

    if (!response.ok) {
      const errorData: CustomError = await response.json();

      const errorMessage = errorData.message ?? "Unknown Error Occurred";

      const err = new CustomError(
        errorMessage,
        response.status,
        "MoveSurveyError",
        true,
        errorData.details,
        errorData.errors
      );
      throw err;
    }

    const data: SurveyModel = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateSurveyStatus = async (
  workspaceId: string,
  surveyId: string
): Promise<void> => {
  console.log("updateSurveyStatus", workspaceId, surveyId);
  try {
    const response = await fetch(`/api/survey/${surveyId}/update-status`, {
      method: "PATCH",
      body: JSON.stringify({ workspaceId }),
    });

    if (!response.ok) {
      const errorData: CustomError = await response.json();

      const errorMessage = errorData.message ?? "Unknown Error Occurred";

      const err = new CustomError(
        errorMessage,
        response.status,
        "MoveSurveyError",
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

export const moveSurveyToWorkspace = async (
  workspaceId: string,
  surveyId: string,
  targetWorkspaceId: string
): Promise<{ targetWorkspaceId: string }> => {
  try {
    const response = await fetch(
      `/api/survey_builder/survey/${surveyId}/move`,
      {
        method: "PATCH",
        body: JSON.stringify({ workspaceId, surveyId, targetWorkspaceId }),
      }
    );

    if (!response.ok) {
      const errorData: CustomError = await response.json();

      const errorMessage = errorData.message ?? "Unknown Error Occurred";

      const err = new CustomError(
        errorMessage,
        response.status,
        "MoveSurveyError",
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

export const deleteSurveyFromWorkspace = async (
  workspaceId: string,
  surveyId: string
): Promise<void> => {
  try {
    const response = await fetch(
      `/api/survey_builder/survey/${surveyId}/delete`,
      {
        method: "DELETE",
        body: JSON.stringify({ workspaceId }),
      }
    );

    if (!response.ok) {
      const errorData: CustomError = await response.json();

      const errorMessage = errorData.message ?? "Unknown Error Occurred";

      const err = new CustomError(
        errorMessage,
        response.status,
        "DELETESurveyError",
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

export const createNewSurvey = async (
  workspaceId: string,
  name: string
): Promise<SurveyModel> => {
  try {
    const response = await fetch(`/api/survey_builder/survey/add-survey`, {
      method: "POST",
      body: JSON.stringify({ workspaceId, name }),
    });

    if (!response.ok) {
      const errorData: CustomError = await response.json();

      const errorMessage = errorData.message ?? "Unknown Error Occurred";

      const err = new CustomError(
        errorMessage,
        response.status,
        "DELETESurveyError",
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

export const getSurvey = async (
  workspaceId: string,
  surveyId: string
): Promise<SurveyModel> => {
  try {
    const response = await fetch(
      `/api/survey_builder/survey/builder/${workspaceId}/${surveyId}`,
      {
        method: "GET",
      }
    );

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

export const updateSurveyUrl = async (
  workspaceId: string,
  surveyId: string,
  url: string
) => {
  try {
    const response = await fetch(`/api/survey/${surveyId}/update-url`, {
      method: "PATCH",

      body: JSON.stringify({ workspaceId, url }),
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
