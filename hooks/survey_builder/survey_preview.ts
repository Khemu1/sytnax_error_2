import { useQuery } from "@tanstack/react-query";
import { getSurveyForPreview } from "@/frontendServices/survey_builder/survey_preview";
import { SurveyPreviewModel } from "@/types/survey";
import { useState } from "react";
import { CustomError } from "@/middleware/CustomError";

export const useGetForPreviewSurvey = (
  surveyPath: string,
) => {
  const [errorState, setErrorState] = useState<Record<string, string> | null>(
    null
  );

  const {
    data: survey,
    isError,
    isLoading,
  } = useQuery<SurveyPreviewModel, CustomError>({
    queryKey: ["getForPreviewSurvey", surveyPath],
    queryFn: async () => {
      try {
        const survey = await getSurveyForPreview(
          surveyPath,
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
