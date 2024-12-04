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
      console.log("looking to add duplication");
      const index = state.items.findIndex(
        (question) => question.id === action.payload.orignalQuestionId
      );
      console.log("index", index);
      state.items.splice(index, 0, action.payload.question);
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
