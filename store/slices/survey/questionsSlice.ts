import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { QuestionModel } from "../../../types/buildSurvey";

interface QuestionsState {
  items: QuestionModel[]; // Renamed 'questions' to 'items'
}

const initialState: QuestionsState = {
  items: [], // Updated here
};

const questionsSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    setQuestions: (state, action: PayloadAction<QuestionModel[]>) => {
      state.items = action.payload;
    },
    addQuestion: (state, action: PayloadAction<QuestionModel>) => {
      state.items.push(action.payload);
    },
    removeQuestion: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (question) => question.id !== action.payload
      );
    },
    updateQuestion: (state, action: PayloadAction<QuestionModel>) => {
      const index = state.items.findIndex(
        (question) => question.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
  },
});

export const { setQuestions, addQuestion, removeQuestion, updateQuestion } =
  questionsSlice.actions;
export default questionsSlice.reducer;
``;
