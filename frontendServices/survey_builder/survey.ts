import { CustomError } from "@/middleware/CustomError";
import { SubmissionModelForBuilder } from "@/types/buildSurvey";
import {
  SurveyModel,
  SurveyParticipantModel,
  SurveySettings,
  SurveyStatusResponse,
} from "@/types/survey";

export const updateSurveyTitle = async (
  name: string,
  workspaceId: string,
  surveyId: string
): Promise<SurveyModel> => {
  try {
    const response = await fetch(`/api/survey_builder/survey/update-name`, {
      method: "PATCH",
      body: JSON.stringify({ workspaceId, name, surveyId }),
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

export const duplicateSurvey = async (
  name: string,
  workspaceId: string,
  surveyId: string,
  targetWorkspaceId: string
): Promise<SurveyModel> => {
  try {
    const response = await fetch(`/api/survey_builder/survey/duplicate`, {
      method: "POST",

      body: JSON.stringify({
        workspaceId,
        name,
        targetWorkspaceId,
        surveyId,
      }),
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
): Promise<SurveyModel> => {
  console.log("updateSurveyStatus", workspaceId, surveyId);
  try {
    const response = await fetch(`/api/survey_builder/survey/update-status`, {
      method: "PATCH",
      body: JSON.stringify({ workspaceId, surveyId }),
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
): Promise<{
  soruceWorkspaceId: string;
  surveyId: string;
  targetWorkspaceId: string;
}> => {
  try {
    const response = await fetch(`/api/survey_builder/survey/move`, {
      method: "PATCH",
      body: JSON.stringify({ workspaceId, surveyId, targetWorkspaceId }),
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

export const deleteSurveyFromWorkspace = async (
  workspaceId: string,
  surveyId: string
): Promise<{ workspaceId: string; surveyId: string }> => {
  try {
    const response = await fetch(`/api/survey_builder/survey/delete`, {
      method: "DELETE",
      body: JSON.stringify({ workspaceId, surveyId }),
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
    const response = await fetch(`/api/survey_builder/survey/builder`, {
      method: "POST",
      body: JSON.stringify({ workspaceId, surveyId }),
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

export const getSubmissions = async (
  workspaceId: string,
  surveyId: string
): Promise<SubmissionModelForBuilder[]> => {
  try {
    const response = await fetch(`/api/survey_builder/survey/submissions`, {
      method: "POST",
      body: JSON.stringify({ workspaceId, surveyId }),
    });

    if (!response.ok) {
      const errorData: CustomError = await response.json();

      const errorMessage = errorData.message ?? "Unknown Error Occurred";

      const err = new CustomError(
        errorMessage,
        response.status,
        "getSubmissionsError",
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

export const getSurveyForQuiz = async (
  surveyId: string
): Promise<Omit<SurveyStatusResponse, "correctAnswers">> => {
  try {
    const response = await fetch(`/api/quiz/${surveyId}`, {
      method: "GET",
    });

    console.log("response", response);

    if (!response.ok) {
      const errorData: CustomError = await response.json();

      const errorMessage = errorData.message ?? "Unknown Error Occurred";

      const err = new CustomError(
        errorMessage,
        response.status,
        "getSurveyForQuizError",
        true,
        errorData.details,
        errorData.errors
      );
      throw err;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateSurveySettings = async (
  workspaceId: string,
  surveyId: string,
  settings: SurveySettings
) => {
  try {
    const response = await fetch(`/api/survey_builder/survey/update-settings`, {
      method: "PATCH",
      body: JSON.stringify({ workspaceId, settings, surveyId }),
    });

    if (!response.ok) {
      const errorData: CustomError = await response.json();

      const errorMessage = errorData.message ?? "Unknown Error Occurred";

      const err = new CustomError(
        errorMessage,
        response.status,
        "updateSruveySettingsError",
        true,
        errorData.details,
        errorData.errors
      );
      throw err;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const getSurveyParticipants = async (
  workspaceId: string,
  surveyId: string
): Promise<SurveyParticipantModel[]> => {
  try {
    const response = await fetch(`/api/survey_builder/survey/get-members`, {
      method: "POST",
      body: JSON.stringify({ workspaceId, surveyId }),
    });

    if (!response.ok) {
      const errorData: CustomError = await response.json();

      const errorMessage = errorData.message ?? "Unknown Error Occurred";

      const err = new CustomError(
        errorMessage,
        response.status,
        "getSurveyParticipantsError",
        true,
        errorData.details,
        errorData.errors
      );
      throw err;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const addMembersToSurvey = async (
  workspaceId: string,
  surveyId: string,
  members: string[]
): Promise<{ members: SurveyParticipantModel[]; surveyId: string }> => {
  try {
    const response = await fetch(`/api/survey_builder/survey/add-members`, {
      method: "POST",
      body: JSON.stringify({ workspaceId, surveyId, members }),
    });

    if (!response.ok) {
      const errorData: CustomError = await response.json();

      const errorMessage = errorData.message ?? "Unknown Error Occurred";

      const err = new CustomError(
        errorMessage,
        response.status,
        "addMembersToSurveyError",
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

export const removeMembersFromSurvey = async (
  workspaceId: string,
  surveyId: string,
  members: string[]
): Promise<{ members: SurveyParticipantModel[]; surveyId: string }> => {
  try {
    const response = await fetch(`/api/survey_builder/survey/remove-members`, {
      method: "DELETE",
      body: JSON.stringify({ workspaceId, surveyId, members }),
    });

    if (!response.ok) {
      const errorData: CustomError = await response.json();

      const errorMessage = errorData.message ?? "Unknown Error Occurred";

      const err = new CustomError(
        errorMessage,
        response.status,
        "removeMembersFromSurveyError",
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

export const resetMembersAttempts = async (
  workspaceId: string,
  surveyId: string,
  members: string[]
): Promise<{ members: SurveyParticipantModel[]; surveyId: string }> => {
  try {
    const response = await fetch(`/api/survey_builder/survey/reset-attempts`, {
      method: "PATCH",
      body: JSON.stringify({ workspaceId, surveyId, members }),
    });

    if (!response.ok) {
      const errorData: CustomError = await response.json();

      const errorMessage = errorData.message ?? "Unknown Error Occurred";

      const err = new CustomError(
        errorMessage,
        response.status,
        "resetMembersAttemptsError",
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

export const deleteAllMembers = async (
  workspaceId: string,
  surveyId: string
): Promise<{ surveyId: string }> => {
  try {
    const response = await fetch(
      `/api/survey_builder/survey/delete-all-members`,
      {
        method: "DELETE",
        body: JSON.stringify({ workspaceId, surveyId }),
      }
    );

    if (!response.ok) {
      const errorData: CustomError = await response.json();

      const errorMessage = errorData.message ?? "Unknown Error Occurred";

      const err = new CustomError(
        errorMessage,
        response.status,
        "deleteAllMembersAttemptsError",
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

export const resetAllMembersAttempts = async (
  workspaceId: string,
  surveyId: string
): Promise<{ surveyId: string }> => {
  try {
    const response = await fetch(
      `/api/survey_builder/survey/reset-all-attempts`,
      {
        method: "PATCH",
        body: JSON.stringify({ workspaceId, surveyId }),
      }
    );

    if (!response.ok) {
      const errorData: CustomError = await response.json();

      const errorMessage = errorData.message ?? "Unknown Error Occurred";

      const err = new CustomError(
        errorMessage,
        response.status,
        "resetAllMembersAttemptsError",
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
