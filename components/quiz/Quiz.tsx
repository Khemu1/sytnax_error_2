/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useMemo, useEffect } from "react";
import { SurveyModel } from "@/types/survey";
import { QuestionModel } from "@/types/buildSurvey";
import { formatTimeForTimer } from "@/utils";
import WarningDialog from "./WarningDialog";
import "@/styles/quiz.css";

const Quiz: React.FC<{
  survey: Omit<SurveyModel, "questions">;
  questions: QuestionModel[];
  handleSubmit: (clean: boolean) => void;
  handleAnswerSelection: (
    questionId: string,
    selectedAnswers: string[],
    values: string[]
  ) => void;
  isSubmitting: boolean;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
  survey,
  handleSubmit,
  questions,
  handleAnswerSelection,
  isSubmitting,
  setIsSubmitting,
}) => {
  const [isWarningDialogOpen, setIsWarningDialogOpen] = useState({
    state: false,
    message: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string[]>
  >({});

  const [isMounted, setIsMounted] = useState(false);
  const [timer, setTimer] = useState(survey.duration * 60);
  const [oneMinuteLeft, setOneMinuteLeft] = useState(false);

  const startIndex = (currentPage - 1) * (survey.questionsPerPage || 1);
  const totalPages = useMemo(() => {
    return Math.ceil(questions.length / (survey.questionsPerPage || 1));
  }, [questions.length, survey.questionsPerPage]);

  const currentQuestions = useMemo(() => {
    const start = (currentPage - 1) * survey.questionsPerPage;
    const end = start + survey.questionsPerPage;
    return questions.slice(start, end);
  }, [currentPage, questions, survey.questionsPerPage]);

  const pagination = useMemo(() => {
    const pages = [];
    if (totalPages <= 3) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage === 1) {
        pages.push(1, 2, totalPages);
      } else if (currentPage === totalPages) {
        pages.push(1, totalPages - 1, totalPages);
      } else {
        pages.push(currentPage - 1, currentPage, currentPage + 1);
      }
    }
    return pages;
  }, [currentPage, totalPages]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      syncAnswersToParent();
      setCurrentPage(page);
    }
  };

  const handleAnswerClick = (
    questionId: string,
    answerId: string,
    allowMultiple: boolean
  ) => {
    console.log("handleAnswerClick", questionId, answerId, allowMultiple);
    setSelectedAnswers((prev) => {
      const currentAnswers = prev[questionId] || [];

      if (allowMultiple) {
        if (currentAnswers.includes(answerId)) {
          return {
            ...prev,
            [questionId]: currentAnswers.filter((id) => id !== answerId),
          };
        }
        if (currentAnswers.length < 2) {
          return { ...prev, [questionId]: [...currentAnswers, answerId] };
        }

        return { ...prev, [questionId]: [currentAnswers[0], answerId] };
      }

      return { ...prev, [questionId]: [answerId] };
    });
  };

  const syncAnswersToParent = () => {
    Object.entries(selectedAnswers).forEach(([questionId, answersIds]) => {
      const answerDetails = answersIds.map((id) => {
        const question = questions.find((q) => q.id === questionId);
        const answerObj = question?.questionAnswers.find((a) => a.id === id);
        return answerObj ? answerObj.answer : "";
      });

      handleAnswerSelection(questionId, answersIds, answerDetails);
    });
  };

  // Avoid calling handleAnswerSelection directly in the render cycle otherwise it won't update the state .

  useEffect(() => {
    if (Object.keys(selectedAnswers).length > 0) {
      syncAnswersToParent();
    }
  }, [selectedAnswers]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && !isSubmitting) {
        setTimer(0);
        setIsSubmitting(true);
        setIsWarningDialogOpen({
          state: true,
          message:
            "You Tabbed out, Quiz is closed and you won't be allowed to see your grades and the instructor will be notified",
        });
        setTimeout(() => {
          handleSubmit(false);
        }, 5000);
      }
    };

    const handleWindowBlur = () => {
      if (!isSubmitting) {
        setIsSubmitting(true);
        setTimer(0);
        setIsWarningDialogOpen({
          state: true,
          message:
            "You unfocused the window, Quiz is closed and you won't be allowed to see your grades and the instructor will be notified",
        });
        setTimeout(() => {
          handleSubmit(false);
        }, 5000);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, [handleSubmit]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 0) {
          return 0;
        }
        if (prev <= 60 && !oneMinuteLeft) {
          setOneMinuteLeft(true);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [oneMinuteLeft]);

  useEffect(() => {
    if (timer === 0 && !isSubmitting) {
      setIsSubmitting(true);
      handleSubmit(true);
    }
  }, [timer]);

  if (!isMounted) return null;

  return (
    <>
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <div className="absolute w-full top-0 flex justify-between items-center p-2 z-10 bg-base-300">
          <div
            className={`w-max border border-[#42484b] p-2 rounded-md font-semibold ${
              oneMinuteLeft ? "text-red-600" : "text-white"
            }`}
          >
            {formatTimeForTimer(timer)}
          </div>
          <button
            disabled={isSubmitting}
            className="flex items-center justify-center w-[150px] bg-blue-600 p-2 rounded-md text-white font-semibold"
            onClick={() => {
              setIsSubmitting(true);
              setTimer(0);
              handleSubmit(true);
            }}
          >
            {isSubmitting ? (
              <span className="loading loading-ring loading-md"></span>
            ) : (
              "Submit"
            )}
          </button>
        </div>

        <div className="quiz-question-container">
          {currentQuestions.map((question, index) => (
            <div
              key={question.id}
              className={`flex flex-col gap-4 sm:w-[800px] ${
                index + 1 !== survey.questionsPerPage &&
                startIndex + index + 1 !== questions.length
                  ? "border-b"
                  : ""
              } py-8 border-gray-700`}
            >
              <span className="font-extrabold text-[20px]">
                {startIndex + index + 1}
                {")"}
              </span>
              {question.questionImage && (
                <div className={`flex justify-center mt-6 mb-4`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={question.questionImage.url}
                    alt="Preview"
                    className={`flex justify-start mt-6 mb-4 
                        sm:max-w-[500px] sm:max-h-[500px]
                        "max-w-[300px] max-h-[300px]
                  `}
                  />
                </div>
              )}
              <div
                className="mt-4 text-center"
                dangerouslySetInnerHTML={{ __html: question.label }}
              ></div>
              {question.description && (
                <div
                  className="mt-4 text-center"
                  dangerouslySetInnerHTML={{ __html: question.description }}
                ></div>
              )}
              {question.questionAnswers.length > 0 && (
                <div className="flex flex-col flex-wrap gap-2 w-full items-center mt-7">
                  {question.questionAnswers.map((answer) => (
                    <label
                      key={answer.id}
                      className={`flex items-center gap-2 w-[300px] cursor-pointer ${
                        selectedAnswers[question.id]?.includes(answer.id)
                          ? "bg-green-600 text-white"
                          : "bg-blue-600 text-white"
                      } transition-all rounded-md py-2 px-4`}
                    >
                      <input
                        type={
                          question.allowMultipleAnswers ? "checkbox" : "radio"
                        }
                        disabled={isSubmitting}
                        name={`answer-${question.id}`}
                        value={answer.id}
                        checked={
                          selectedAnswers[question.id]?.includes(answer.id) ||
                          false
                        }
                        onChange={() =>
                          handleAnswerClick(
                            question.id,
                            answer.id,
                            question.allowMultipleAnswers || false
                          )
                        }
                        className="hidden"
                      />
                      <span>{answer.answer}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <footer className="staicky bottom-0 shadow-md p-4 bg-base-300">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              className="join-item btn btn-outline w-full sm:w-auto"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            <div className="flex gap-1">
              {pagination.map((page) => (
                <button
                  key={page}
                  className={`join-item btn btn-square ${
                    page === currentPage
                      ? "bg-blue-600 text-white hover:bg-blue-600 border-none"
                      : ""
                  }`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              className="join-item btn btn-outline w-full sm:w-auto"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </footer>
      </div>
      {isWarningDialogOpen && (
        <WarningDialog
          isOpen={isWarningDialogOpen.state}
          onClose={() => setIsWarningDialogOpen({ state: false, message: "" })}
          message={isWarningDialogOpen.message}
        />
      )}
    </>
  );
};

export default Quiz;
