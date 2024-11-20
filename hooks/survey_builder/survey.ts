import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createNewSurvey,
  deleteSurveyFromWorkspace,
  duplicateSurvey,
  getSurvey,
  moveSurveyToWorkspace,
  updateSurveyStatus,
  updateSurveyTitle,
  updateSurveyUrl,
} from "@/frontendServices/survey_builder/survey";
import { useState } from "react";
import {
  SurveyModel,
  UpdateSurveyTitleProps,
  UpdateSurveyTitleResponse,
  UpdateSurveyUrlProps,
} from "@/types/survey";
import { CustomError } from "@/middleware/CustomError";

export const useUpdateSurvey = () => {
  const [errorState, setErrorState] = useState<Record<string, string> | null>(
    null
  );

  const mutation = useMutation<
    UpdateSurveyTitleResponse,
    CustomError | unknown,
    UpdateSurveyTitleProps
  >({
    mutationFn: async ({
      title,
      workspaceId,
      surveyId,
    }: UpdateSurveyTitleProps) => {
      setErrorState(null);

      return await updateSurveyTitle(title, workspaceId, surveyId);
    },
    onError: (err: CustomError | unknown) => {
      const message =
        err instanceof CustomError
          ? err.errors || { message: err.message }
          : { message: "Unknown Error" };

      setErrorState(message);
      console.error("Error updating survey title:", err);
    },
    onSettled: () => {
      console.log("Mutation has either succeeded or failed");
    },
  });

  const {
    mutateAsync: handleUpdateSurvey,
    isError,
    isSuccess,
    isPending,
  } = mutation;

  return {
    handleUpdateSurvey,
    isError,
    isSuccess,
    errorState,
    isPending,
  };
};

export const useUpdateSurveyUrl = () => {
  const [errorState, setErrorState] = useState<Record<string, string> | null>(
    null
  );
  const mutation = useMutation<
    SurveyModel,
    CustomError | unknown,
    UpdateSurveyUrlProps
  >({
    mutationFn: async ({
      workspaceId,
      surveyId,
      url,
    }: UpdateSurveyUrlProps) => {
      setErrorState(null);

      return await updateSurveyUrl(workspaceId, surveyId, url);
    },

    onError: (err: CustomError | unknown) => {
      const message =
        err instanceof CustomError
          ? err.errors || { message: err.message }
          : { message: "Unknown Error" };

      setErrorState(message);
      console.error("Error updating survey title:", err);
    },
    onSettled: () => {
      console.log("Mutation has either succeeded or failed");
    },
  });

  const {
    mutateAsync: handleUpdateSurveyUrl,
    isError,
    isSuccess,
    isPending,
  } = mutation;

  return {
    handleUpdateSurveyUrl,
    isError,
    isSuccess,
    errorState,
    isPending,
  };
};

export const useDuplicateSurvey = () => {
  const [errorState, setErrorState] = useState<Record<string, string> | null>(
    null
  );

  const mutation = useMutation<
    SurveyModel,
    unknown,
    {
      title: string;
      workspaceId: number;
      surveyId: number;
      targetWorkspaceId: number;
    }
  >({
    mutationFn: async ({ title, workspaceId, surveyId, targetWorkspaceId }) => {
      setErrorState(null);

      const response = await duplicateSurvey(
        title,
        workspaceId,
        surveyId,
        targetWorkspaceId
      );
      return response;
    },

    onError: (err: CustomError | unknown) => {
      const message =
        err instanceof CustomError
          ? err.errors || { message: err.message }
          : { message: "Unknown Error" };

      setErrorState(message);
      console.error("Error duplicating survey:", err);
    },
  });

  const { mutateAsync: handleDuplicateSurvey, isError, isSuccess } = mutation;

  return {
    handleDuplicateSurvey,
    isError,
    isSuccess,
    errorState,
  };
};

