import { useMoveSurvey } from "@/hooks/survey_builder/survey";
import { RootState } from "@/store/store";
import { validateWithSchema } from "@/utils/validations/validations";
import {
  Dialog,
  DialogPanel,
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
} from "@headlessui/react";
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
  const { currentWorkspace, workspaces, currentSurvey, auth } = useSelector(
    (state: RootState) => ({
      currentWorkspace: state.workspace.currentWorkspace,
      workspaces: state.workspace.workspaces,
      currentSurvey: state.survey.currentSurvey,
      auth: state.auth,
    })
  );

  const [errors, setErrors] = useState<Record<string, string> | null>(null);
  const [targetWorkspaceId, setTargetWorkspaceId] = useState<string | null>(
    null
  );
  const [query, setQuery] = useState("");
  const { handleMoveSurvey, isError, errorState, isSuccess, isPending } =
    useMoveSurvey();

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

  // Filter workspaces based on user input and criteria
  const filteredWorkspaces = workspaces.filter((workspace) => {
    const isDifferentWorkspace = workspace.id !== currentWorkspace?.id;
    const isOwnedByUser = workspace.userId === auth.userId;
    const matchesQuery = workspace.name
      .toLowerCase()
      .includes(query.toLowerCase());

    return isDifferentWorkspace && isOwnedByUser && matchesQuery;
  });

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div
        className="fixed inset-0 bg-black bg-opacity-30"
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          transition
          className="w-[350px] max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
        >
          <form onSubmit={handleSave} className="w-full">
            <div className="flex w-full items-center pb-2 px-2">
              <button type="button" onClick={onClose}>
                <Image
                  src="/assets/icons/close.svg"
                  alt="close"
                  width={20}
                  height={20}
                />
              </button>
              <span className="flex flex-1 justify-center text-sm font-semibold text-white">
                Move Survey To
              </span>
            </div>

            <div className="w-full border-b border-b-gray-500 p-[2rem] relative">
              <p className="text-center mb-2">
                You can only move surveys to the user{"'"}s workspace
              </p>

              {/* Combobox */}
              <Combobox
                value={targetWorkspaceId}
                onChange={setTargetWorkspaceId}
              >
                <div className="relative">
                  <ComboboxInput
                    className="w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm text-white outline-none placeholder-gray-400"
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Write workspace name"
                    displayValue={(workspaceId) =>
                      workspaces.find((w) => w.id === workspaceId)?.name || ""
                    }
                  />
                  <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-gray-800 py-1 text-sm shadow-lg">
                    {filteredWorkspaces.length === 0 ? (
                      <div className="p-2 text-gray-400">
                        No workspace found
                      </div>
                    ) : (
                      filteredWorkspaces.map((workspace) => (
                        <ComboboxOption
                          key={workspace.id}
                          value={workspace.id}
                          className={({ active }) =>
                            `cursor-pointer select-none rounded-md px-3 py-2 ${
                              active
                                ? "bg-blue-600 text-white"
                                : "text-gray-300"
                            }`
                          }
                        >
                          <span className="block truncate">
                            {workspace.name}
                          </span>
                        </ComboboxOption>
                      ))
                    )}
                  </ComboboxOptions>
                </div>
              </Combobox>

              {((isError && errorState) ||
                (errors && errors.chooseWorkspace)) && (
                <div className="text-red-600 text-sm mt-2 px-4 text-center">
                  {errorState?.chooseWorkspace || errors?.chooseWorkspace}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-5 mt-4 px-4 font-semibold text-white">
              <button
                className="bg-red-700 py-2 px-4 rounded"
                type="button"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                disabled={isPending}
                className="flex justify-center items-center bg-blue-600 transition-all py-2 px-4 rounded"
                type="submit"
              >
                {isPending ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default MoveSurveyDialog;
