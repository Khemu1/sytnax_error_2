import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  addQuestion,
  deleteQuestion,
  duplicateQuestion,
  editQuestion,
} from "@/frontendServices/survey_builder/generic_question";
import { QuestionModel } from "@/types/buildSurvey";
import { CustomError } from "@/middleware/CustomError";
import { addQuestionF } from "@/utils/survey_builder/build/questions";
import { useDispatch } from "react-redux";

export const useAddQuestion = () => {
  const dispatch = useDispatch();
  const [errorState, setErrorState] = useState<Record<
    string,
    string | undefined
  > | null>(null);

  const mutation = useMutation<
    QuestionModel,
    CustomError | unknown,
    {
      question: FormData;
    }
  >({
    mutationFn: async ({ question }) => {
      setErrorState(null);

      const response = await addQuestion(question);
      return response;
    },
    onSuccess: (newQuestion: QuestionModel) => {
      console.log("newQuestion", newQuestion);
      addQuestionF(newQuestion, dispatch);
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
    mutateAsync: handleAddQuestion,
    isError,
    isSuccess,
    isPending,
  } = mutation;

  return {
    handleAddQuestion,
    isError,
    isSuccess,
    errorState,
    isPending,
  };
};

export const useDeleteQuestion = () => {
  const [errorState, setErrorState] = useState<Record<
    string,
    string | undefined
  > | null>(null);

  const mutation = useMutation<
    {
      questionId: number;
    },
    CustomError | unknown,
    {
      questionId: number;
      workspaceAndSurvey: FormData;
    }
  >({
    mutationFn: async ({ questionId, workspaceAndSurvey }) => {
      setErrorState(null);

      const response = await deleteQuestion(questionId, workspaceAndSurvey);
      return response;
    },
    onSuccess: async (data: { questionId: number }) => {
      console.log("deleted", data.questionId);
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
    mutateAsync: handleDeleteEnding,
    isError,
    isSuccess,
    isPending,
  } = mutation;

  return {
    handleDeleteEnding,
    isError,
    isSuccess,
    errorState,
    isPending,
  };
};

export const useDuplicateQuestion = () => {
  const [errorState, setErrorState] = useState<Record<
    string,
    string | undefined
  > | null>(null);

  const mutation = useMutation<
    {
      question: QuestionModel;
    },
    CustomError | unknown,
    {
      questionId: number;
      workspaceAndSurvey: FormData;
    }
  >({
    mutationFn: async ({ questionId, workspaceAndSurvey }) => {
      setErrorState(null);

      const response = await duplicateQuestion(questionId, workspaceAndSurvey);
      return response;
    },
    onSuccess: async (data: { question: QuestionModel }) => {
      console.log("duplicated", data.question);
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
    mutateAsync: handleDuplicateQuestion,
    isError,
    isSuccess,
    isPending,
  } = mutation;

  return {
    handleDuplicateQuestion,
    isError,
    isSuccess,
    errorState,
    isPending,
  };
};

export const useEditQuestion = () => {
  const [errorState, setErrorState] = useState<Record<
    string,
    string | undefined
  > | null>(null);

  const mutation = useMutation<
    {
      question: QuestionModel;
    },
    CustomError | unknown,
    {
      questionId: number;
      questionData: FormData;
    }
  >({
    mutationFn: async ({ questionId, questionData }) => {
      setErrorState(null);

      const response = await editQuestion(questionId, questionData);
      return response;
    },
    onSuccess: async (data: { question: QuestionModel }) => {
      console.log("edited", data.question);
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
    mutateAsync: handleEditQuestion,
    isError,
    isSuccess,
    isPending,
  } = mutation;

  return {
    handleEditQuestion,
    isError,
    isSuccess,
    errorState,
    isPending,
  };
};
