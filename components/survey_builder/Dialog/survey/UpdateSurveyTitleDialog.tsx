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

  const { currentSurveyState, currentWorkspaceState } = useSelector(
    (state: RootState) => ({
      currentSurveyState: state.survey.currentSurvey,
      currentWorkspaceState: state.workspace.currentWorkspace,
    })
  );

  const [name, setName] = useState(currentSurveyState?.name || "");
  const [errors, setErros] = useState<Record<string, string> | null>(null);
  const { handleUpdateSurvey, isError, errorState, isSuccess, isPending } =
    useUpdateSurvey();

  const handleSave = async (e: React.FormEvent) => {
    setErros(null);
    e.preventDefault();
    setIsSubmitting(true);

    const currentSurveyId = currentSurveyState?.id;
    const workspaceId = currentWorkspaceState?.id;

    if (!workspaceId || !currentSurveyId) {
      setIsSubmitting(false);
      return;
    }

    try {
      newSurveySchema().parse({ name });
      await handleUpdateSurvey({
        name,
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
      setName("");
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
          className=" max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0 w-[300px]"
        >
          <div className="">
            <form onSubmit={handleSave} className="">
              <div className="flex w-full items-center  pb-2 px-2">
                <button type="button" className="" onClick={onClose}>
                  <Image
                    src="/assets/icons/close.svg"
                    alt="close"
                    width={20}
                    height={20}
                  />
                </button>
                <span className="flex flex-1 justify-center text-white font-semibold">
                  Rename Survey
                </span>
              </div>

              <div className="border-b border-b-gray-500 p-[2rem]">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#2a2a2a] text-white border-none outline-0 p-2 rounded-md"
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
                  onClick={() => {
                    setName("");
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
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default UpdateSurveyTitleDialog;
