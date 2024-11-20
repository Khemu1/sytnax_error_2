import { useState } from "react";
import { WorkSpaceModel } from "@/types/survey";
import {
  createNewWorkspace,
  deleteWorkspace,
  getWorkspaces,
  updateWorkspaceName,
} from "@/frontendServices/survey_builder/workspace";

import { useMutation, useQuery } from "@tanstack/react-query";
import { CustomError } from "@/middleware/CustomError";
import {
  addNewWorkspaceF,
  deleteWorkspaceF,
  updateWorkspaceF,
} from "@/utils/survey_builder/workspace";
import { useDispatch } from "react-redux";

export const useGetWorkspaces = () => {
  const [errorState, setErrorState] = useState<Record<string, string> | null>(
    null
  );

  const {
    data: workspaces,
    isError,
    isLoading,
    isSuccess,
  } = useQuery<WorkSpaceModel[], CustomError>({
    queryKey: ["getWorkspaces"],
    queryFn: async () => {
      try {
        setErrorState(null);
        return await getWorkspaces();
      } catch (error) {
        const message =
          error instanceof CustomError
            ? error.errors || { message: error.message }
            : { message: "Unknown Error" };
        setErrorState(message);
        throw error;
      }
    },
  });

  return {
    workspaces,
    isLoading,
    isError,
    isSuccess,
    errorState,
  };
};

export const useUpdateWorkspaceName = () => {
  const dispatch = useDispatch();
  const [errorState, setErrorState] = useState<Record<string, string> | null>(
    null
  );

  const mutation = useMutation<
    { workspace: WorkSpaceModel },
    CustomError | unknown,
    {
      name: string;
      workspaceId: string;
    }
  >({
    mutationFn: async ({
      name,
      workspaceId,
    }: {
      name: string;
      workspaceId: string;
    }) => {
      setErrorState(null);

      return await updateWorkspaceName(workspaceId, name);
    },
    onSuccess: async ({ workspace }) => {
      await updateWorkspaceF(workspace.id, workspace, dispatch);
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
    mutateAsync: handleUpdateWorkspaceName,
    isError,
    isSuccess,
    isPending,
  } = mutation;

  return {
    handleUpdateWorkspaceName,
    isError,
    isSuccess,
    errorState,
    isPending,
  };
};

export const useDeleteWorkspace = () => {
  const dispatch = useDispatch();
  const [errorState, setErrorState] = useState<Record<string, string> | null>(
    null
  );

  const mutation = useMutation<
    { workspaceId: string },
    CustomError | unknown,
    {
      workspaceId: string;
    }
  >({
    mutationFn: async ({ workspaceId }) => {
      setErrorState(null);

      return await deleteWorkspace(workspaceId);
    },
    onSuccess: async ({ workspaceId }) => {
      await deleteWorkspaceF(workspaceId, dispatch);
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
  const dispatch = useDispatch();
  const [errorState, setErrorState] = useState<Record<string, string> | null>(
    null
  );

  const mutation = useMutation<
    { workspace: WorkSpaceModel },
    CustomError | unknown,
    {
      name: string;
    }
  >({
    mutationFn: async ({ name }) => {
      setErrorState(null);

      const response = await createNewWorkspace(name);
      return response;
    },
    onSuccess: async ({ workspace }) => {
      await addNewWorkspaceF(workspace, dispatch);
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
