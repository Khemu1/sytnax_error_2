import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NewQuestionModel } from "../../../types/buildSurvey";

const initialState: NewQuestionModel = {
  id: "0",
  surveyId: "0",
  label: "",
  description: "",
  points: 1,
  correctAnswers: [],
  answers: [],
  allowMultipleAnswers: false,
  isImageUploadEnabled: false,
  isDescriptionEnabled: false,
  previewImageUrl: "",
};

const questionsSlice = createSlice({
  name: "currentQuestion",
  initialState,
  reducers: {
    setCurrentQuestion: (state, action: PayloadAction<NewQuestionModel>) => {
      return action.payload;
    },
    updateCurrentQuestion: (
      state,
      action: PayloadAction<Partial<NewQuestionModel>>
    ) => {
      return { ...state, ...action.payload };
    },
    addAnswer: (state, action: PayloadAction<string>) => {
      state.answers.push(action.payload);
    },
    removeAnswer: (state, action: PayloadAction<string>) => {
      state.answers = state.answers.filter(
        (answer) => answer !== action.payload
      );
    },
    addCorrectAnswer: (state, action: PayloadAction<string>) => {
      if (state.allowMultipleAnswers) {
        if (state.correctAnswers.length < 2) {
          state.correctAnswers.push(action.payload);
        } else {
          state.correctAnswers = [state.correctAnswers[0], action.payload];
        }
      } else {
        state.correctAnswers = [action.payload];
      }
    },
    removeCorrectAnswer: (state, action: PayloadAction<string>) => {
      state.correctAnswers = state.correctAnswers.filter(
        (answer) => answer !== action.payload
      );
    },
    resetCurrentQuestion: () => initialState,
    reduceCorrectAnswersTo1: (state) => {
      state.correctAnswers = [state.correctAnswers[0]];
    },
  },
});

export const {
  setCurrentQuestion,
  updateCurrentQuestion,
  resetCurrentQuestion,
  removeCorrectAnswer,
  addCorrectAnswer,
  addAnswer,
  removeAnswer,
  reduceCorrectAnswersTo1,
} = questionsSlice.actions;

export default questionsSlice.reducer;
