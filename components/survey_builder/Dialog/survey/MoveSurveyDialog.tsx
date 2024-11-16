import { useMoveSurvey } from "@/hooks/survey_builder/survey";
import { RootState } from "@/store/store";
import { validateWithSchema } from "@/utils/validations/validations";
import { Dialog, Select } from "@headlessui/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface MoveSurveyDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const MoveSurveyDialog: React.FC<MoveSurveyDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const currentWorkspace = useSelector(
    (state: RootState) => state.currentWorkspace.currentWorkspace
  );
  const workspaces = useSelector(
    (state: RootState) => state.workspace.workspaces
  );
  const currentSurvey = useSelector(
    (state: RootState) => state.currentSurvey.currentSurvey
  );
  const [errors, setErrors] = useState<Record<string, string> | null>(null);

  const [targetWorkspaceId, setTargetWorkspaceId] = useState<number | null>(
    null
  );
  const { handleMoveSurvey, isError, errorState, isSuccess } = useMoveSurvey();

  const handleSave = (e: React.FormEvent) => {
    try {
      e.preventDefault();

      if (!targetWorkspaceId || !currentSurvey?.id || !currentWorkspace?.id) {
        setErrors({ chooseWorkspace: "Please Choose a Workspace" });

        return;
      }

      handleMoveSurvey({
        workspaceId: currentWorkspace?.id,
        surveyId: currentSurvey.id,
        targetWorkspaceId,
      });
    } catch (error) {
      setErrors(validateWithSchema(error));
      console.error("Failed to move survey", error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      onClose();
    }
  }, [isSuccess]);

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div
        className="fixed inset-0 bg-black bg-opacity-30"
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="flex flex-col justify-center items-center text-sm text-[#BCB6AE] bg-[#1e1e1e] rounded-md py-5 w-[350px] h-[250px]">
          <form onSubmit={handleSave} className="w-full">
            <div className="flex w-full items-center border-b border-b-gray-500 pb-2 px-2">
              <button type="button" onClick={onClose}>
                <Image
                  src="/assets/icons/close.svg"
                  alt="close"
                  width={20}
                  height={20}
                />
              </button>
              <span className="flex flex-1 justify-center text-sm">
                Move To
              </span>
            </div>

            <div className="border-b border-b-gray-500 p-[2rem]">
              <Select
                value={targetWorkspaceId || ""}
                onChange={(e) => setTargetWorkspaceId(+e.target.value)}
                aria-label={"Select Workspace"}
                className="w-full bg-[#2a2a2a] border-none outline-none p-2 rounded-md"
              >
                <option value="" disabled>
                  Select Workspace
                </option>
                {workspaces.map((workspace) => {
                  if (workspace.id !== currentWorkspace!.id) {
                    return (
                      <option key={workspace.id} value={workspace.id}>
                        {workspace.title}
                      </option>
                    );
                  }
                  return null;
                })}
              </Select>
              {((isError && errorState) ||
                (errors && errors.chooseWorkspace)) && (
                <div className="text-red-600 text-sm mt-2 px-4 text-center">
                  {errorState?.message}
                </div>
              )}
            </div>

            {isError && errorState && (
              <div className="text-red-600 text-sm mt-2 px-4">
                {errorState.message}
              </div>
            )}

            <div className="flex justify-end gap-5 mt-4 px-4">
              <button
                className="bg-[#2f2b7226] py-2 px-4 rounded"
                type="button"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="bg-[#2c2f31] transition-all py-2 px-4 rounded"
                type="submit"
              >
                Move
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default MoveSurveyDialog;
