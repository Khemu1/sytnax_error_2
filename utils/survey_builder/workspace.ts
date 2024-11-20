import { clearCurrentWorkspace, updateCurrentWorkspace } from "@/store/slices/survey/currentWorkspaceSlice";
import {
  addWorkspace,
  updateWorkspaces,
  deleteWorkspace,
} from "@/store/slices/survey/workspaceSlice";
import { WorkSpaceModel } from "@/types/survey";
import { Dispatch } from "@reduxjs/toolkit";

export const updateWorkspaceF = async (
  workspaceId: string,
  workspaceData: WorkSpaceModel,
  dispatch: Dispatch
) => {
  try {
    dispatch(updateCurrentWorkspace(workspaceData));
    dispatch(updateWorkspaces({ workspaceData, id: workspaceId }));
  } catch (error) {
    console.error("Error updating survey title:", error);
  }
};

export const deleteWorkspaceF = async (
  workspaceId: string,
  dispatch: Dispatch
) => {
  try {
    dispatch(deleteWorkspace(workspaceId));
    dispatch(clearCurrentWorkspace());
  } catch (error) {
    console.error("Error deleting workspace:", error);
  }
};

export const addNewWorkspaceF = async (
  workspace: WorkSpaceModel,
  dispatch: Dispatch
) => {
  try {
    dispatch(addWorkspace(workspace));
  } catch (error) {
    console.error("Error deleting survey:", error);
  }
};


export const retrunSearchData = (
  allWorkspaces: WorkSpaceModel[],
  searchTerm: string
) => {
  const allSurveys = allWorkspaces.map((workspace) => workspace.surveys).flat();
  const workspaceList = allWorkspaces.map((workspace) => workspace.name);
  const filteredWorkspaces = workspaceList.filter((workspace) =>
    workspace.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredSurveys = allSurveys.filter((survey) =>
    survey.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    workspaces: filteredWorkspaces,
    surveys: filteredSurveys,
  };
};

