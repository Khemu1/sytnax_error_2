import { addGenericText, removeGenericText, updateGenericText } from "@/store/slices/survey/questionsSlice";
import { GenericTextModel } from "@/types/survey";
import { Dispatch } from "@reduxjs/toolkit";

export const addNewQuestionF = async (
  newQuestion: GenericTextModel,
  dispatch: Dispatch
) => {
  try {
    dispatch(addGenericText(newQuestion));
  } catch (error) {
    console.error("Error deleting survey:", error);
  }
};

export const editQuestionF = async (
  newQuestion: GenericTextModel,
  dispatch: Dispatch
) => {
  try {
    dispatch(updateGenericText(newQuestion));
  } catch (error) {
    console.error("Error deleting survey:", error);
  }
};

export const removeQuestionF = async (
  questionId: number,
  dispatch: Dispatch
) => {
  try {
    dispatch(removeGenericText(+questionId));
  } catch (error) {
    console.error("Error deleting survey:", error);
  }
};
