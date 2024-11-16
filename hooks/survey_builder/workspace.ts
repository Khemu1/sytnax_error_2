import { useCallback, useState } from "react";
import { WorkSpaceModel } from "@/types/survey";
import {
  createNewWorkspace,
  deleteWorkspace,
  getWorkspaces,
  updateWorkspaceTitle,
} from "@/frontendServices/survey_builder/workspace";

import { useMutation } from "@tanstack/react-query";
import { CustomError } from "@/middleware/CustomError";

export const useGetWorkspaces = () => {
  const [data, setData] = useState<[] | WorkSpaceModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Record<string, string> | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const handleGetWorkspaces = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      setData(await getWorkspaces());
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
  return { handleGetWorkspaces, data, loading, error, success };
};

export const useUpdateWorkspaceTitle = () => {
  const [errorState, setErrorState] = useState<Record<string, string> | null>(
    null
  );

  const mutation = useMutation<
    { title: string },
    CustomError | unknown,
    {
      title: string;
      workspaceId: number;
    }
  >({
    mutationFn: async ({
      title,
      workspaceId,
    }: {
      title: string;
      workspaceId: number;
    }) => {
      setErrorState(null);

      return await updateWorkspaceTitle(workspaceId, title);
    },
    onError: (err: CustomError | unknown) => {
      const message =
        err instanceof CustomError
          ? err.errors || { message: err.message }
          : { message: "Unknown Error" };

      setErrorState(message);
      console.error("Error updating survey title:", err);
    },
  });

  const {
    mutateAsync: handleUpdateWorkspaceTitle,
    isError,
    isSuccess,
    isPending,
  } = mutation;

  return {
    handleUpdateWorkspaceTitle,
    isError,
    isSuccess,
    errorState,
    isPending,
  };
};

export const useDeleteWorkspace = () => {
  const [errorState, setErrorState] = useState<Record<string, string> | null>(
    null
  );

  const mutation = useMutation<
    void,
    CustomError | unknown,
    {
      workspaceId: number;
    }
  >({
    mutationFn: async ({ workspaceId }) => {
      setErrorState(null);

      await deleteWorkspace(workspaceId);
    },
    onError: (err: CustomError | unknown) => {
      const message =
        err instanceof CustomError
          ? err.errors || { message: err.message }
          : { message: "Unknown Error" };
      setErrorState(message);
      console.error("Error deleting survey:", err);
    },
  });

  const {
    mutateAsync: handleDeleteWorkspace,
    isError,
    isSuccess,
    isPending,
  } = mutation;

  return {
    handleDeleteWorkspace,
    isError,
    isSuccess,
    errorState,
    isPending,
  };
};

export const useCreateWorkspace = () => {
  const [errorState, setErrorState] = useState<Record<string, string> | null>(
    null
  );

  const mutation = useMutation<
    WorkSpaceModel,
    CustomError | unknown,
    {
      title: string;
    }
  >({
    mutationFn: async ({ title }) => {
      setErrorState(null);

      const response = await createNewWorkspace(title);
      return response;
    },
    onError: (err: CustomError | unknown) => {
      const message =
        err instanceof CustomError
          ? err.errors || { message: err.message }
          : { message: "Unknown Error" };
      setErrorState(message);
      console.error("Error creating new survey:", err);
    },
  });

  const {
    mutateAsync: handleCreateWorkspace,
    isError,
    isSuccess,
    isPending,
  } = mutation;

  return {
    handleCreateWorkspace,
    isError,
    isSuccess,
    errorState,
    isPending,
  };
};
