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
  previewImageUrl: null,
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
      console.log(
        "does the question has image ? ",
        action.payload.questionImage?.url ? true : false
      );
      Object.assign(state, {
        ...action.payload,
        isDescriptionEnabled: Boolean(action.payload.description),
        isImageUploadEnabled: Boolean(action.payload.questionImage),
        allowMultipleAnswers: action.payload.allowMultipleAnswers,
        previewImageUrl: action.payload.questionImage?.url ?? null,
        addedAnswers: action.payload.questionAnswers.map(
          (answer) => answer.answer
        ),
        addedCorrectAnswers: action.payload.correctAnswers.map(
          (ca) => ca.value
        ),
        deletedAnswers: [],
        deletedCorrectAnswers: [],
      });
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
      const { payload: newAnswer } = action;

      //make sure that the added answer didn't come with the question
      if (state.addedCorrectAnswers.includes(newAnswer)) {
        return;
      }

      // Helper function to find a correct answer by value
      const findCorrectAnswer = (value: string) =>
        state.correctAnswers.find((ca) => ca.value === value);

      // Helper function to find a deleted correct answer by value
      const findDeletedCorrectAnswer = (value: string) =>
        state.deletedCorrectAnswers.find((ca) => ca.value === value);

      // Helper function to remove a correct answer from deletedCorrectAnswers
      const removeFromDeletedCorrectAnswers = (value: string) => {
        state.deletedCorrectAnswers = state.deletedCorrectAnswers.filter(
          (ca) => ca.value !== value
        );
      };

      // Helper function to replace the last added correct answer
      const replaceLastAddedCorrectAnswer = (newAnswer: string) => {
        const lastAnswerValue =
          state.addedCorrectAnswers[state.addedCorrectAnswers.length - 1];
        const lastAnswerWithId = findCorrectAnswer(lastAnswerValue);

        if (lastAnswerWithId) {
          state.deletedCorrectAnswers.push(lastAnswerWithId);
        }

        state.addedCorrectAnswers = [
          ...state.addedCorrectAnswers.slice(
            0,
            state.addedCorrectAnswers.length - 1
          ),
          newAnswer,
        ];
      };

      // Logic for adding or replacing correct answers
      if (state.allowMultipleAnswers) {
        // If multiple answers are allowed and we haven't reached the limit
        if (state.addedCorrectAnswers.length < 2) {
          const deletedAnswer = findDeletedCorrectAnswer(newAnswer);

          if (deletedAnswer) {
            removeFromDeletedCorrectAnswers(newAnswer);
          }

          state.addedCorrectAnswers.push(newAnswer);
        } else if (state.addedCorrectAnswers.length === 2) {
          const deletedAnswer = findDeletedCorrectAnswer(newAnswer);

          if (deletedAnswer) {
            removeFromDeletedCorrectAnswers(newAnswer);
          }

          replaceLastAddedCorrectAnswer(newAnswer);
        }
      } else {
        // If only one answer is allowed, replace the last added correct answer
        const deletedAnswer = findDeletedCorrectAnswer(newAnswer);

        if (deletedAnswer) {
          removeFromDeletedCorrectAnswers(newAnswer);
        }

        replaceLastAddedCorrectAnswer(newAnswer);
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
      if (state.addedCorrectAnswers.length > 1) {
        state.addedCorrectAnswers = [state.addedCorrectAnswers[0]];
      }
      console.log(
        "total length for correct answers",
        state.addedCorrectAnswers.length
      );
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
