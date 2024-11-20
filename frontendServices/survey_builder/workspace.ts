import { WorkSpaceModel } from "@/types/survey";
import { CustomError } from "@/middleware/CustomError";

export const getWorkspaces = async (): Promise<WorkSpaceModel[]> => {
  try {
    const response = await fetch(
      "/api/survey_builder/workspace/get-workspaces",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData: CustomError = await response.json();
      const err = new CustomError(
        errorData.message || "Sign-in failed",
        response.status,
        "SignInError",
        true,
        errorData.details,
        errorData.errors
      );
      throw err;
    }

    const data: WorkSpaceModel[] = await response.json();
    return data;
  } catch (error) {
    if (!(error instanceof CustomError)) {
      throw new CustomError("Network error", 500);
    }
    throw error;
  }
};

export const createNewWorkspace = async (
  name: string
): Promise<{ workspace: WorkSpaceModel }> => {
  try {
    const response = await fetch(
      `/api/survey_builder/workspace/add-workspace`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      }
    );

    if (!response.ok) {
      const errorData: CustomError = await response.json();

      const errorMessage = errorData.message ?? "Unknown Error Occurred";

      const err = new CustomError(
        errorMessage,
        response.status,
        "addWorkspaceError",
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

export const updateWorkspaceName = async (
  workspaceId: string,
  name: string
): Promise<{ workspace: WorkSpaceModel }> => {
  try {
    const response = await fetch(
      `/api/survey_builder/workspace/${workspaceId}/update-name`,
      {
        method: "PATCH",

        body: JSON.stringify({ name }),
      }
    );

    if (!response.ok) {
      const errorData: CustomError = await response.json();

      const errorMessage = errorData.message ?? "Unknown Error Occurred";

      const err = new CustomError(
        errorMessage,
        response.status,
        "addWorkspaceError",
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

export const deleteWorkspace = async (
  workspaceId: string
): Promise<{ workspaceId: string }> => {
  try {
    const response = await fetch(
      `/api/survey_builder/workspace/${workspaceId}/delete`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const errorData: CustomError = await response.json();

      const errorMessage = errorData.message ?? "Unknown Error Occurred";

      const err = new CustomError(
        errorMessage,
        response.status,
        "addWorkspaceError",
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
