import { CustomError } from "@/middleware/CustomError";
import {
  createAdmin,
  deleteAminds,
  editAdmin,
  editDashboardCourse,
  editMyInfo,
  getAdmins,
  getCourseForEdit,
  getCourses,
  getMyInfo,
  getOwners,
} from "@/frontendServices/admin";
import {
  AdminDashboard,
  CourseDashboard,
  EditAdminProps,
  EditCourseResponse,
  EditMyAccountProps,
  GetCourseForEditResponse,
  MyDataDashboard,
  OwnerDashboard,
  SignUpProps,
} from "@/types";
import { useState, useCallback, useEffect } from "react";

export const useGetAdmins = () => {
  const [data, setData] = useState<AdminDashboard[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | Record<string, string> | null>(
    null
  );
  const [success, setSuccess] = useState<boolean>(false);

  const handleGetAdmins = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      setSuccess(true);
      setData(await getAdmins());
    } catch (err: unknown) {
      if (err instanceof CustomError) {
        setError(err.errors || { message: err.message });
      } else {
        setError({ message: "An unknown error occurred." });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { handleGetAdmins, loading, error, success, data };
};

export const useGetOwners = () => {
  const [data, setData] = useState<OwnerDashboard[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | Record<string, string> | null>(
    null
  );
  const [success, setSuccess] = useState<boolean>(false);

  const handleGetOwners = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      setSuccess(true);
      setData(await getOwners());
    } catch (err: unknown) {
      if (err instanceof CustomError) {
        setError(err.errors || { message: err.message });
      } else {
        setError({ message: "An unknown error occurred." });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { handleGetOwners, loading, error, success, data };
};

export const useGetCourses = () => {
  const [data, setData] = useState<CourseDashboard[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | Record<string, string> | null>(
    null
  );
  const [success, setSuccess] = useState<boolean>(false);

  const handleGetCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      setSuccess(true);
      setData(await getCourses());
    } catch (err: unknown) {
      if (err instanceof CustomError) {
        setError(err.errors || { message: err.message });
      } else {
        setError({ message: "An unknown error occurred." });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { handleGetCourses, loading, error, success, data };
};

export const useDeleteAdmins = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Record<string, string> | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleDeleteAdmins = async (Ids: number[]) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await deleteAminds(Ids);
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

  return { handleDeleteAdmins, loading, error, success };
};

export const useCreateAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AdminDashboard | null>(null);
  const [error, setError] = useState<Record<string, string> | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const handleCreateAdmin = async (data: SignUpProps) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      setData(await createAdmin(data));
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
    if (error) {
      timeoutId = setTimeout(() => {
        setError(null);
      }, 3000);
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [error]);

  return { handleCreateAdmin, loading, error, success, data };
};

export const useEditAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AdminDashboard | null>(null);
  const [error, setError] = useState<Record<string, string> | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const handleEditAdmin = async (id: number, data: EditAdminProps) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      setData(await editAdmin(id, data));
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
    if (error) {
      timeoutId = setTimeout(() => {
        setError(null);
      }, 3000);
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [error]);

  return { handleEditAdmin, loading, error, success, data };
};

export const useGetCourseForEdit = () => {
  const [data, setData] = useState<GetCourseForEditResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Record<string, string> | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const handleGetCourse = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      setData(await getCourseForEdit(id));
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

export const useEditDashboardCourse = () => {
  const [data, setData] = useState<EditCourseResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Record<string, string> | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const handleEditCourse = useCallback(async (id: number, form: FormData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      setData(await editDashboardCourse(id, form));
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

  return { data, handleEditCourse, loading, error, success };
};

export const useGetMyInfo = () => {
  const [data, setData] = useState<MyDataDashboard | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Record<string, string> | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const handleGetMyInfo = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      setData(await getMyInfo());
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

  return { data, handleGetMyInfo, loading, error, success };
};

export const useEditMyInfo = () => {
  const [data, setData] = useState<MyDataDashboard | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Record<string, string> | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const handleEditMyInfo = useCallback(async (myData: EditMyAccountProps) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      setData(await editMyInfo(myData));
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

  return { data, handleEditMyInfo, loading, error, success };
};
