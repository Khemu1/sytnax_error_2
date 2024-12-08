import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createNewSurvey,
  deleteSurveyFromWorkspace,
  duplicateSurvey,
  getSubmissions,
  getSurvey,
  moveSurveyToWorkspace,
  updateSurveySettings,
  updateSurveyStatus,
  updateSurveyTitle,
} from "@/frontendServices/survey_builder/survey";
import { useState } from "react";
import {
  SurveyModel,
  SurveySettings,
  UpdateSurveyTitleProps,
} from "@/types/survey";
import { CustomError } from "@/middleware/CustomError";
import {
  addSurveyF,
  deleteSurveyF,
  moveSurveyF,
  updateSurveyF,
  duplicateSurveyF,
} from "@/utils/survey_builder/survey";
import { useDispatch } from "react-redux";
import { SubmissionModelForBuilder } from "@/types/buildSurvey";

export const useUpdateSurvey = () => {
  const dispatch = useDispatch();
  const [errorState, setErrorState] = useState<Record<string, string> | null>(
    null
  );

  const mutation = useMutation<
    SurveyModel,
    CustomError | unknown,
    UpdateSurveyTitleProps
  >({
    mutationFn: async ({
      name,
      workspaceId,
      surveyId,
    }: UpdateSurveyTitleProps) => {
      setErrorState(null);

      return await updateSurveyTitle(name, workspaceId, surveyId);
    },
    onError: (err: CustomError | unknown) => {
      const message =
        err instanceof CustomError
          ? err.errors || { message: err.message }
          : { message: "Unknown Error" };

      setErrorState(message);
      console.error("Error updating survey title:", err);
    },
    onSuccess: async (survey) => {
      updateSurveyF(survey, dispatch);
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

export const useDuplicateSurvey = () => {
  const dispatch = useDispatch();
  const [errorState, setErrorState] = useState<Record<string, string> | null>(
    null
  );

  const mutation = useMutation<
    SurveyModel,
    unknown,
    {
      name: string;
      workspaceId: string;
      surveyId: string;
      targetWorkspaceId: string;
    }
  >({
    mutationFn: async ({ name, workspaceId, surveyId, targetWorkspaceId }) => {
      setErrorState(null);

      const response = await duplicateSurvey(
        name,
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
    onSuccess: (data) => {
      duplicateSurveyF(data, dispatch);
    },
  });

  const {
    mutateAsync: handleDuplicateSurvey,
    isError,
    isSuccess,
    isPending,
  } = mutation;

  return {
    handleDuplicateSurvey,
    isError,
    isSuccess,
    errorState,
    isPending,
  };
};

export const useMoveSurvey = () => {
  const dispatch = useDispatch();
  const [errorState, setErrorState] = useState<Record<string, string> | null>(
    null
  );

  const mutation = useMutation<
    { targetWorkspaceId: string; surveyId: string; soruceWorkspaceId: string },
    CustomError | unknown,
    {
      workspaceId: string;
      surveyId: string;
      targetWorkspaceId: string;
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
    onSuccess: async ({ targetWorkspaceId, surveyId, soruceWorkspaceId }) => {
      moveSurveyF(surveyId, soruceWorkspaceId, targetWorkspaceId, dispatch);
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
  const dispatch = useDispatch();
  const [errorState, setErrorState] = useState<Record<string, string> | null>(
    null
  );

  const mutation = useMutation<
    SurveyModel,
    CustomError | unknown,
    {
      surveyId: string;
      workspaceId: string;
    }
  >({
    mutationFn: async ({ surveyId, workspaceId }) => {
      setErrorState(null);

      return await updateSurveyStatus(workspaceId, surveyId);
    },
    onSuccess: async (survey) => {
      updateSurveyF(survey, dispatch);
      setErrorState(null);
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
  const dispatch = useDispatch();
  const [errorState, setErrorState] = useState<Record<string, string> | null>(
    null
  );

  const mutation = useMutation<
    { workspaceId: string; surveyId: string },
    CustomError | unknown,
    { workspaceId: string; surveyId: string }
  >({
    mutationFn: async ({ surveyId, workspaceId }) => {
      setErrorState(null);

      return await deleteSurveyFromWorkspace(workspaceId, surveyId);
    },
    onSuccess: async ({ surveyId, workspaceId }) => {
      deleteSurveyF(surveyId, workspaceId, dispatch);
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
  const dispatch = useDispatch();
  const [errorState, setErrorState] = useState<Record<string, string> | null>(
    null
  );

  const mutation = useMutation<
    SurveyModel,
    CustomError | unknown,
    {
      title: string;
      workspaceId: string;
    }
  >({
    mutationFn: async ({ title, workspaceId }) => {
      setErrorState(null);

      const response = await createNewSurvey(workspaceId, title);
      return response;
    },
    onSuccess: async (survey) => {
      await addSurveyF(survey, dispatch);
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

export const useGetSurvey = (workspaceId: string, surveyId: string) => {
  const [errorState, setErrorState] = useState<Record<string, string> | null>(
    null
  );

  // Check if workspaceId and surveyId are valid before running the query
  const shouldFetch = workspaceId && surveyId;

  const {
    data: survey,
    isError,
    isLoading,
  } = useQuery<SurveyModel, CustomError>({
    queryKey: shouldFetch ? ["getSurvey", workspaceId, surveyId] : [],
    queryFn: async () => {
      try {
        if (!shouldFetch) {
          throw new Error("Missing workspaceId or surveyId");
        }

        setErrorState(null);
        const survey = await getSurvey(workspaceId, surveyId);
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

export const useGetSubmissions = (workspaceId: string, surveyId: string) => {
  const [errorState, setErrorState] = useState<Record<string, string> | null>(
    null
  );

  // Check if workspaceId and surveyId are valid before running the query
  const shouldFetch = workspaceId && surveyId;

  const {
    data: submissions,
    isError,
    isLoading,
  } = useQuery<SubmissionModelForBuilder[], CustomError>({
    queryKey: shouldFetch ? ["getSubmissions", workspaceId, surveyId] : [],
    queryFn: async () => {
      try {
        if (!shouldFetch) {
          throw new Error("Missing workspaceId or surveyId");
        }

        setErrorState(null);
        const submissions = await getSubmissions(workspaceId, surveyId);
        return submissions;
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

  return { submissions, isError, isLoading, errorState };
};

export const useUpdateSurveySettings = () => {
  const dispatch = useDispatch();
  const [errorState, setErrorState] = useState<Record<string, string> | null>(
    null
  );

  const mutation = useMutation<
    SurveyModel,
    CustomError | unknown,
    {
      workspaceId: string;
      surveyId: string;
      settings: SurveySettings;
    }
  >({
    mutationFn: async ({
      workspaceId,
      surveyId,
      settings,
    }: {
      workspaceId: string;
      surveyId: string;
      settings: SurveySettings;
    }) => {
      setErrorState(null);

      return await updateSurveySettings(workspaceId, surveyId, settings);
    },
    onSuccess: async (survey) => {
      await updateSurveyF(survey, dispatch);
    },
    onError: (err: CustomError | unknown) => {
      const message =
        err instanceof CustomError
          ? err.errors || { message: err.message }
          : { message: "Unknown Error" };
      setErrorState(message);
      console.error("Error updating survey settings:", err);
    },
  });

  const {
    mutateAsync: handleUpdateSurveySettings,
    isError,
    isSuccess,
    isPending,
  } = mutation;

  return {
    handleUpdateSurveySettings,
    isError,
    isSuccess,
    errorState,
    isPending,
  };
};
