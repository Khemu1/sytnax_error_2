import {
  addMembersToSurvey,
  addSurvey,
  deleteAllMembers,
  deleteMembers,
  deleteSurvey,
  duplicateSurvey,
  moveSurvey,
  resetAllMembersAttempts,
  resetAttempts,
  updateSurvey,
} from "@/store/slices/survey/surveySlice";
import {
  addSurveyToWorkspace,
  deleteWorkspaceSurvey,
  moveSurveyToAnotherWorkspace,
  updateWorkspaceSurvey,
} from "@/store/slices/survey/workspaceSlice";
import { SurveyModel } from "@/types/survey";
import { Dispatch } from "@reduxjs/toolkit";
import { SurveyParticipantModel } from "@/types/survey";

export const addSurveyF = (newSurvey: SurveyModel, dispatch: Dispatch) => {
  try {
    dispatch(addSurvey(newSurvey));
    dispatch(addSurveyToWorkspace(newSurvey));
  } catch (error) {
    console.error("Error adding survey:", error);
  }
};

export const deleteSurveyF = (
  surveyId: string,
  surveyWorkspaceId: string,
  dispatch: Dispatch
) => {
  try {
    dispatch(deleteSurvey({ workspaceId: surveyWorkspaceId, surveyId }));
    dispatch(
      deleteWorkspaceSurvey({ surveyId, workspaceId: surveyWorkspaceId })
    );
  } catch (error) {
    console.error("Error deleting survey:", error);
  }
};

export const updateSurveyF = (survey: SurveyModel, dispatch: Dispatch) => {
  try {
    dispatch(updateSurvey(survey));
    dispatch(updateWorkspaceSurvey(survey));
  } catch (error) {
    console.error("Error updating survey title:", error);
  }
};

export const duplicateSurveyF = (
  newSurvey: SurveyModel,
  dispatch: Dispatch
) => {
  try {
    dispatch(duplicateSurvey(newSurvey));
    dispatch(addSurveyToWorkspace(newSurvey));
  } catch (error) {
    console.error("Error duplicating survey:", error);
  }
};

export const moveSurveyF = (
  surveyId: string,
  sourceWorkspaceId: string,
  targetWorkspaceId: string,
  dispatch: Dispatch
) => {
  try {
    dispatch(moveSurvey(surveyId));
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

export const resetAllMembersAttemptsF = (
  surveyId: string,
  dispatch: Dispatch
) => {
  try {
    dispatch(resetAllMembersAttempts({ surveyId }));
  } catch (error) {
    console.error("Error resetting all members attempts:", error);
  }
};

export const resetMembersAttemptsF = (
  surveyId: string,
  members: SurveyParticipantModel[],
  dispatch: Dispatch
) => {
  try {
    dispatch(resetAttempts({ surveyId, members }));
  } catch (error) {
    console.error("Error resetting members attempts:", error);
  }
};

export const addMembersToSurveyF = (
  surveyId: string,
  members: SurveyParticipantModel[],
  dispatch: Dispatch
) => {
  try {
    console.log("arrive members", members);
    dispatch(addMembersToSurvey({ surveyId, members }));
  } catch (error) {
    console.error("Error adding members to survey:", error);
  }
};

export const deleteMembersFromSurveyF = (
  surveyId: string,
  members: SurveyParticipantModel[],
  dispatch: Dispatch
) => {
  try {
    dispatch(deleteMembers({ surveyId, members }));
  } catch (error) {
    console.error("Error deleting members from survey:", error);
  }
};

export const deleteAllMembersF = (surveyId: string, dispatch: Dispatch) => {
  try {
    dispatch(deleteAllMembers({ surveyId }));
  } catch (error) {
    console.error("Error deleting all members attempts:", error);
  }
};
