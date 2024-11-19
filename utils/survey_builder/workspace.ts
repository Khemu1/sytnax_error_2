import { setCurrentWorkspace, updateCurrentWorkspace } from "@/store/slices/survey/currentWorkspaceSlice";
import { setSurveys } from "@/store/slices/survey/surveySlice";
import { addWorkspace, updateWorkspace,deleteWorkspace } from "@/store/slices/survey/workspaceSlice";
import { WorkSpaceModel } from "@/types/survey";
import { Dispatch } from "@reduxjs/toolkit";

export const updateWorkspaceF = async (
  workspaceId: number,
  workspaceData: WorkSpaceModel,
  dispatch: Dispatch
) => {
  try {
    dispatch(updateCurrentWorkspace(workspaceData));
    dispatch(updateWorkspace({ workspaceData, id: +workspaceId }));
  } catch (error) {
    console.error("Error updating survey title:", error);
  }
};

export const deleteWorkspaceF = async (
  workspaceId: number,
  currentWorkspaceId: number,
  workspaces: WorkSpaceModel[],
  dispatch: Dispatch
) => {
  try {
    dispatch(deleteWorkspace(+workspaceId));
    if (+currentWorkspaceId === +workspaceId) {
      dispatch(setCurrentWorkspace(workspaces[0]));
      dispatch(setSurveys(workspaces[0].surveys || []));
    }
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