export const useMoveSurvey = () => {
  const [errorState, setErrorState] = useState<Record<string, string> | null>(
    null
  );

  const mutation = useMutation<
    { targetWorkspaceId: number },
    CustomError | unknown,
    {
      workspaceId: number;
      surveyId: number;
      targetWorkspaceId: number;
    }
  >({
    mutationFn: async ({ workspaceId, surveyId, targetWorkspaceId }) => {
      setErrorState(null);

      return await moveSurveyToWorkspace(
        workspaceId,
        surveyId,
        targetWorkspaceId
      );
    },

    onError: (err: CustomError | unknown) => {
      const message =
        err instanceof CustomError
          ? err.errors || { message: err.message }
          : { message: "Unknown Error" };
      setErrorState(message);
      console.error("Error moving survey:", err);
    },
  });

  const {
    mutateAsync: handleMoveSurvey,
    isError,
    isSuccess,
    isPending,
  } = mutation;

  return {
    handleMoveSurvey,
    isError,
    isSuccess,
    errorState,
    isPending,
  };
};

export const useChangeSurveyStatus = () => {
  const [errorState, setErrorState] = useState<Record<string, string> | null>(
    null
  );

  const mutation = useMutation<
    void,
    CustomError | unknown,
    {
      surveyId: number;
      workspaceId: number;
    }
  >({
    mutationFn: async ({
      surveyId,
      workspaceId,
    }) => {
      setErrorState(null);

      return await updateSurveyStatus(
        workspaceId,
        surveyId,
      );
    },

    onError: (err: CustomError | unknown) => {
      const message =
        err instanceof CustomError
          ? err.errors || { message: err.message }
          : { message: "Unknown Error" };
      setErrorState(message);
      console.error("Error moving survey:", err);
    },
  });

  const {
    mutateAsync: handleUpdateSurveyStatus,
    isError,
    isSuccess,
    isPending,
  } = mutation;

  return {
    handleUpdateSurveyStatus,
    isError,
    isSuccess,
    errorState,
    isPending,
  };
};

export const useDeleteSurvey = () => {
  const [errorState, setErrorState] = useState<Record<string, string> | null>(
    null
  );

  const mutation = useMutation<
    void,
    CustomError | unknown,
    {
      surveyId: string;
      workspaceId: string;
    }
  >({
    mutationFn: async ({ surveyId, workspaceId }) => {
      setErrorState(null);

      await deleteSurveyFromWorkspace(workspaceId, surveyId);
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
    mutateAsync: handleDeleteSurvey,
    isError,
    isSuccess,
    isPending,
  } = mutation;

  return {
    handleDeleteSurvey,
    isError,
    isSuccess,
    errorState,
    isPending,
  };
};

export const useCreateSurvey = () => {
  const [errorState, setErrorState] = useState<Record<string, string> | null>(
    null
  );

  const mutation = useMutation<
    SurveyModel,
    CustomError | unknown,
    {
      title: string;
      workspaceId: number;
    }
  >({
    mutationFn: async ({
      title,
      workspaceId,
    }) => {
      setErrorState(null);

      const response = await createNewSurvey(
        workspaceId,
        title,
      );
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
    mutateAsync: handleCreateSurvey,
    isError,
    isSuccess,
    isPending,
  } = mutation;

  return {
    handleCreateSurvey,
    isError,
    isSuccess,
    errorState,
    isPending,
  };
};

export const useGetSurvey = (
  workspaceId: number,
  surveyId: number,
) => {
  const [errorState, setErrorState] = useState<Record<string, string> | null>(
    null
  );

  const {
    data: survey,
    isError,
    isLoading,
  } = useQuery<SurveyModel, CustomError>({
    queryKey: ["getSurvey", workspaceId, surveyId],
    queryFn: async () => {
      try {
        setErrorState(null);

        const survey = await getSurvey(
          workspaceId,
          surveyId,
        );
        return survey;
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

  return { survey, isError, isLoading, errorState };
};
