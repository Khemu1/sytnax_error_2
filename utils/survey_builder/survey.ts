import {
  clearCurrentSurvey,
  updateCurrentSurvey,
} from "@/store/slices/survey/currentSurveySlice";
import {
  addSurveyToCurrentWorkspace,
  deleteCurrnetWorkspaceSurvey,
  updateCurrentWorkspaceSurveys,
} from "@/store/slices/survey/currentWorkspaceSlice";
import {
  addSurvey,
  deleteSurvey,
  updateSurveys,
} from "@/store/slices/survey/surveySlice";
import {
  addSurveyToWorkspace,
  deleteWorkspaceSurvey,
  moveSurveyToAnotherWorkspace,
  updateWorkspaceSurvey,
} from "@/store/slices/survey/workspaceSlice";
import { SurveyModel } from "@/types/survey";
import { Dispatch, UnknownAction } from "@reduxjs/toolkit";

export const addSurveyF = async (
  currentWorkspaceId: string,
  newSurvey: SurveyModel,
  dispatch: Dispatch<UnknownAction>
) => {
  try {
    console.log(newSurvey.workspace, currentWorkspaceId);
    if (newSurvey.workspaceId === currentWorkspaceId) {
      dispatch(addSurveyToCurrentWorkspace(newSurvey));
      dispatch(addSurvey(newSurvey));
    }
    dispatch(addSurveyToWorkspace(newSurvey));
  } catch (error) {
    console.error("Error adding survey:", error);
  }
};

export const deleteSurveyF = async (
  surveyId: string,
  currnetWorkspaceId: string,
  surveyWorkspaceId: string,
  dispatch: Dispatch
) => {
  try {
    if (currnetWorkspaceId === surveyWorkspaceId) {
      dispatch(deleteCurrnetWorkspaceSurvey(surveyId));
      dispatch(clearCurrentSurvey());
    }
    dispatch(
      deleteWorkspaceSurvey({ surveyId, workspaceId: surveyWorkspaceId })
    );
    dispatch(deleteSurvey(surveyId));
  } catch (error) {
    console.error("Error deleting survey:", error);
  }
};

export const updateSurveyF = async (
  survey: SurveyModel,
  currentSurveyId: string,
  surveyWorkspaceId: string,
  currentWorkspaceId: string,
  dispatch: Dispatch
) => {
  try {
    console.log(
      "updating survey",
      survey,
      currentSurveyId,
      surveyWorkspaceId,
      currentWorkspaceId
    );
    if (currentWorkspaceId === surveyWorkspaceId) {
      dispatch(updateCurrentWorkspaceSurveys(survey));
    }
    if (currentSurveyId === survey.id) {
      dispatch(updateCurrentSurvey(survey));
    }
    dispatch(updateSurveys(survey));
    dispatch(updateWorkspaceSurvey(survey));
  } catch (error) {
    console.error("Error updating survey title:", error);
  }
};

export const duplicateSurveyF = async (
  newSurvey: SurveyModel,
  currentWorkspaceId: string,
  dispatch: Dispatch
) => {
  try {
    if (newSurvey.workspaceId === currentWorkspaceId) {
      dispatch(addSurveyToCurrentWorkspace(newSurvey));
      dispatch(addSurvey(newSurvey));
    }

    dispatch(addSurveyToWorkspace(newSurvey));
  } catch (error) {
    console.error("Error duplicating survey:", error);
  }
};

export const moveSurveyF = async (
  surveyId: string,
  sourceWorkspaceId: string,
  targetWorkspaceId: string,
  currentWorkspaceId: string,
  survey: SurveyModel,
  dispatch: Dispatch
) => {
  try {
    console.log(currentWorkspaceId, sourceWorkspaceId);
    if (currentWorkspaceId === sourceWorkspaceId) {
      dispatch(deleteCurrnetWorkspaceSurvey(surveyId));
      dispatch(clearCurrentSurvey());
    }
    dispatch(deleteSurvey(surveyId));
    dispatch(
      moveSurveyToAnotherWorkspace({
        surveyId,
        sourceWorkspaceId,
        targetWorkspaceId,
      })
    );
    if (currentWorkspaceId === targetWorkspaceId) {
      dispatch(addSurveyToCurrentWorkspace(survey));
      dispatch(addSurvey(survey));
    }
  } catch (error) {
    console.error("Error moving survey:", error);
  }
};
