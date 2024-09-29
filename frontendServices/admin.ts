import { CustomError } from "@/middleware/CustomError";
import {
  AdminDashboard,
  CourseDashboard,
  CustomErrorResponse,
  EditAdminProps,
  EditCourseResponse,
  EditMyAccountProps,
  GetCourseForEditResponse,
  MyDataDashboard,
  OwnerDashboard,
  SignUpProps,
} from "@/types";

export const getMyInfo = async (): Promise<MyDataDashboard> => {
  try {
    const response = await fetch("/api/dashboard/myinfo", {
      method: "GET",
    });

    if (!response.ok) {
      const errorData: CustomErrorResponse = await response.json();
      const err = new CustomError(
        errorData.message || "data fetch failed",
        response.status,
        "data fetch",
        false,
        errorData.details,
        errorData.errors
      );
      throw err;
    }

    const data: MyDataDashboard = await response.json();
    return data;
  } catch (error) {
    if (!(error instanceof CustomError)) {
      throw new CustomError("Network error", 500);
    }
    throw error;
  }
};

export const editMyInfo = async (
  myData: EditMyAccountProps
): Promise<MyDataDashboard> => {
  try {
    const response = await fetch("/api/dashboard/myinfo", {
      method: "PUT",
      body: JSON.stringify(myData),
    });

    if (!response.ok) {
      const errorData: CustomErrorResponse = await response.json();
      const err = new CustomError(
        errorData.message || "data fetch failed",
        response.status,
        "data fetch",
        false,
        errorData.details,
        errorData.errors
      );
      throw err;
    }

    const data: MyDataDashboard = await response.json();
    return data;
  } catch (error) {
    if (!(error instanceof CustomError)) {
      throw new CustomError("Network error", 500);
    }
    throw error;
  }
};

export const getCourses = async (): Promise<CourseDashboard[]> => {
  try {
    const response = await fetch("/api/dashboard/courses", {
      method: "GET",
    });

    if (!response.ok) {
      const errorData: CustomErrorResponse = await response.json();
      const err = new CustomError(
        errorData.message || "data fetch failed",
        response.status,
        "data fetch",
        false,
        errorData.details,
        errorData.errors
      );
      throw err;
    }

    const data: CourseDashboard[] = await response.json();
    return data;
  } catch (error) {
    if (!(error instanceof CustomError)) {
      throw new CustomError("Network error", 500);
    }
    throw error;
  }
};
export const getOwners = async (): Promise<OwnerDashboard[]> => {
  try {
    const response = await fetch("/api/dashboard/owners", {
      method: "GET",
    });

    if (!response.ok) {
      const errorData: CustomErrorResponse = await response.json();
      const err = new CustomError(
        errorData.message || "data fetch failed",
        response.status,
        "data fetch",
        false,
        errorData.details,
        errorData.errors
      );
      throw err;
    }

    const data: OwnerDashboard[] = await response.json();
    return data;
  } catch (error) {
    if (!(error instanceof CustomError)) {
      throw new CustomError("Network error", 500);
    }
    throw error;
  }
};
export const getAdmins = async (): Promise<AdminDashboard[]> => {
  try {
    const response = await fetch("/api/dashboard/admins", {
      method: "GET",
    });

    if (!response.ok) {
      const errorData: CustomErrorResponse = await response.json();
      const err = new CustomError(
        errorData.message || "data fetch failed",
        response.status,
        "data fetch",
        false,
        errorData.details,
        errorData.errors
      );
      throw err;
    }

    const data: AdminDashboard[] = await response.json();
    return data;
  } catch (error) {
    if (!(error instanceof CustomError)) {
      throw new CustomError("Network error", 500);
    }
    throw error;
  }
};

export const deleteAminds = async (
  ids: number[]
): Promise<AdminDashboard[]> => {
  try {
    const response = await fetch("/api/dashboard/admins", {
      method: "DELETE",
      body: JSON.stringify({ ids: ids }),
    });

    if (!response.ok) {
      const errorData: CustomErrorResponse = await response.json();
      const err = new CustomError(
        errorData.message || "deletion failed",
        response.status,
        "deletion",
        false,
        errorData.details,
        errorData.errors
      );
      throw err;
    }

    const data: AdminDashboard[] = await response.json();
    return data;
  } catch (error) {
    if (!(error instanceof CustomError)) {
      throw new CustomError("Network error", 500);
    }
    throw error;
  }
};

export const editAdmin = async (
  id: number,
  adminData: EditAdminProps
): Promise<AdminDashboard> => {
  try {
    const response = await fetch(`/api/dashboard/admins`, {
      method: "PUT",
      body: JSON.stringify({ admin: adminData, id: id }),
    });

    if (!response.ok) {
      const errorData: CustomErrorResponse = await response.json();
      console.log(errorData);
      const err = new CustomError(
        errorData.message || "edit failed",
        response.status,
        "edit",
        false,
        errorData.details,
        errorData.errors
      );
      throw err;
    }

    const data: AdminDashboard = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    if (!(error instanceof CustomError)) {
      throw new CustomError("Network error", 500);
    }
    throw error;
  }
};

export const createAdmin = async (
  newAdmin: SignUpProps
): Promise<AdminDashboard> => {
  try {
    const response = await fetch(`/api/dashboard/admins`, {
      method: "POST",
      body: JSON.stringify(newAdmin),
    });

    if (!response.ok) {
      const errorData: CustomErrorResponse = await response.json();
      const err = new CustomError(
        errorData.message || "edit failed",
        response.status,
        "edit",
        false,
        errorData.details,
        errorData.errors
      );
      throw err;
    }

    const data: AdminDashboard = await response.json();
    return data;
  } catch (error) {
    if (!(error instanceof CustomError)) {
      throw new CustomError("Network error", 500);
    }
    throw error;
  }
};

export const getCourseForEdit = async (
  id: number
): Promise<GetCourseForEditResponse> => {
  try {
    const response = await fetch(`/api/dashboard/courses/${id}`, {
      method: "GET",
    });

    if (!response.ok) {
      const errorData: CustomErrorResponse = await response.json();
      const err = new CustomError(
        errorData.message || "data fetch faild",
        response.status,
        "fetch",
        false,
        errorData.details,
        errorData.errors
      );
      throw err;
    }

    const data: GetCourseForEditResponse = await response.json();
    return data;
  } catch (error) {
    if (!(error instanceof CustomError)) {
      throw new CustomError("Network error", 500);
    }
    throw error;
  }
};

export const editDashboardCourse = async (
  id: number,
  form: FormData
): Promise<EditCourseResponse> => {
  try {
    const response = await fetch(`/api/dashboard/courses/${id}`, {
      method: "PUT",
      body: form,
    });

    if (!response.ok) {
      const errorData: CustomErrorResponse = await response.json();
      const err = new CustomError(
        errorData.message || "Data Update Failed",
        response.status,
        "PUT",
        false,
        errorData.details,
        errorData.errors
      );
      throw err;
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
