import { CustomError } from "@/middleware/CustomError";
import {
  authUser,
  checkResetToken,
  resetPassword,
  sendEmail,
  signIn,
} from "@/frontendServices/auth";
import { login } from "@/store/slices/authSlice";
import { RootState } from "@/store/store";
import { SignInProps } from "@/types";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export const useSignIn = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Record<string, string> | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const routeTo = useRouter();
  const dispatch = useDispatch();
  const handleSignIn = async (data: SignInProps) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const { userId, username, role } = await signIn(data);
      localStorage.setItem(
        "userData",
        JSON.stringify({ userId, username, role })
      );
      dispatch(login({ username, userId, role }));
      setSuccess(true);
    } catch (err: unknown) {
      if (err instanceof CustomError) {
        if (err.errors) {
          setError(err.errors);
        } else {
          setError({
            message: err.message,
          });
        }
      } else {
        setError({
          message: "An unknown error occurred.",
        });
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (success) {
      timeoutId = setTimeout(() => {
        routeTo.push("/");
      }, 1000);
    }
    if (error) {
      timeoutId = setTimeout(() => {
        setError(null);
      }, 3000);
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [error, success, routeTo]);

  return { handleSignIn, loading, error, success };
};

export const useAuthUser = () => {
  const routeTo = useRouter();
  const pathName = usePathname();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.auth); // Adjust based on your state structure

  const handleSignIn = useCallback(async () => {
    try {
      const { userId, username, role } = await authUser();
      localStorage.setItem(
        "userData",
        JSON.stringify({ userId, username, role })
      );
      dispatch(login({ username, userId, role }));
    } catch (err) {
      localStorage.removeItem("userData");
      if (pathName.startsWith("/dashboard")) {
        routeTo.push("/signin");
      }
    }
  }, [dispatch, routeTo]);

  useEffect(() => {
    const isAuthPage = pathName.startsWith("/dashboard");

    if (isAuthPage && (!user.isAuthenticated || !user.userId)) {
      handleSignIn();
    }
  }, [handleSignIn, pathName, user]);

  return { handleSignIn };
};

export const useSendEmail = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Record<string, string> | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const handleSendEmail = useCallback(async (email: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await sendEmail(email);
      setSuccess(true);
    } catch (err: unknown) {
      if (err instanceof CustomError) {
        if (err.errors) {
          setError(err.errors);
        } else {
          setError({
            message: err.message,
          });
        }
      } else {
        setError({
          message: "An unknown error occurred.",
        });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (error) {
      timeoutId = setTimeout(() => {
        setError(null);
      }, 3000);
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [error]);

  return { handleSendEmail, loading, error, success };
};
export const useCheckResetToken = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Record<string, string> | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const handleCheckResetToken = useCallback(async (token: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await checkResetToken(token);
      setSuccess(true);
    } catch (err: unknown) {
      if (err instanceof CustomError) {
        if (err.errors) {
          setError(err.errors);
        } else {
          setError({
            message: err.message,
          });
        }
      } else {
        setError({
          message: "An unknown error occurred.",
        });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (error) {
      timeoutId = setTimeout(() => {
        setError(null);
      }, 3000);
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [error]);

  return { handleCheckResetToken, loading, error, success };
};

export const useResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Record<string, string> | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const handleResetPassword = useCallback(async (password: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await resetPassword(password);
      setSuccess(true);
    } catch (err: unknown) {
      if (err instanceof CustomError) {
        if (err.errors) {
          setError(err.errors);
        } else {
          setError({
            message: err.message,
          });
        }
      } else {
        setError({
          message: "An unknown error occurred.",
        });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (error) {
      timeoutId = setTimeout(() => {
        setError(null);
      }, 3000);
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [error]);

  return { handleResetPassword, loading, error, success };
};
