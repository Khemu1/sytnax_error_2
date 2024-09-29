import { CustomError } from "@/middleware/CustomError";
import { CustomErrorResponse, EditCourseResponse, RegisterCourseFormProps } from "@/types";

export const addCourse = async (
  form: FormData
): Promise<EditCourseResponse> => {
  try {
    const response = await fetch("/api/courses", {
      method: "POST",
      body: form,
    });

    if (!response.ok) {
      const errorData: CustomErrorResponse = await response.json();
      throw new CustomError(
        errorData.message || "Sign-in failed",
        response.status,
        "SignInError",
        false,
        errorData.details,
        errorData.errors
      );
    }

    const data: EditCourseResponse = await response.json();
    return data;
  } catch (error) {
    if (!(error instanceof CustomError)) {
      throw new CustomError("Network error", 500);
    }
    throw error;
  }
};
export const getAllCourses = async () => {
  try {
    const response = await fetch(`/api/courses`, {
      method: "GET",
    });

    if (!response.ok) {
      const errorData: CustomErrorResponse = await response.json();
      const err = new CustomError(
        errorData.message || "Coudln't get all courses",
        response.status,
        "fetch error",
        true,
        errorData.details,
        errorData.errors
      );
      throw err;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (!(error instanceof CustomError)) {
      throw new CustomError("Network error", 500);
    }
    throw error;
  }
};

export const getCourse = async (id: number) => {
  try {
    const response = await fetch(`/api/courses/${id}`, {
      method: "GET",
    });

    if (!response.ok) {
      const errorData: CustomErrorResponse = await response.json();
      const err = new CustomError(
        errorData.message || "Coudln't get all courses",
        response.status,
        "fetch error",
        true,
        errorData.details,
        errorData.errors
      );
      throw err;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (!(error instanceof CustomError)) {
      throw new CustomError("Network error", 500);
    }
    throw error;
  }
};

export const deleteCourse = async (Ids: number[]) => {
  try {
    const response = await fetch(`/api/courses`, {
      method: "DELETE",
      body: JSON.stringify({ ids: Ids }),
    });

    if (!response.ok) {
      const errorData: CustomErrorResponse = await response.json();
      const err = new CustomError(
        errorData.message || "Couldn't delete course",
        response.status,
        "deletion error",
        true,
        errorData.details,
        errorData.errors
      );
      throw err;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (!(error instanceof CustomError)) {
      throw new CustomError("Network error", 500);
    }
    throw error;
  }
};


export const RegisterToCourse = async (formData: RegisterCourseFormProps) => {
  try {
    const response = await fetch(`/api/courses/register`, {
      method: "POST",
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData: CustomErrorResponse = await response.json();
      const err = new CustomError(
        errorData.message || "Couldn't Register Your Data",
        response.status,
        "data registration error",
        true,
        errorData.details,
        errorData.errors
      );
      throw err;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (!(error instanceof CustomError)) {
      throw new CustomError("Network error", 500);
    }
    throw error;
  }
};