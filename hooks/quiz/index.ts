import {
  addQuizParticipantService,
  getParticpantForQuiz,
  getQuizGrade,
} from "@/frontendServices/quiz";
import { getSurveyForQuiz } from "@/frontendServices/survey_builder/survey";
import { CustomError } from "@/middleware/CustomError";
import { SurveyModel, SurveyParticipantModel } from "@/types/survey";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";

export const useGetSurveyForQuiz = (
  surveyId: string,
  participantId: string | null,
  attempts: number
) => {
  const [errorState, setErrorState] = useState<Record<string, string> | null>(
    null
  );

  // Check if workspaceId and surveyId are valid before running the query
  const shouldFetch = surveyId && participantId && attempts > 0;

  const {
    data: survey,
    isError,
    isLoading,
  } = useQuery<Omit<SurveyModel, "correctAnswers">, CustomError>({
    queryKey: shouldFetch
      ? ["getSurvey", surveyId, participantId, attempts]
      : [],
    queryFn: async () => {
      try {
        if (!shouldFetch) {
          throw new Error("Missing workspaceId or surveyId");
        }

        setErrorState(null);
        const survey = await getSurveyForQuiz(surveyId);
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
    staleTime: Infinity,
  });

  return { survey, isError, isLoading, errorState };
};
export const useGetParticipantForQuiz = (
  studentId: string,
  surveyId: string,
  fetch: boolean
) => {
  const [errorState, setErrorState] = useState<Record<string, string> | null>(
    null
  );

  const shouldFetch = studentId && surveyId && fetch;

  const {
    data: participant,
    isError,
    isLoading,
    isSuccess,
    isPending,
    isFetching,
  } = useQuery<SurveyParticipantModel, CustomError>({
    queryKey: shouldFetch ? ["getParticpant", studentId, surveyId, fetch] : [],
    queryFn: async () => {
      try {
        if (!shouldFetch) {
          throw new Error("Missing workspaceId or surveyId");
        }

        setErrorState(null);
        const particpants = await getParticpantForQuiz(studentId, surveyId);
        return particpants;
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
    participant,
    isError,
    isLoading,
    errorState,
    isSuccess,
    isPending,
    isFetching,
  };
};

export const useAddQuizParticipant = () => {
  const mutation = useMutation<
    {
      id: string;
      QuizTotalScore: number | null;
      totalUserScore: number | null;
      clean: boolean;
    },
    CustomError | unknown,
    {
      quizData: FormData;
    }
  >({
    mutationFn: async ({ quizData }) => {
      const response = await addQuizParticipantService(quizData);
      return response;
    },
    onSuccess: (data) => {
      console.log("data", data);
    },
    onError: (err: CustomError | unknown) => {
      console.error("Error adding quiz participant:", err);
    },
  });

  const {
    mutateAsync: handleAddQuizParticipant,
    isError,
    isSuccess,
    isPending,
    data,
  } = mutation;

  return {
    handleAddQuizParticipant,
    isError,
    isSuccess,
    isPending,
    data,
  };
};

export const useGetGrade = (quizId: string) => {
  const [errorState, setErrorState] = useState<Record<string, string> | null>(
    null
  );

  // Check if workspaceId and surveyId are valid before running the query
  const shouldFetch = quizId;

  const { data, isError, isLoading, isSuccess } = useQuery<
    {
      totalPoints: number | null;
      givenPoints: number | null;
      cleanSubmission: boolean | null;
      gradesVisibility: "hidden" | "visibleAfterSurveyCloses" | "visible";
      isOpen: boolean;
      endTime: string | null;
    },
    CustomError
  >({
    queryKey: shouldFetch ? ["grade", quizId] : [],
    queryFn: async () => {
      try {
        if (!shouldFetch) {
          throw new Error("Missing workspaceId or surveyId");
        }

        setErrorState(null);
        const survey = await getQuizGrade(quizId);
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
    staleTime: Infinity,
  });

  return { data, isError, isLoading, errorState, isSuccess };
};
