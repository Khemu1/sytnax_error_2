import { useUpdateWorkspaceName } from "@/hooks/survey_builder/workspace";
import { RootState } from "@/store/store";
import { validateWithSchema } from "@/utils/validations/validations";
import { newWorkspaceSchema } from "@/utils/validations/workspace";
import { Dialog, DialogPanel } from "@headlessui/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface UpdateSurveyWorkspaceTitleDialog {
  isOpen: boolean;
  onClose: () => void;
}

const UpdateWorkspaceTitleDialog: React.FC<
  UpdateSurveyWorkspaceTitleDialog
> = ({ isOpen, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentWorkspaceState = useSelector(
    (state: RootState) => state.currentWorkspace
  );

  const [workspaceName, setworkspaceName] = useState("");
  const [errors, setErros] = useState<Record<string, string> | null>(null);
  const {
    handleUpdateWorkspaceName,
    isError,
    errorState,
    isSuccess,
    isPending,
  } = useUpdateWorkspaceName();

  const handleSave = async (e: React.FormEvent) => {
    setErros(null);
    e.preventDefault();
    setIsSubmitting(true);

    const workspaceId = currentWorkspaceState.currentWorkspace?.id;

    if (!workspaceId) {
      setIsSubmitting(false);
      alert("missing workspace id");
      return;
    }

    try {
      newWorkspaceSchema().parse({ name: workspaceName });
      await handleUpdateWorkspaceName({
        name: workspaceName,
        workspaceId: workspaceId,
      });
    } catch (error) {
      setErros(validateWithSchema(error));
      console.error("Failed to update workspace", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      onClose();
      setworkspaceName("");
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isOpen && currentWorkspaceState.currentWorkspace) {
      setworkspaceName(currentWorkspaceState.currentWorkspace.name);
    }
  }, [isOpen, currentWorkspaceState.currentWorkspace]);

  if (!currentWorkspaceState) {
    return <div>loading...</div>;
  }

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
          <div className="">
            <form onSubmit={handleSave} className="">
              <div className="flex w-full items-center pb-2 px-2">
                <button type="button" className="" onClick={onClose}>
                  <Image
                    src="/assets/icons/close.svg"
                    alt="close"
                    width={20}
                    height={20}
                  />
                </button>
                <span className="flex flex-1 justify-center text-white font-semibold">
                  Rename Workspace
                </span>
              </div>

              <div className="border-b border-b-gray-500 p-[2rem]">
                <input
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setworkspaceName(e.target.value)}
                  placeholder="Enter Workspace Title"
                  className="w-full bg-[#2a2a2a] text-white border-none outline-none p-2 rounded-md"
                  disabled={isSubmitting}
                />
              </div>

              {((isError && errorState) || (errors && errors.title)) && (
                <div className="text-red-600 text-sm mt-2 px-4 text-center">
                  {errorState?.message || errors?.title}
                </div>
              )}

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
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default UpdateWorkspaceTitleDialog;
