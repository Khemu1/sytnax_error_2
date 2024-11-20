import { CustomError } from "@/middleware/CustomError";

export const addUserToGroup = async (
  groupId: string,
  groupName: string,
  username: string,
) => {
  try {
    const response = await fetch("/api/group/add-user", {
      method: "POST",
      body: JSON.stringify({ username, groupId, groupName }),
    });

    if (!response.ok) {
      const errorData: CustomError = await response.json();

      const errorMessage = errorData.message ?? "Unknown Error Occurred";

      const err = new CustomError(
        errorMessage,
        response.status,
        "addUserToGroup",
        true,
        errorData.details,
        errorData.errors
      );
      throw err;
    }

    return response.json();
  } catch (error) {
    if (!(error instanceof CustomError)) {
      throw new CustomError("Network error", 500);
    }
    throw error;
  }
};

export const removeUserFromGroup = async (
  groupId: string,
  userId: number,
) => {
  try {
    const response = await fetch("/api/group/remove-user", {
      method: "DELETE",

      body: JSON.stringify({ userId, groupId }),
    });

    if (!response.ok) {
      const errorData: CustomError = await response.json();

      const errorMessage = errorData.message ?? "Unknown Error Occurred";

      const err = new CustomError(
        errorMessage,
        response.status,
        "removeUserFromGroup",
        true,
        errorData.details,
        errorData.errors
      );
      throw err;
    }

    return response.json();
  } catch (error) {
    if (!(error instanceof CustomError)) {
      throw new CustomError("Network error", 500);
    }
    throw error;
  }
};
