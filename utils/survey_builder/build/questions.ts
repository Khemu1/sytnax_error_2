import {
  addQuestion,
  updateQuestion,
} from "@/store/slices/survey/questionsSlice";
import {
  AnswersModel,
  CorrectAnswerModel,
  QuestionModel,
} from "@/types/buildSurvey";
import { filterObject } from "@/utils";
import { Dispatch } from "@reduxjs/toolkit";

export const returnFileAndUrl = (
  file: File | null
): Promise<{
  file: File | null;
  url: string | undefined;
  fileName: string | undefined;
}> => {
  try {
    return new Promise((resolve) => {
      let url: string | undefined = undefined;
      let fileName: string | undefined = undefined;

      if (file) {
        // Get the file name
        fileName = file.name;

        const reader = new FileReader();
        reader.onloadend = () => {
          url = reader.result as string;
          resolve({ file, url, fileName });
        };
        reader.readAsDataURL(file);
      } else {
        resolve({ file, url, fileName });
      }
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const transformDataIntoFormData = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>,
  form: FormData
) => {
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      form.append(key, JSON.stringify(value));
    }
  }
};

export const returnQuestionData = (formData: {
  question: FormDataEntryValue;
  options: FormDataEntryValue;
}) => {
  return filterObject(formData, ["question", "options"]);
};

export const addQuestionF = (question: QuestionModel, dispatch: Dispatch) => {
  try {
    console.log("Adding question:", question);
    dispatch(addQuestion(question));
  } catch (error) {
    throw error;
  }
};

export const extractAnswersToDelete = (
  questionAnswers: AnswersModel[],
  deletedAnswers: AnswersModel[]
) => {
  const answersToDelete = questionAnswers.filter((answer) =>
    deletedAnswers.some(
      (deletedAnswer) => deletedAnswer.answer === answer.answer
    )
  );
  return answersToDelete;
};

export const extractCorrectAnswersToDelete = (
  correctAnswers: CorrectAnswerModel[],
  deletedCorrectAnswers: CorrectAnswerModel[]
) => {
  const correctAnswersToDelete = correctAnswers.filter((ca) =>
    deletedCorrectAnswers.some(
      (deletedCorrectAnswer) => deletedCorrectAnswer.id === ca.id
    )
  );
  return correctAnswersToDelete;
};

export const extractAnswersToAdd = (
  questionAnswers: AnswersModel[],
  addedAnswers: string[]
) => {
  const answersToAdd = addedAnswers.filter(
    (answer) => !questionAnswers.some((q) => q.answer === answer)
  );
  return answersToAdd;
};

export const extractCorrectAnswersToAdd = (
  correctAnswers: CorrectAnswerModel[],
  addedCorrectAnswers: string[]
) => {
  const correctAnswersToAdd = addedCorrectAnswers.filter(
    (ca) => !correctAnswers.some((q) => q.value === ca)
  );
  return correctAnswersToAdd;
};

export const updateQuestionsArrayF = (question: QuestionModel, dispatch: Dispatch) => {
  try {
    dispatch(updateQuestion(question));
  } catch (error) {
    console.error("Error updating questions array:", error);
  }
};
