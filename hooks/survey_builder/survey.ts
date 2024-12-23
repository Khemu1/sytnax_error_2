import { useMutation, useQuery, UseQueryOptions } from "@tanstack/react-query";
import {
  addMembersToSurvey,
  createNewSurvey,
  deleteAllMembers,
  deleteSurveyFromWorkspace,
  duplicateSurvey,
  getSubmissions,
  getSurvey,
  getSurveyParticipants,
  moveSurveyToWorkspace,
  removeMembersFromSurvey,
  resetAllMembersAttempts,
  resetMembersAttempts,
  updateSurveySettings,
  updateSurveyStatus,
  updateSurveyTitle,
} from "@/frontendServices/survey_builder/survey";
import { useState } from "react";
import {
  SurveyModel,
  SurveyParticipantModel,
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
  deleteMembersFromSurveyF,
  addMembersToSurveyF,
  resetMembersAttemptsF,
  resetAllMembersAttemptsF,
  deleteAllMembersF,
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
    queryKey: ["getSurvey", workspaceId, surveyId],
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
    enabled: !!shouldFetch,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: "always",
  });

  return { survey, isError, isLoading, errorState };
};

export const useGetSubmissions = (workspaceId: string, surveyId: string) => {
  const [errorState, setErrorState] = useState<Record<string, string> | null>(
    null
  );

  // Check if workspaceId and surveyId are valid before running the query
  const shouldFetch = workspaceId && surveyId;

  const queryOptions: UseQueryOptions<
    SubmissionModelForBuilder[],
    CustomError
  > = {
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
    enabled: !!shouldFetch,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: "always",
  };

  const { data: submissions, isError, isLoading } = useQuery(queryOptions);

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

// members

export const useGetSurveyParticipants = (
  workspaceId: string,
  surveyId: string
) => {
  const [errorState, setErrorState] = useState<Record<string, string> | null>(
    null
  );

  const shouldFetch = surveyId && workspaceId;
  const {
    data: participants,
    isError,
    isLoading,
    isFetched,
    refetch,
    isPending,
    isSuccess,
    isFetching,
  } = useQuery<SurveyParticipantModel[], CustomError>({
    queryKey: ["getSurveyParticipants", surveyId, workspaceId],
    queryFn: async () => {
      try {
        if (!shouldFetch) {
          throw new Error("Missing workspaceId or surveyId");
        }

        setErrorState(null);
        const participants = await getSurveyParticipants(workspaceId, surveyId);
        return participants;
      } catch (error) {
        const message =
          error instanceof CustomError
            ? error.errors || { message: error.message }
            : { message: "Unknown Error" };
        setErrorState(message);
        throw error;
      }
    },

    enabled: !!shouldFetch,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: "always",
  });

  return {
    participants,
    isError,
    isLoading,
    errorState,
    isFetched,
    refetch,
    isSuccess,
    isPending,
    isFetching,
  };
};

export const useAddMembersToSurvey = () => {
  const dispatch = useDispatch();
  const [errorState, setErrorState] = useState<Record<string, string> | null>(
    null
  );

  const mutation = useMutation<
    {
      surveyId: string;
      members: SurveyParticipantModel[];
    },
    CustomError | unknown,
    {
      workspaceId: string;
      surveyId: string;
      members: string[];
    }
  >({
    mutationFn: async ({
      workspaceId,
      surveyId,
      members,
    }: {
      workspaceId: string;
      surveyId: string;
      members: string[];
    }) => {
      setErrorState(null);

      return await addMembersToSurvey(workspaceId, surveyId, members);
    },
    onSuccess: async (data) => {
      addMembersToSurveyF(data.surveyId, data.members, dispatch);
    },
    onError: (err: CustomError | unknown) => {
      const message =
        err instanceof CustomError
          ? err.errors || { message: err.message }
          : { message: "Unknown Error" };
      setErrorState(message);
      console.error("Error adding members to survey:", err);
    },
  });

  const {
    mutateAsync: handleAddMembersToSurvey,
    isError,
    isSuccess,
    isPending,
  } = mutation;

  return {
    handleAddMembersToSurvey,
    isError,
    isSuccess,
    errorState,
    isPending,
  };
};

export const useDeleteMembersFromSurvey = () => {
  const dispatch = useDispatch();
  const [errorState, setErrorState] = useState<Record<string, string> | null>(
    null
  );

  const mutation = useMutation<
    {
      surveyId: string;
      members: SurveyParticipantModel[];
    },
    CustomError | unknown,
    {
      workspaceId: string;
      surveyId: string;
      members: string[];
    }
  >({
    mutationFn: async ({
      workspaceId,
      surveyId,
      members,
    }: {
      workspaceId: string;
      surveyId: string;
      members: string[];
    }) => {
      setErrorState(null);

      return await removeMembersFromSurvey(workspaceId, surveyId, members);
    },
    onSuccess: async (data) => {
      deleteMembersFromSurveyF(data.surveyId, data.members, dispatch);
    },
    onError: (err: CustomError | unknown) => {
      const message =
        err instanceof CustomError
          ? err.errors || { message: err.message }
          : { message: "Unknown Error" };
      setErrorState(message);
      console.error("Error removing members from survey:", err);
    },
  });

  const {
    mutateAsync: handleDeleteMembersFromSurvey,
    isError,
    isSuccess,
    isPending,
  } = mutation;

  return {
    handleDeleteMembersFromSurvey,
    isError,
    isSuccess,
    errorState,
    isPending,
  };
};

export const useResetMembersAttempts = () => {
  const dispatch = useDispatch();
  const [errorState, setErrorState] = useState<Record<string, string> | null>(
    null
  );

  const mutation = useMutation<
    {
      surveyId: string;
      members: SurveyParticipantModel[];
    },
    CustomError | unknown,
    {
      workspaceId: string;
      surveyId: string;
      members: string[];
    }
  >({
    mutationFn: async ({
      workspaceId,
      surveyId,
      members,
    }: {
      workspaceId: string;
      surveyId: string;
      members: string[];
    }) => {
      setErrorState(null);

      return await resetMembersAttempts(workspaceId, surveyId, members);
    },
    onSuccess: async (data) => {
      resetMembersAttemptsF(data.surveyId, data.members, dispatch);
    },
    onError: (err: CustomError | unknown) => {
      const message =
        err instanceof CustomError
          ? err.errors || { message: err.message }
          : { message: "Unknown Error" };
      setErrorState(message);
      console.error("Error resetting members attempts:", err);
    },
  });

  const {
    mutateAsync: handleResetMembersAttempts,
    isError,
    isSuccess,
    isPending,
  } = mutation;

  return {
    handleResetMembersAttempts,
    isError,
    isSuccess,
    errorState,
    isPending,
  };
};

export const useDeleteAllMembers = () => {
  const dispatch = useDispatch();
  const [errorState, setErrorState] = useState<Record<string, string> | null>(
    null
  );

  const mutation = useMutation<
    { surveyId: string },
    CustomError | unknown,
    {
      workspaceId: string;
      surveyId: string;
    }
  >({
    mutationFn: async ({
      workspaceId,
      surveyId,
    }: {
      workspaceId: string;
      surveyId: string;
    }) => {
      setErrorState(null);

      return await deleteAllMembers(workspaceId, surveyId);
    },
    onSuccess: async (data) => {
      deleteAllMembersF(data.surveyId, dispatch);
    },
    onError: (err: CustomError | unknown) => {
      const message =
        err instanceof CustomError
          ? err.errors || { message: err.message }
          : { message: "Unknown Error" };
      setErrorState(message);
      console.error("Error deleting all members attempts:", err);
    },
  });

  const {
    mutateAsync: handleDeleteAllMembers,
    isError,
    isSuccess,
    isPending,
  } = mutation;

  return {
    handleDeleteAllMembers,
    isError,
    isSuccess,
    errorState,
    isPending,
  };
};

export const useResetAllMembersAttempts = () => {
  const dispatch = useDispatch();
  const [errorState, setErrorState] = useState<Record<string, string> | null>(
    null
  );

  const mutation = useMutation<
    { surveyId: string },
    CustomError | unknown,
    {
      workspaceId: string;
      surveyId: string;
    }
  >({
    mutationFn: async ({
      workspaceId,
      surveyId,
    }: {
      workspaceId: string;
      surveyId: string;
    }) => {
      setErrorState(null);

      return await resetAllMembersAttempts(workspaceId, surveyId);
    },
    onSuccess: async (data) => {
      resetAllMembersAttemptsF(data.surveyId, dispatch);
    },
    onError: (err: CustomError | unknown) => {
      const message =
        err instanceof CustomError
          ? err.errors || { message: err.message }
          : { message: "Unknown Error" };
      setErrorState(message);
      console.error("Error resetting all members attempts:", err);
    },
  });

  const {
    mutateAsync: handleResetAllMembersAttempts,
    isError,
    isSuccess,
    isPending,
  } = mutation;

  return {
    handleResetAllMembersAttempts,
    isError,
    isSuccess,
    errorState,
    isPending,
  };
};
