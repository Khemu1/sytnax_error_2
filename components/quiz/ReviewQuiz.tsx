import { useState, useMemo } from "react";
import { SubmissionModelForBuilder } from "@/types/buildSurvey";

const ReviewQuiz: React.FC<{
  submission: SubmissionModelForBuilder;
  questionsPerPage: number;
}> = ({ submission, questionsPerPage }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(() => {
    return Math.ceil(submission.answers.length / questionsPerPage);
  }, [submission.answers, questionsPerPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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

  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const currentQuestions = submission.answers.slice(startIndex, endIndex);

  return (
    <>
      <div className="flex-1 flex flex-col relative ">
        <div className="flex flex-col gap-6 items-center h-[70dvh] sm:h-[85dvh] overflow-y-scroll p-4 mt-8">
          {currentQuestions.map((answer, index) => {
            const { question, givenPoints, selectedAnswers } = answer;
            const modifiedSelectedAnswers = selectedAnswers;
            const {
              label,
              correctAnswers,
              questionAnswers,
              description,
              questionImage,
            } = question;
            return (
              <div key={question.id}>
                <div className="flex flex-col gap-4">
                  <span className="font-extrabold text-[20px]">
                    {startIndex + index + 1}
                    {")"}
                  </span>
                  <span className="text-center border border-gray-400/50 text-sm w-[50px] p-1 rounded-md font-semibold">
                    {givenPoints}/{question.points}
                  </span>
                </div>
                {questionImage && (
                  <div className={`flex justify-center mt-6 mb-4`}>
                    {/* eslint-disable-next-line @next/next/no-img-element*/}
                    <img
                      src={questionImage.url}
                      alt="Preview"
                      className={`flex justify-start mt-6 mb-4 
                      sm:max-w-[500px] sm:max-h-[500px]
                      max-w-[300px] max-h-[300px]`}
                    />
                  </div>
                )}
                <div
                  className="mt-4 text-center"
                  dangerouslySetInnerHTML={{ __html: label }}
                ></div>
                {description && (
                  <div
                    className="mt-4 text-center"
                    dangerouslySetInnerHTML={{ __html: description }}
                  ></div>
                )}
                {questionAnswers.length > 0 && (
                  <div className="flex flex-col flex-wrap gap-2 w-full items-center mt-7">
                    {questionAnswers.map((answer) => {
                      const isCorrect = correctAnswers.some(
                        (correct) => correct.answerId === answer.id
                      );
                      const isSelected = modifiedSelectedAnswers.includes(
                        answer.id
                      );
                      let bgColor = "bg-blue-600 text-white";

                      if (isCorrect) {
                        bgColor = "bg-green-600 text-white";
                      }

                      if (isSelected && !isCorrect) {
                        bgColor = "bg-red-600 text-white";
                      }

                      return (
                        <label
                          key={answer.id}
                          className={`flex items-center gap-2 w-[300px] cursor-pointer ${bgColor} transition-all rounded-md py-2 px-4`}
                        >
                          <input
                            type={
                              question.allowMultipleAnswers
                                ? "checkbox"
                                : "radio"
                            }
                            disabled={true}
                            name={`answer-${question.id}`}
                            value={answer.id}
                            checked={isSelected}
                            className="hidden"
                          />
                          <span>{answer.answer}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <footer className="sticky bottom-0 p-4 bg-transparent">
          <div className="flex flex-col sm:flex-row justify-start items-center gap-4">
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
    </>
  );
};

export default ReviewQuiz;
