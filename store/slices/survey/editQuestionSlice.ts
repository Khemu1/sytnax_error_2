import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EditQuestionModel } from "@/types/buildSurvey";

const initialState: EditQuestionModel = {
  id: "",
  surveyId: "",
  label: "",
  description: "",
  points: 0,
  // these won't modified
  correctAnswers: [],
  questionAnswers: [],
  //
  allowMultipleAnswers: false,
  deletedAnswers: [],
  deletedCorrectAnswers: [],
  addedAnswers: [],
  addedCorrectAnswers: [],
  previewImageUrl: "",
  isDescriptionEnabled: false,
  isImageUploadEnabled: false,
};
const editQuestionsSlice = createSlice({
  name: "editQuestion",
  initialState,
  reducers: {
    setCurrentEditQuestion: (
      state,
      action: PayloadAction<EditQuestionModel>
    ) => {
      return {
        ...action.payload,
        isDescriptionEnabled: action.payload.description ? true : false,
        isImageUploadEnabled: action.payload.questionImage ? true : false,
        allowMultipleAnswers: action.payload.allowMultipleAnswers,
        addedAnswers: action.payload.questionAnswers.map(
          (answer) => answer.answer
        ),
        addedCorrectAnswers: action.payload.correctAnswers.map(
          (ca) => ca.value
        ),
        deletedAnswers: [],
        deletedCorrectAnswers: [],
      };
    },
    updateCurrentEditQuestion: (
      state,
      action: PayloadAction<Partial<EditQuestionModel>>
    ) => {
      return { ...state, ...action.payload };
    },
    addAnswer: (state, action: PayloadAction<string>) => {
      // look for the answer in the original array
      const findAnswer = state.questionAnswers.find(
        (answer) => answer.answer === action.payload
      );

      // was it deleted ?
      const findDeletedAnswer = state.deletedAnswers.find(
        (answer) => answer.answer === action.payload
      );

      // if it was part of the original question and deleted, restore it to the original position
      if (findAnswer && findDeletedAnswer) {
        // remove it from deletedAnswers
        state.deletedAnswers = state.deletedAnswers.filter(
          (answer) => answer.answer !== action.payload
        );

        // get the index of the original answer
        const originalIndex = state.questionAnswers.findIndex(
          (answer) => answer.id === findDeletedAnswer.id
        );

        // restore it at the correct position
        state.addedAnswers.splice(originalIndex, 0, action.payload);
      } else {
        // otherwise, just add it normally
        state.addedAnswers.push(action.payload);
      }
    },

    removeAnswer: (state, action: PayloadAction<string>) => {
      // check if the answer was part of the original question
      const existingAnswer = state.questionAnswers.find(
        (answer) => answer.answer === action.payload
      );

      if (existingAnswer) {
        // add it to deletedAnswers
        state.deletedAnswers.push(existingAnswer);

        // remove it from addedAnswers
        state.addedAnswers = state.addedAnswers.filter(
          (answer) => answer !== action.payload
        );
      } else {
        // if it's not part of the original question, just remove it from addedAnswers
        state.addedAnswers = state.addedAnswers.filter(
          (answer) => answer !== action.payload
        );
      }
    },

    addCorrectAnswer: (state, action: PayloadAction<string>) => {
      // look for answer in the original array
      const findCorrectAnswer = state.correctAnswers.find(
        (ca) => ca.value === action.payload
      );

      // was it deleted?
      const findDeletedCorrectAnswer = state.deletedCorrectAnswers.find(
        (ca) => ca.value === action.payload
      );

      // if yes, add it back
      if (findCorrectAnswer && findDeletedCorrectAnswer) {
        // remove it from deletedCorrectAnswers based on value
        state.deletedCorrectAnswers = state.deletedCorrectAnswers.filter(
          (ca) => ca.id !== findDeletedCorrectAnswer.id
        );

        // add it to addedCorrectAnswers
        state.addedCorrectAnswers.push(action.payload);
      } else {
        // otherwise, just add it to addedCorrectAnswers
        state.addedCorrectAnswers.push(action.payload);
      }
    },

    removeCorrectAnswer: (state, action: PayloadAction<string>) => {
      // look for answer in the original array
      const findCorrectAnswer = state.correctAnswers.find(
        (ca) => ca.value === action.payload
      );

      // if it exists in correctAnswers, add it to deletedCorrectAnswers
      if (findCorrectAnswer) {
        state.deletedCorrectAnswers.push(findCorrectAnswer);

        // remove it from addedCorrectAnswers
        state.addedCorrectAnswers = state.addedCorrectAnswers.filter(
          (ca) => ca !== action.payload
        );
      } else {
        // if it's not in correctAnswers, just remove from addedCorrectAnswers
        state.addedCorrectAnswers = state.addedCorrectAnswers.filter(
          (ca) => ca !== action.payload
        );
      }
    },

    reduceCorrectAnswersTo1: (state) => {
      state.correctAnswers = [state.correctAnswers[0]];
    },
    resetCurrentEditQuestion: () => initialState,
  },
});

export const {
  setCurrentEditQuestion,
  addAnswer,
  removeAnswer,
  addCorrectAnswer,
  removeCorrectAnswer,
  resetCurrentEditQuestion,
  updateCurrentEditQuestion,
  reduceCorrectAnswersTo1,
} = editQuestionsSlice.actions;

export default editQuestionsSlice.reducer;
