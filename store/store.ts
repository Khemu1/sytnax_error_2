import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice"; 
import dashboardReducer from "./slices/dashboardSlice"; 
import dialogReducer from "./slices/dialogSlice";
import surveyReducer from "./slices/survey/surveySlice";
import workspaceReducer from "./slices/survey/workspaceSlice";
import currentWorkspaceReducer from "./slices/survey/currentWorkspaceSlice";
import currentSurveyReducer from "./slices/survey/currentSurveySlice";
import userGroupReducer from "./slices/survey/userGroup";


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
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
