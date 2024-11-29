"use client";
import NewQuestion from "@/components/survey_builder/build/question/NewQuestion";
import Questions from "@/components/survey_builder/build/Questions";
import React, { useState } from "react";

const BuildSurvey = () => {
  const [iSnewQuestionDialogOpen, setISNewQuestionDialogOpen] = useState(false);

  return (
    <>
      {" "}
      <div className="flex flex-col flex-1 gap-4">
        <header className="flex flex-wrap justify-between w-full bg-base-100 border-b border-b-[#00000046] px-2 py-3 gap-2 text-sm sm:text-2xl ">
          <button className="flex justify-center flex-1 bg-blue-600 font-semibold rounded-sm py-1 text-white ">
            Builder
          </button>
          <button className="flex justify-center flex-1 bg-base-300 font-semibold rounded-sm py-1 text-white">
            Submissions
          </button>
          <button className="flex justify-center flex-1 bg-base-300 font-semibold rounded-sm py-1">
            Preview
          </button>
        </header>

        <div className="flex flex-col gap-4">
          {/* try to make aside works for both designs in one */}
          <button
            className="flex justify-center w-[150px] bg-[#5756566e] p-2 font-semibold text-white rounded-r-md"
            onClick={() => setISNewQuestionDialogOpen(true)}
          >
            New Question
          </button>
          <span className="w-full text-center">Questions</span>
          <Questions />
        </div>
      </div>
      <NewQuestion
        isOpen={iSnewQuestionDialogOpen}
        onClose={() => setISNewQuestionDialogOpen(false)}
      />
    </>
  );
};

export default BuildSurvey;
