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
    addQuestion: (
      state,
      action: PayloadAction<{
        question: QuestionModel;
        type: string;
        orignalQuestionId: string | null;
      }>
    ) => {
      if (action.payload.type === "add") {
        state.items.push(action.payload.question);
        return;
      }
      const index = state.items.findIndex(
        (question) => question.id === action.payload.orignalQuestionId
      );
      console.log("index", index);

      if (index !== -1) {
        state.items = [
          ...state.items.slice(0, index + 1),
          action.payload.question,
          ...state.items.slice(index + 1),
        ];
      } else {
        console.error("Original question not found.");
      }
    },
    deleteQuestion: (state, action: PayloadAction<string>) => {
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

export const { setQuestions, addQuestion, deleteQuestion, updateQuestion } =
  questionsSlice.actions;
export default questionsSlice.reducer;
