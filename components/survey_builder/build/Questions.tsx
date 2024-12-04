/* eslint-disable react-hooks/exhaustive-deps */
import { QuestionModel } from "@/types/buildSurvey";
import LabelPreivew from "./question/preview/LabelPreivew";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useCallback, useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import EditQuestion from "./question/dialogs/EditQuestion";
import {
  useDeleteQuestion,
  useDuplicateQuestion,
} from "@/hooks/survey_builder/question";
import Toast from "@/components/skeletons/Toast";

const Questions = () => {
  const { questions, currentSurvey } = useSelector((state: RootState) => ({
    questions: state.questions.items,
    currentSurvey: state.currentSurvey.currentSurvey,
  }));

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionModel | null>(
    null
  );
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const {
    handleDeleteEnding,
    isPending: deletePending,
    isSuccess: deleteSucess,
    errorState: deleteError,
  } = useDeleteQuestion();
  const {
    handleDuplicateQuestion,
    isPending: duplicatePending,
    isSuccess: duplicateSucess,
    errorState: duplicateError,
  } = useDuplicateQuestion();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const onClose = useCallback(() => {
    if (!currentSurvey) return;

    router.push(pathname, { scroll: false });

    setIsDialogOpen(false);
    setCurrentQuestion(null);
  }, [router, currentSurvey]);

  const openQuestionDialog = useCallback(
    (question: QuestionModel) => {
      if (!currentSurvey || !question) return;

      const currentUrl = `${pathname}`;
      const queryParams = `?edit=true&id=${question.id}`;
      router.push(currentUrl + queryParams, { scroll: false });

      setIsDialogOpen(true);
      setCurrentQuestion(question);
    },
    [router, currentSurvey]
  );

  const toggleMenu = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuId((prevId) => (prevId === id ? null : id));
  }, []);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    const target = event.target as Element;
    if (
      target &&
      !target.closest(".question-menu") &&
      !target.closest(".menu-toggle-button")
    ) {
      setOpenMenuId(null);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  useEffect(() => {
    // Make sure questions are available before performing any logic
    if (questions && questions.length > 0) {
      const questionIdFromUrl = searchParams.get("id");
      const question = questions.find(
        (question) => question.id === questionIdFromUrl
      );
      if (questionIdFromUrl && question) {
        setIsDialogOpen(true);
        setCurrentQuestion(question);
      } else {
        setOpenMenuId(null);
        onClose();
      }
    }
  }, [questions, searchParams]);
  useEffect(() => {
    if (deleteSucess) {
      setToast({
        message: "Question deleted successfully.",
        type: "success",
      });
    }
    if (deleteError) {
      setToast({
        message: "Error deleting question",
        type: "error",
      });
    }
    if (duplicateError) {
      setToast({
        message: "Error duplicating question",
        type: "error",
      });
    }

    if (duplicateSucess) {
      setToast({
        message: "Question duplicated successfully",
        type: "success",
      });
    }
  }, [
    deleteSucess,
    deleteError,
    duplicateError,
    duplicatePending,
    duplicateSucess,
  ]);

  if (questions.length < 1)
    return (
      <div className="flex w-full font-semibold justify-center items-center ">
        Start Adding Questions
      </div>
    );
  return (
    <>
      <div className="flex flex-col gap-4 p-4 h-[600px] overflow-y-scroll">
        {questions.map((question, index) => (
          <div
            key={question.id}
            className="cursor-pointer flex justify-between p-2 bg-[#42484b5b] rounded-md hover:bg-[#42484b86] transition-all relative"
            onClick={() => openQuestionDialog(question)}
          >
            <div className="grid gap-4 items-center grid-cols-[auto,100px,auto,auto] md:grid-cols-[auto,200px,auto,auto] lg:grid-cols-[auto,300px,auto,auto]">
              <div className="flex gap-2 items-center ">
                <Image
                  src="/assets/icons/text.svg"
                  alt="Question Icon"
                  width={30}
                  height={30}
                />
                <span className="font-semibold">{index + 1}</span>
              </div>
              <div className="text-left text-[1rem] font-semibold sm:ml-2 md:ml-0">
                <LabelPreivew label={question.label} />
              </div>
              <span className="font-semibold">|</span>
              <div className="text-left font-semibold">
                {question.points} Point{question.points > 1 ? "s" : ""}
              </div>
            </div>

            <button
              className="flex justify-center items-center border w-[50px] h-[30px] border-[#85808025] rounded-lg menu-toggle-button"
              onClick={(e) => {
                e.stopPropagation();
                toggleMenu(question.id, e);
              }}
            >
              <Image
                src="/assets/icons/dots.svg"
                alt="menu"
                height={30}
                width={50}
              />
            </button>

            {openMenuId === question.id && (
              <div className="question-menu w-[85.25px] h-[90px] flex flex-col text-left right-0 text-sm absolute top-10 bg-[#0e0e0e] p-2 rounded-md shadow-md z-10">
                <button
                  className="survey_card_buttons flex justify-center items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!currentSurvey) {
                      setToast({
                        message: "Unable to duplicate question",
                        type: "error",
                      });
                      console.error("No current survey");
                      return;
                    }
                    handleDuplicateQuestion({
                      questionId: question.id,
                      surveyId: question.surveyId,
                      workspaceId: currentSurvey?.workspaceId,
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
                  className="survey_card_buttons text-red-600 justify-center items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!currentSurvey) {
                      setToast({
                        message: "Unable to delete question",
                        type: "error",
                      });
                      console.error("No current survey");
                      return;
                    }
                    handleDeleteEnding({
                      questionId: question.id,
                      surveyId: question.surveyId,
                      workspaceId: currentSurvey?.workspaceId,
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
        ))}
      </div>
      {isDialogOpen && currentQuestion && (
        <EditQuestion
          isOpen={isDialogOpen}
          onClose={onClose}
          question={currentQuestion}
          workspaceId={currentSurvey!.workspaceId}
        />
      )}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          duration={1500}
        />
      )}
    </>
  );
};

export default Questions;
