import { SubmissionModelForBuilder } from "@/types/buildSurvey";
import { Dialog, DialogPanel } from "@headlessui/react";
import ReviewQuiz from "@/components/quiz/ReviewQuiz";
import Image from "next/image";
interface SubmissionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  submission: SubmissionModelForBuilder;
  questionsPerPage: number;
}

const SubmissionDialog: React.FC<SubmissionDialogProps> = ({
  isOpen,
  onClose,
  submission,
  questionsPerPage,
}) => {
  return (
    <>
      <Dialog
        open={isOpen}
        as="div"
        className="relative z-10 focus:outline-0 overflow-hidden "
        onClose={close}
      >
        <div className="fixed inset-0 z-10 w-screen overflow-hidden ">
          <div className="flex min-h-full items-center justify-center ">
            <DialogPanel
              transition
              className="w-full h-[100dvh] overflow-hidden rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0 relative"
            >
              <div className="flex items-center pb-2 px-2 absolute top-10 right z-40">
                <button type="button" onClick={onClose}>
                  <Image
                    src="/assets/icons/close.svg"
                    alt="close"
                    className="w-[20px] h-[20px]"
                    width={20}
                    height={20}
                  />
                </button>
              </div>
              <ReviewQuiz
                submission={submission}
                questionsPerPage={questionsPerPage}
              />
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default SubmissionDialog;
