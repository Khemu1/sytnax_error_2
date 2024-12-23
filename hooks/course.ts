import { CustomError } from "@/middleware/CustomError";
import {
  addCourse,
  deleteCourse,
  getAllCourses,
  getCourse,
  RegisterToCourse,
} from "@/frontendServices/course"; // Ensure the correct import
import {
  EditCourseResponse,
  PublicCardCourseProps,
  PublicCourseProps,
  RegisterCourseFormProps,
} from "@/types";
import { useCallback, useState } from "react";

export const useAddCourse = () => {
  const [data, setData] = useState<EditCourseResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Record<string, string> | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleAddCourse = async (form: FormData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      setSuccess(true);
      setData(await addCourse(form));
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

  return { handleAddCourse, loading, error, success, data };
};

export const useGetAllCourses = () => {
  const [data, setData] = useState<PublicCardCourseProps[] | []>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Record<string, string> | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const handleGetAllCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      setData(await getAllCourses());
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

  return { data, handleGetAllCourses, loading, error, success };
};

export const useGetCourse = () => {
  const [data, setData] = useState<PublicCourseProps | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Record<string, string> | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const handleGetCourse = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      setData(await getCourse(id));
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

  return { data, handleGetCourse, loading, error, success };
};

export const useDeleteCourse = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Record<string, string> | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleDeleteCourse = async (Ids: number[]) => {
    setLoading(true);
    setError(null);
    setSuccess(false); // Reset success at the beginning
    try {
      await deleteCourse(Ids);
      setSuccess(true); // Set success after successful deletion
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

  return { handleDeleteCourse, loading, error, success };
};

export const useRegisterCourse = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Record<string, string> | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleRegisterCourse = async (formData: RegisterCourseFormProps) => {
    setLoading(true);
    setError(null);
    setSuccess(false); // Reset success at the beginning
    try {
      await RegisterToCourse(formData);
      setSuccess(true); // Set success after successful deletion
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

  return { handleRegisterCourse, loading, error, success };
};
