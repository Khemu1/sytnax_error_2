import { QuestionModel } from "@/types/buildSurvey";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useCallback, useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import EditQuestion from "./question/dialogs/EditQuestion";
import Toast from "@/components/skeletons/Toast";
import Question from "./Question";

const Questions = () => {
  const questions = useSelector((state: RootState) => state.questions.items);
  const currentSurvey = useSelector(
    (state: RootState) => state.survey.currentSurvey
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionModel | null>(
    null
  );
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const onClose = useCallback(() => {
    if (!currentSurvey) return;

    router.push(pathname, { scroll: false });
    setIsDialogOpen(false);
    setCurrentQuestion(null);
  }, [router, currentSurvey, pathname]);

  const openQuestionDialog = useCallback(
    (question: QuestionModel) => {
      if (!currentSurvey || !question) return;

      const currentUrl = `${pathname}`;
      const queryParams = `?edit=true&id=${question.id}`;
      router.push(currentUrl + queryParams, { scroll: false });

      setIsDialogOpen(true);
      setCurrentQuestion(question);
    },
    [router, currentSurvey, pathname]
  );

  useEffect(() => {
    if (questions && questions.length > 0) {
      const questionIdFromUrl = searchParams.get("id");
      const question = questions.find(
        (question) => question.id === questionIdFromUrl
      );

      if (questionIdFromUrl && question) {
        setIsDialogOpen(true);
        setCurrentQuestion(question);
      } else {
        onClose();
      }
    }
  }, [questions, searchParams, onClose]);

  if (questions.length < 1) {
    return (
      <div className="flex w-full font-semibold justify-center items-center">
        Start Adding Questions
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4 p-4 h-[600px] overflow-y-scroll">
        {currentSurvey &&
          questions.map((question, index) => (
            <Question
              index={index}
              key={question.id + "index"}
              question={question}
              openQuestionDialog={openQuestionDialog}
              currentSurvey={currentSurvey}
              setToast={setToast}
            />
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

      {/* Toast component */}
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
