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
import { Dispatch } from "@reduxjs/toolkit";

export const addSurveyF = async (
  newSurvey: SurveyModel,
  dispatch: Dispatch
) => {
  try {
    dispatch(addSurveyToCurrentWorkspace(newSurvey));
    dispatch(addSurvey(newSurvey));
    dispatch(addSurveyToWorkspace(newSurvey));
  } catch (error) {
    console.error("Error adding survey:", error);
  }
};

export const deleteSurveyF = async (
  surveyId: string,
  surveyWorkspaceId: string,
  dispatch: Dispatch
) => {
  try {
    dispatch(clearCurrentSurvey());
    dispatch(deleteSurvey(surveyId));
    dispatch(deleteCurrnetWorkspaceSurvey(surveyId));
    dispatch(
      deleteWorkspaceSurvey({ surveyId, workspaceId: surveyWorkspaceId })
    );

  } catch (error) {
    console.error("Error deleting survey:", error);
  }
};

export const updateSurveyF = async (
  survey: SurveyModel,
  dispatch: Dispatch
) => {
  try {
    dispatch(updateSurveys(survey));
    dispatch(updateCurrentSurvey(survey));
    dispatch(updateCurrentWorkspaceSurveys(survey));
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
  dispatch: Dispatch
) => {
  try {
    dispatch(clearCurrentSurvey());
    dispatch(deleteSurvey(surveyId));
    dispatch(deleteCurrnetWorkspaceSurvey(surveyId));
    dispatch(
      moveSurveyToAnotherWorkspace({
        surveyId,
        sourceWorkspaceId,
        targetWorkspaceId,
      })
    );
  } catch (error) {
    console.error("Error moving survey:", error);
  }
};
