/* eslint-disable react-hooks/exhaustive-deps */
import { RootState } from "@/store/store";
import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import "@/styles/quiz.css";

const PreviewSurvey = () => {
  const questions = useSelector((state: RootState) => state.questions.items);
  const currentSurvey = useSelector(
    (state: RootState) => state.survey.currentSurvey
  );

  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * (currentSurvey?.questionsPerPage || 1);

  const totalPages = useMemo(() => {
    if (!currentSurvey) return 0;
    return Math.ceil(questions.length / currentSurvey.questionsPerPage);
  }, [questions.length, currentSurvey?.questionsPerPage]);

  const currentQuestions = useMemo(() => {
    if (!currentSurvey) return [];
    const start = (currentPage - 1) * currentSurvey.questionsPerPage;
    const end = start + currentSurvey.questionsPerPage;
    return questions.slice(start, end);
  }, [currentPage, questions, currentSurvey?.questionsPerPage]);

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

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
      <div className="absolute w-full top-0 flex justify-between items-center p-2 z-10 bg-base-300">
        <div className="w-max border border-[#42484b] p-2 rounded-md text-white font-semibold">
          00 : 00 : 00
        </div>

        <button className="w-[150px] bg-blue-600 p-2 rounded-md text-white font-semibold">
          Submit
        </button>
      </div>

      <div className="quiz-question-container">
        {currentQuestions.map((question, index) => (
          <div
            key={question.id}
            className={`flex flex-col gap-4 sm:w-[800px] ${
              index + 1 !== currentSurvey?.questionsPerPage &&
              startIndex + index + 1 !== questions.length
                ? "border-b"
                : "b"
            } py-8 pb-12 border-[#42484b]`}
          >
            <span className="font-extrabold text-[20px]">
              {" "}
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
              <div className="flex flex-col flex-wrap gap-2 w-full items-center  mt-7">
                {question.questionAnswers.map((answer, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-start gap-2 w-[200px] sm:w-[300px]"
                  >
                    <label
                      className={`flex flex-1 bg-blue-600/80 p-3 rounded-md transition-all text-white cursor-pointer overflow-hidden hover:bg-green-600`}
                    >
                      <input
                        type="radio"
                        name="survey-answer"
                        value={answer.id}
                        className="hidden peer"
                      />
                      <span className="font-semibold flex items-center justify-left mr-2">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <span className="flex-1 rounded-r-md flex items-center justify-between">
                        <span>{answer.answer}</span>
                      </span>
                    </label>
                  </div>
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
  );
};

export default PreviewSurvey;
