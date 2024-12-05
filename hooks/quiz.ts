import { getSurveyForQuiz } from "@/frontendServices/survey_builder/survey";
import { CustomError } from "@/middleware/CustomError";
import { SurveyModel } from "@/types/survey";
import { useQuery } from "@tanstack/react-query";
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
