import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { QuestionModel } from "../../../types/buildSurvey";

interface QuestionsState {
  items: QuestionModel[];
}

const initialState: QuestionsState = {
  items: [],
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
      state.items = state.items.map((question) =>
        question.id === action.payload.id
          ? { ...question, ...action.payload }
          : question
      );
    },
  },
});

export const { setQuestions, addQuestion, removeQuestion, updateQuestion } =
  questionsSlice.actions;
export default questionsSlice.reducer;
``;
