import { addQuizParticipantService } from "@/frontendServices/quiz";
import { getSurveyForQuiz } from "@/frontendServices/survey_builder/survey";
import { CustomError } from "@/middleware/CustomError";
import { SurveyModel } from "@/types/survey";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";

export const useGetSurveyForQuiz = (surveyId: string) => {
  const [errorState, setErrorState] = useState<Record<string, string> | null>(
    null
  );

  // Check if workspaceId and surveyId are valid before running the query
  const shouldFetch = surveyId;

  const {
    data: survey,
    isError,
    isLoading,
  } = useQuery<Omit<SurveyModel, "correctAnswers">, CustomError>({
    queryKey: shouldFetch ? ["getSurvey", surveyId] : [],
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
  });

  return { survey, isError, isLoading, errorState };
};

export const useAddQuizParticipant = () => {
  const mutation = useMutation<
    {
      id: string;
      QuizTotalScore: number | null;
      totalUserScore: number | null;
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
