import { useCreateWorkspace } from "@/hooks/survey_builder/workspace";
import { validateWithSchema } from "@/utils/validations/validations";
import { newWorkspaceSchema } from "@/utils/validations/workspace";
import { Dialog, DialogPanel } from "@headlessui/react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface CreateWorkspaceDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateWorkspaceDialog: React.FC<CreateWorkspaceDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const [workspaceTitle, setWorkspaceTitle] = useState("");
  const [errors, setErrors] = useState<Record<string, string> | null>(null);

  const { handleCreateWorkspace, isError, errorState, isSuccess,isPending } =
    useCreateWorkspace();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(null);

    try {
      newWorkspaceSchema().parse({ name: workspaceTitle });

      await handleCreateWorkspace({
        name: workspaceTitle,
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
        <DialogPanel
          transition
          className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
        >
          {" "}
          <form onSubmit={handleSave}>
            <div className="flex w-full items-center pb-2 px-2">
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
              <span className="flex flex-1 justify-center text-white font-semibold">
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
              {((isError && errorState?.name) || (errors && errors.name)) && (
                <div className="text-red-600 text-sm mt-2 px-4 text-center">
                  {errorState?.name || errors?.name}
                </div>
              )}
            </div>

            {isError && errorState && (
              <div className="text-red-600 text-sm mt-2 px-4">
                {errorState.message}
              </div>
            )}

            <div className="flex justify-end gap-5 mt-4 px-4 font-semibold text-white">
              <button
                className="bg-red-700 py-2 px-4 rounded"
                type="button"
                onClick={() => {
                  setWorkspaceTitle("");
                  onClose();
                }}
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

export default CreateWorkspaceDialog;
