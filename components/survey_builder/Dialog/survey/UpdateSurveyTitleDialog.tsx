import { useUpdateSurvey } from "@/hooks/survey_builder/survey";
import { RootState } from "@/store/store";
import { newSurveySchema } from "@/utils/validations/survey";
import { validateWithSchema } from "@/utils/validations/validations";
import { Dialog, DialogPanel } from "@headlessui/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";

interface UpdateSurveyTitleDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const UpdateSurveyTitleDialog: React.FC<UpdateSurveyTitleDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  //todo: call the selector once
  const currentSurveyState = useSelector(
    (state: RootState) => state.currentSurvey
  );
  const currentWorkspaceState = useSelector(
    (state: RootState) => state.currentWorkspace
  );

  const [title, setTitle] = useState(
    currentSurveyState.currentSurvey?.title || ""
  );
  const [errors, setErros] = useState<Record<string, string> | null>(null);
  const { handleUpdateSurvey, isError, errorState, isSuccess } =
    useUpdateSurvey();

  const handleSave = async (e: React.FormEvent) => {
    setErros(null);
    e.preventDefault();
    setIsSubmitting(true);

    const currentSurveyId = currentSurveyState.currentSurvey?.id;
    const workspaceId = currentWorkspaceState.currentWorkspace?.id;

    if (!workspaceId || !currentSurveyId) {
      setIsSubmitting(false);
      return;
    }

    try {
      newSurveySchema().parse({ title });
      console.log("heading to update", title);
      await handleUpdateSurvey({
        title,
        surveyId: currentSurveyId,
        workspaceId: workspaceId,
      });
    } catch (error) {
      setErros(validateWithSchema(error));
      console.error("Failed to update survey", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setTitle("");
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
                  Rename Survey
                </span>
              </div>

              <div className="border-b border-b-gray-500 p-[2rem]">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
                  disabled={isSubmitting}
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

export default UpdateSurveyTitleDialog;
