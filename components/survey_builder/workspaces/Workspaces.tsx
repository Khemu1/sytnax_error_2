import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Workspace from "./Workspace";
import { RootState } from "@/store/store";
import { setCurrentWorkspace } from "@/store/slices/survey/currentWorkspaceSlice";
import { setSurveys } from "@/store/slices/survey/surveySlice";
import { WorkSpaceModel } from "@/types/survey";

const Workspaces = () => {
  const dispatch = useDispatch();
  const { currentWorkspace, workspaces } = useSelector((state: RootState) => ({
    currentWorkspace: state.currentWorkspace.currentWorkspace,
    workspaces: state.workspace.workspaces,
  }));

  useEffect(() => {
    if (workspaces.length > 0 && !currentWorkspace) {
      const initialWorkspace = workspaces[0];

      dispatch(setCurrentWorkspace(initialWorkspace));
      if (initialWorkspace.surveys && initialWorkspace.surveys.length > 0) {
        dispatch(setSurveys(initialWorkspace.surveys));
      } else {
        dispatch(setSurveys([]));
      }
    }
  }, [workspaces, currentWorkspace, dispatch]);

  const handleWorkspaceSelect = (workspace: WorkSpaceModel) => {
    dispatch(setCurrentWorkspace(workspace));
    dispatch(setSurveys(workspace.surveys || []));
  };

  return (
    <div className="flex flex-col w-full gap-2">
      {workspaces.map((workspace: WorkSpaceModel) => (
        <Workspace
          key={workspace.id}
          selected={currentWorkspace?.id === workspace.id}
          workspace={workspace}
          length={workspace.surveys?.length || 0}
          onSelect={handleWorkspaceSelect}
        />
      ))}
    </div>
  );
};

export default Workspaces;
