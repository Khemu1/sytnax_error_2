import { useUpdateWorkspaceTitle } from "@/hooks/survey_builder/workspace";
import { RootState } from "@/store/store";
import { newSurveySchema } from "@/utils/validations/survey";
import { validateWithSchema } from "@/utils/validations/validations";
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

  const [title, setTitle] = useState("");
  const [errors, setErros] = useState<Record<string, string> | null>(null);
  const { handleUpdateWorkspaceTitle, isError, errorState, isSuccess } =
    useUpdateWorkspaceTitle();

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
      newSurveySchema().parse({ title });
      await handleUpdateWorkspaceTitle({
        title,
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
      setTitle("");
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isOpen && currentWorkspaceState.currentWorkspace) {
      setTitle(currentWorkspaceState.currentWorkspace.title);
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
        <DialogPanel className="bg-[#1e1e1e] rounded-md py-5 w-[300px]">
          <div className="">
            <form onSubmit={handleSave} className="">
              <div className="flex w-full items-center border-b border-b-gray-500 pb-2 px-2">
                <button type="button" className="" onClick={onClose}>
                  <Image
                    src="/assets/icons/close.svg"
                    alt="close"
                    width={20}
                    height={20}
                  />
                </button>
                <span className="flex flex-1 justify-center text-white">
                  Rename Workspace
                </span>
              </div>

              <div className="border-b border-b-gray-500 p-[2rem]">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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

              <div className="flex justify-end gap-5 mt-4 px-4">
                <button
                  className=" bg-[#2f2b7226] py-2 px-4 rounded"
                  type="button"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  className=" bg-[#2c2f31] transition-all  py-2 px-4 rounded"
                  type="submit"
                >
                  Save
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
