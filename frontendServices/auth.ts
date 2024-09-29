import { CustomError } from "@/middleware/CustomError";
import { CustomErrorResponse, SignInProps, SignInResponseProps } from "@/types";

export const signIn = async (
  formData: SignInProps
): Promise<SignInResponseProps> => {
  try {
    const response = await fetch("/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData: CustomErrorResponse = await response.json();
      const err = new CustomError(
        errorData.message || "Sign-in failed",
        response.status,
        "SignInError",
        false,
        errorData.details,
        errorData.errors
      );
      throw err;
    }

    const data: SignInResponseProps = await response.json();
    return data;
  } catch (error) {
    if (!(error instanceof CustomError)) {
      throw new CustomError("Network error", 500);
    }
    throw error;
  }
};

export const authUser = async (): Promise<SignInResponseProps> => {
  try {
    const response = await fetch("/api/auth/auth-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData: CustomErrorResponse = await response.json();
      const err = new CustomError(
        errorData.message || "Sign-in failed",
        response.status,
        "SignInError",
        false,
        errorData.details,
        errorData.errors
      );
      throw err;
    }

    const data: SignInResponseProps = await response.json();
    return data;
  } catch (error) {
    if (!(error instanceof CustomError)) {
      throw new CustomError("Network error", 500);
    }
    throw error;
  }
};

export const signoutUser = async () => {
  try {
    const response = await fetch("/api/auth/auth-user", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData: CustomErrorResponse = await response.json();
      const err = new CustomError(
        errorData.message || "Sign-out failed",
        response.status,
        "SignOutError",
        false,
        errorData.details,
        errorData.errors
      );
      throw err;
    }

    return;
  } catch (error) {
    if (!(error instanceof CustomError)) {
      throw new CustomError("Network error", 500);
    }
    throw error;
  }
};

export const sendEmail = async (email: string) => {
  try {
    const response = await fetch("/api/auth/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(email),
    });

    if (!response.ok) {
      const errorData: CustomErrorResponse = await response.json();
      const err = new CustomError(
        errorData.message || "Email Varfication Failed",
        response.status,
        "email varfication ",
        true,
        errorData.details,
        errorData.errors
      );
      throw err;
    }

    return;
  } catch (error) {
    if (!(error instanceof CustomError)) {
      throw new CustomError("Network error", 500);
    }
    throw error;
  }
};

export const resetPassword = async (password: string) => {
  try {
    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(password),
    });

    if (!response.ok) {
      const errorData: CustomErrorResponse = await response.json();
      const err = new CustomError(
        errorData.message || "PassWord Reset Failed",
        response.status,
        "password reset",
        true,
        errorData.details,
        errorData.errors
      );
      throw err;
    }

    return;
  } catch (error) {
    if (!(error instanceof CustomError)) {
      throw new CustomError("Network error", 500);
    }
    throw error;
  }
};

export const checkResetToken = async (token: string) => {
  try {
    const response = await fetch("/api/auth/check-reset-password-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(token),
    });

    if (!response.ok) {
      const errorData: CustomErrorResponse = await response.json();
      const err = new CustomError(
        errorData.message || "PassWord Reset Failed",
        response.status,
        "password reset",
        true,
        errorData.details,
        errorData.errors
      );
      throw err;
    }

    return;
  } catch (error) {
    if (!(error instanceof CustomError)) {
      throw new CustomError("Network error", 500);
    }
    throw error;
  }
};
