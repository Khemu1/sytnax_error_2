import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SurveyModel, WorkSpaceModel } from "../../../types/survey";

interface WorkspaceState {
  workspaces: WorkSpaceModel[];
  currentWorkspace: WorkSpaceModel | null;
}

const initialState: WorkspaceState = {
  workspaces: [],
  currentWorkspace: null,
};

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    setWorkspaces: (state, action: PayloadAction<WorkSpaceModel[]>) => {
      state.workspaces = action.payload;
    },
    setCurrentWorkspace: (state, action: PayloadAction<WorkSpaceModel>) => {
      state.currentWorkspace = action.payload;
    },
    signOut: (state) => {
      state.workspaces = [];
      state.currentWorkspace = null;
    },
    addWorkspace: (state, action: PayloadAction<WorkSpaceModel>) => {
      const newWorkspace = {
        ...action.payload,
        surveys: action.payload.surveys || [],
      };
      state.workspaces.push(newWorkspace);

      if (state.currentWorkspace?.id === newWorkspace.id) {
        state.currentWorkspace = newWorkspace;
      }
    },
    updateWorkspaces: (
      state,
      action: PayloadAction<{ workspaceData: WorkSpaceModel; id: string }>
    ) => {
      state.workspaces = state.workspaces.map((workspace) =>
        workspace.id === action.payload.id
          ? {
              ...workspace,
              ...action.payload.workspaceData,
              surveys:
                action.payload.workspaceData.surveys || workspace.surveys || [],
            }
          : workspace
      );

      if (state.currentWorkspace?.id === action.payload.id) {
        state.currentWorkspace = {
          ...state.currentWorkspace,
          ...action.payload.workspaceData,
        };
      }
    },
    deleteWorkspace: (state, action: PayloadAction<string>) => {
      const updatedWorkspaces = state.workspaces.filter(
        (workspace) => workspace.id !== action.payload
      );
      state.workspaces = updatedWorkspaces;

      if (state.currentWorkspace?.id === action.payload) {
        state.currentWorkspace = null;
      }
    },
    addSurveyToWorkspace: (state, action: PayloadAction<SurveyModel>) => {
      state.workspaces = state.workspaces.map((workspace) =>
        workspace.id === action.payload.workspaceId
          ? {
              ...workspace,
              surveys: [...(workspace.surveys || []), action.payload],
            }
          : workspace
      );

      const updatedWorkspace = state.workspaces.find(
        (ws) => ws.id === action.payload.workspaceId
      );
      if (
        updatedWorkspace &&
        updatedWorkspace.id === state.currentWorkspace?.id
      ) {
        state.currentWorkspace = { ...updatedWorkspace };
      }
    },
    deleteWorkspaceSurvey: (
      state,
      action: PayloadAction<{ surveyId: string; workspaceId: string }>
    ) => {
      const workspace = state.workspaces.find(
        (ws) => ws.id === action.payload.workspaceId
      );

      if (workspace && workspace.surveys) {
        const updatedSurveys = workspace.surveys.filter(
          (survey) => survey.id !== action.payload.surveyId
        );

        state.workspaces = state.workspaces.map((ws) =>
          ws.id === action.payload.workspaceId
            ? { ...ws, surveys: updatedSurveys }
            : ws
        );

        if (state.currentWorkspace?.id === action.payload.workspaceId) {
          state.currentWorkspace = { ...workspace, surveys: updatedSurveys };
        }
      }
    },
    updateWorkspaceSurvey: (state, action: PayloadAction<SurveyModel>) => {
      const workspace = state.workspaces.find(
        (ws) => ws.id === action.payload.workspaceId
      );

      if (workspace && workspace.surveys) {
        const updatedSurveys = workspace.surveys.map((survey) =>
          survey.id === action.payload.id
            ? { ...survey, ...action.payload }
            : survey
        );

        state.workspaces = state.workspaces.map((ws) =>
          ws.id === workspace.id ? { ...ws, surveys: updatedSurveys } : ws
        );

        if (state.currentWorkspace?.id === workspace.id) {
          state.currentWorkspace = { ...workspace, surveys: updatedSurveys };
        }
      }
    },

    moveSurveyToAnotherWorkspace: (
      state,
      action: PayloadAction<{
        surveyId: string;
        sourceWorkspaceId: string;
        targetWorkspaceId: string;
      }>
    ) => {
      const { surveyId, sourceWorkspaceId, targetWorkspaceId } = action.payload;

      const sourceWorkspace = state.workspaces.find(
        (ws) => ws.id === sourceWorkspaceId
      );

      const targetWorkspace = state.workspaces.find(
        (ws) => ws.id === targetWorkspaceId
      );

      if (sourceWorkspace && targetWorkspace) {
        sourceWorkspace.surveys = sourceWorkspace.surveys || [];
        targetWorkspace.surveys = targetWorkspace.surveys || [];

        const surveyToMove = sourceWorkspace.surveys.find(
          (survey) => survey.id === surveyId
        );

        if (surveyToMove) {
          sourceWorkspace.surveys = sourceWorkspace.surveys.filter(
            (survey) => survey.id !== surveyId
          );

          targetWorkspace.surveys.push(surveyToMove);

          state.workspaces = state.workspaces.map((workspace) => {
            if (workspace.id === sourceWorkspaceId) {
              return { ...workspace, surveys: [...sourceWorkspace.surveys] };
            }
            if (workspace.id === targetWorkspaceId) {
              return { ...workspace, surveys: [...targetWorkspace.surveys] };
            }
            return workspace;
          });

          if (state.currentWorkspace?.id === sourceWorkspaceId) {
            state.currentWorkspace = {
              ...sourceWorkspace,
              surveys: sourceWorkspace.surveys,
            };
          }
          if (state.currentWorkspace?.id === targetWorkspaceId) {
            state.currentWorkspace = {
              ...targetWorkspace,
              surveys: targetWorkspace.surveys,
            };
          }
        }
      }
    },
  },
});

export const {
  setWorkspaces,
  signOut,
  updateWorkspaces,
  deleteWorkspace,
  addWorkspace,
  addSurveyToWorkspace,
  deleteWorkspaceSurvey,
  updateWorkspaceSurvey,
  moveSurveyToAnotherWorkspace,
  setCurrentWorkspace,
} = workspaceSlice.actions;
export default workspaceSlice.reducer;
