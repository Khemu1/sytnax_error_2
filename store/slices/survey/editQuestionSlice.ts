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
  deletedAnswers: [],
  deletedCorrectAnswers: [],
  imageUrl: "",
  addedAnswers: [],
  addedCorrectAnswers: [],
  previewImageUrl: "",
  allowMultipleAnswers: false,
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
        previewImageUrl: action.payload.questionImage?.url ?? "",
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
    addAnswerForEdit: (state, action: PayloadAction<string>) => {
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

    removeAnswerForEdit: (state, action: PayloadAction<string>) => {
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

    addCorrectAnswerForEdit: (state, action: PayloadAction<string>) => {
      // If multiple answers are allowed, we can add new answers
      if (state.allowMultipleAnswers) {
        if (state.addedCorrectAnswers.length < 2) {
          const findCorrectAnswer = state.correctAnswers.find(
            (ca) => ca.value === action.payload
          );

          // Was it deleted?
          const findDeletedCorrectAnswer = state.deletedCorrectAnswers.find(
            (ca) => ca.value === action.payload
          );

          // If yes, add it back
          if (findCorrectAnswer && findDeletedCorrectAnswer) {
            // Remove it from deletedCorrectAnswers based on value
            state.deletedCorrectAnswers = state.deletedCorrectAnswers.filter(
              (ca) => ca.id !== findDeletedCorrectAnswer.id
            );

            // Add it to addedCorrectAnswers
            state.addedCorrectAnswers.push(action.payload);
          } else {
            // Otherwise, just add it to addedCorrectAnswers
            state.addedCorrectAnswers.push(action.payload);
          }
        }
      } else if (state.addedCorrectAnswers.length === 2) {
        const findCorrectAnswer = state.correctAnswers.find(
          (ca) => ca.value === action.payload
        );

        // Was it deleted?
        const findDeletedCorrectAnswer = state.deletedCorrectAnswers.find(
          (ca) => ca.value === action.payload
        );

        // Access the last correct answer in addedCorrectAnswers
        const lastCorrectAnswerValue =
          state.addedCorrectAnswers[state.addedCorrectAnswers.length - 1];

        const lastCorrectAnswerWithId = state.correctAnswers.find(
          (ca) => ca.value === lastCorrectAnswerValue
        );

        if (lastCorrectAnswerWithId) {
          state.deletedCorrectAnswers.push(lastCorrectAnswerWithId);
        }

        // If the answer exists in correctAnswers and deletedCorrectAnswers, replace the last one
        if (findCorrectAnswer && findDeletedCorrectAnswer) {
          // Remove it from deletedCorrectAnswers based on value
          state.deletedCorrectAnswers = state.deletedCorrectAnswers.filter(
            (ca) => ca.id !== findDeletedCorrectAnswer.id
          );

          // Replace the last added correct answer with the new one
          state.addedCorrectAnswers = [
            ...state.addedCorrectAnswers.slice(
              0,
              state.addedCorrectAnswers.length - 1
            ),
            action.payload,
          ];
        } else {
          // Otherwise, replace the last added correct answer
          state.addedCorrectAnswers = [
            ...state.addedCorrectAnswers.slice(
              0,
              state.addedCorrectAnswers.length - 1
            ),
            action.payload,
          ];
        }
      } else {
        const findCorrectAnswer = state.correctAnswers.find(
          (ca) => ca.value === action.payload
        );

        // Was it deleted?
        const findDeletedCorrectAnswer = state.deletedCorrectAnswers.find(
          (ca) => ca.value === action.payload
        );

        // Access the last correct answer in addedCorrectAnswers
        const lastCorrectAnswerValue =
          state.addedCorrectAnswers[state.addedCorrectAnswers.length - 1];

        const lastCorrectAnswerWithId = state.correctAnswers.find(
          (ca) => ca.value === lastCorrectAnswerValue
        );

        if (lastCorrectAnswerWithId) {
          state.deletedCorrectAnswers.push(lastCorrectAnswerWithId);
        }

        // If the answer exists in correctAnswers and deletedCorrectAnswers, replace the last one
        if (findCorrectAnswer && findDeletedCorrectAnswer) {
          // Remove it from deletedCorrectAnswers based on value
          state.deletedCorrectAnswers = state.deletedCorrectAnswers.filter(
            (ca) => ca.id !== findDeletedCorrectAnswer.id
          );

          // Replace the last added correct answer with the new one
          state.addedCorrectAnswers = [
            ...state.addedCorrectAnswers.slice(
              0,
              state.addedCorrectAnswers.length - 1
            ),
            action.payload,
          ];
        } else {
          // Otherwise, replace the last added correct answer
          state.addedCorrectAnswers = [
            ...state.addedCorrectAnswers.slice(
              0,
              state.addedCorrectAnswers.length - 1
            ),
            action.payload,
          ];
        }
      }
    },

    removeCorrectAnswerForEdit: (state, action: PayloadAction<string>) => {
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

    reduceCorrectAnswersTo1ForEdit: (state) => {
      state.correctAnswers = [state.correctAnswers[0]];
    },
    resetCurrentEditQuestion: () => initialState,
  },
});

export const {
  setCurrentEditQuestion,
  addAnswerForEdit,
  removeAnswerForEdit,
  addCorrectAnswerForEdit,
  removeCorrectAnswerForEdit,
  resetCurrentEditQuestion,
  updateCurrentEditQuestion,
  reduceCorrectAnswersTo1ForEdit,
} = editQuestionsSlice.actions;

export default editQuestionsSlice.reducer;
