import {
  useDeleteQuestion,
  useDuplicateQuestion,
} from "@/hooks/survey_builder/question";
import { QuestionModel } from "@/types/buildSurvey";
import { SurveyModel } from "@/types/survey";
import Image from "next/image";
import { useEffect, useRef, useCallback, useState } from "react";

const Question: React.FC<{
  question: QuestionModel;
  index: number;
  openQuestionDialog: (question: QuestionModel) => void;
  currentSurvey: SurveyModel;
  setToast: (toast: { message: string; type: "success" | "error" }) => void;
}> = ({ question, index, openQuestionDialog, currentSurvey, setToast }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen((prev) => !prev);
  };
  const {
    handleDeleteEnding,
    isPending: deletePending,
    isSuccess: deleteSuccess,
    errorState: deleteError,
  } = useDeleteQuestion();

  const {
    handleDuplicateQuestion,
    isPending: duplicatePending,
    isSuccess: duplicateSuccess,
    errorState: duplicateError,
  } = useDuplicateQuestion();

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  useEffect(() => {
    if (deleteSuccess) {
      console.log("delete success");
      setToast({ message: "Question deleted successfully.", type: "success" });
    }
    if (deleteError) {
      setToast({ message: "Error deleting question", type: "error" });
    }
    if (duplicateError) {
      setToast({ message: "Error duplicating question", type: "error" });
    }
    if (duplicateSuccess) {
      setToast({
        message: "Question duplicated successfully",
        type: "success",
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteSuccess, deleteError, duplicateError, duplicateSuccess]);

  return (
    <div
      className="cursor-pointer flex justify-between p-2 bg-[#42484b5b] rounded-md hover:bg-[#42484b86] transition-all relative"
      onClick={() => openQuestionDialog(question)}
    >
      <div className="grid gap-4 items-center grid-cols-[auto,100px,auto,auto] md:grid-cols-[auto,200px,auto,auto] lg:grid-cols-[auto,300px,auto,auto]">
        <div className="flex gap-2 items-center">
          <Image
            src="/assets/icons/text.svg"
            alt="Question Icon"
            width={30}
            height={30}
          />
          <span className="font-semibold">{index + 1}</span>
        </div>
        <div
          className="build_label"
          dangerouslySetInnerHTML={{ __html: question.label }}
        ></div>
        <span className="font-semibold">|</span>
        <div className="text-left font-semibold">
          {question.points} Point{question.points > 1 ? "s" : ""}
        </div>
      </div>

      <button
        className="flex justify-center items-center border w-[50px] h-[30px] border-[#85808025] rounded-lg menu-toggle-button"
        onClick={toggleMenu}
      >
        <Image src="/assets/icons/dots.svg" alt="menu" height={30} width={50} />
      </button>

      {isMenuOpen && (
        <div
          ref={menuRef}
          className="question-menu w-[85.25px] h-[90px] flex flex-col text-left right-0 text-sm absolute top-10 bg-[#0e0e0e] p-2 rounded-md shadow-md z-10"
        >
          <button
            className="survey_card_buttons flex justify-center items-center h-[36px]"
            onClick={(e) => {
              e.stopPropagation();
              if (!currentSurvey) {
                setToast({
                  message: "Unable to duplicate question",
                  type: "error",
                });
                return;
              }
              handleDuplicateQuestion({
                questionId: question.id,
                surveyId: question.surveyId,
                workspaceId: currentSurvey.workspaceId,
              });
            }}
          >
            {duplicatePending ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              "Duplicate"
            )}
          </button>

          <button
            className="survey_card_buttons text-red-600 justify-center items-center h-[36px]"
            onClick={(e) => {
              e.stopPropagation();
              if (!currentSurvey) {
                setToast({
                  message: "Unable to delete question",
                  type: "error",
                });
                return;
              }
              handleDeleteEnding({
                questionId: question.id,
                surveyId: question.surveyId,
                workspaceId: currentSurvey.workspaceId,
              });
            }}
          >
            {deletePending ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default Question;
