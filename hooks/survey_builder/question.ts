import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  addQuestion,
  deleteQuestion,
  duplicateQuestion,
  editQuestion,
} from "@/frontendServices/survey_builder/question";
import { QuestionModel } from "@/types/buildSurvey";
import { CustomError } from "@/middleware/CustomError";
import {
  addQuestionF,
  deleteQuestionFromArrayF,
} from "@/utils/survey_builder/build/questions";
import { useDispatch } from "react-redux";
import { updateQuestionsArrayF } from "@/utils/survey_builder/build/questions";
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
  const dispatch = useDispatch();
  const [errorState, setErrorState] = useState<Record<
    string,
    string | undefined
  > | null>(null);

  const mutation = useMutation<
    string,
    CustomError | unknown,
    {
      questionId: string;
      surveyId: string;
      workspaceId: string;
    }
  >({
    mutationFn: async ({ questionId, surveyId, workspaceId }) => {
      setErrorState(null);

      const response = await deleteQuestion(questionId, surveyId, workspaceId);
      return response;
    },
    onSuccess: (questionId) => {
      deleteQuestionFromArrayF(questionId, dispatch);
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
  const dispatch = useDispatch();
  const [errorState, setErrorState] = useState<Record<
    string,
    string | undefined
  > | null>(null);

  const mutation = useMutation<
    { question: QuestionModel; orignalQuestionId: string },
    CustomError | unknown,
    {
      questionId: string;
      surveyId: string;
      workspaceId: string;
    }
  >({
    mutationFn: async ({ questionId, surveyId, workspaceId }) => {
      setErrorState(null);

      const response = await duplicateQuestion(
        questionId,
        surveyId,
        workspaceId
      );
      return response;
    },
    onSuccess: (data: {
      question: QuestionModel;
      orignalQuestionId: string;
    }) => {
      addQuestionF(
        data.question,
        dispatch,
        "duplicate",
        data.orignalQuestionId
      );
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

      const response = await editQuestion(question);
      return response;
    },
    onSuccess: (question) => {
      updateQuestionsArrayF(question, dispatch);
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
