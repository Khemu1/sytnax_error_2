import { useCreateWorkspace } from "@/hooks/survey_builder/workspace";
import { RootState } from "@/store/store";
import { newSurveySchema } from "@/utils/validations/survey";
import { validateWithSchema } from "@/utils/validations/validations";
import { Dialog, DialogPanel } from "@headlessui/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface CreateWorkspaceDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateWorkspaceDialog: React.FC<CreateWorkspaceDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const currentWorkspace = useSelector(
    (state: RootState) => state.currentWorkspace.currentWorkspace
  );
  const [workspaceTitle, setWorkspaceTitle] = useState("");
  const [errors, setErrors] = useState<Record<string, string> | null>(null);

  const { handleCreateWorkspace, isError, errorState, isSuccess } =
    useCreateWorkspace();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(null);

    try {
      newSurveySchema().parse({ title: workspaceTitle });

      if (!currentWorkspace?.id) {
        setErrors({ chooseWorkspace: "an Unkown Error Occured" });
        return;
      }

      await handleCreateWorkspace({
        title: workspaceTitle,
      });
    } catch (error) {
      setErrors(validateWithSchema(error));
      console.error("Failed to create survey", error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setWorkspaceTitle("");
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
        <DialogPanel className="bg-[#1e1e1e] rounded-md py-5 w-[300px]">
          <form onSubmit={handleSave}>
            <div className="flex w-full items-center border-b border-b-gray-500 pb-2 px-2">
              <button
                type="button"
                onClick={() => {
                  setWorkspaceTitle("");
                  onClose();
                }}
              >
                <Image
                  src="/assets/icons/close.svg"
                  alt="close"
                  className="w-[20px] h-[20px]"
                  width={20}
                  height={20}
                />
              </button>
              <span className="flex flex-1 justify-center text-white">
                Create Workspace
              </span>
            </div>

            <div className="border-b border-b-gray-500 p-[2rem]">
              <input
                type="text"
                value={workspaceTitle}
                placeholder="Enter Workspace Title"
                onChange={(e) => setWorkspaceTitle(e.target.value)}
                className="w-full bg-[#2a2a2a] text-white border-none outline-none p-2 rounded-md"
              />
              {((isError && errorState?.title) || (errors && errors.title)) && (
                <div className="text-red-600 text-sm mt-2 px-4 text-center">
                  {errorState?.title || errors?.title}
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
                onClick={() => {
                  setWorkspaceTitle("");
                  onClose();
                }}
              >
                Cancel
              </button>
              <button
                className="bg-[#2c2f31] transition-all py-2 px-4 rounded"
                type="submit"
              >
                Save
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default CreateWorkspaceDialog;
