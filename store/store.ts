import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice"; 
import dashboardReducer from "./slices/dashboardSlice"; 
import dialogReducer from "./slices/dialogSlice";
import surveyReducer from "./slices/survey/surveySlice";
import workspaceReducer from "./slices/survey/workspaceSlice";
import currentWorkspaceReducer from "./slices/survey/currentWorkspaceSlice";
import currentSurveyReducer from "./slices/survey/currentSurveySlice";
import sharedFormReducer from "./slices/survey/sharedFormSlice";
import welcomePageReducer from "./slices/survey/welcomePageSlice";
import genericTextReducer from "./slices/survey/genericTextSlice";
import defaultEndingReducer from "./slices/survey/defaultEnding";
import redirectEndingReducer from "./slices/survey/redirectEnding";
import welcomePartReducer from "./slices/survey/welcomePartSlice";
import questionsReducer from "./slices/survey/questionsSlice";
import endingsReducer from "./slices/survey/endingsSlice";
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
    sharedForm: sharedFormReducer,
    welcomePage: welcomePageReducer,
    genericText: genericTextReducer,
    defaultEnding: defaultEndingReducer,
    redirectEnding: redirectEndingReducer,
    welcomePart: welcomePartReducer,
    genericTexts: questionsReducer,
    endings: endingsReducer,
    userGroup: userGroupReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
