import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice"; 
import dashboardReducer from "./slices/dashboardSlice"; 
import dialogReducer from "./slices/dialogSlice";
import surveyReducer from "./slices/survey/surveySlice";
import workspaceReducer from "./slices/survey/workspaceSlice";
import currentWorkspaceReducer from "./slices/survey/currentWorkspaceSlice";
import currentSurveyReducer from "./slices/survey/currentSurveySlice";
import userGroupReducer from "./slices/survey/userGroup";
import questionsReducer from "./slices/survey/questionsSlice";
import questionReducer from "./slices/survey/questionSlice";
import editQuestionReducer from "./slices/survey/editQuestionSlice";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    dialog: dialogReducer,
    survey: surveyReducer,
    workspace: workspaceReducer,
    currentWorkspace: currentWorkspaceReducer,
    currentSurvey: currentSurveyReducer,
    userGroup: userGroupReducer,
    questions: questionsReducer,
    question: questionReducer,
    editQuestion: editQuestionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
