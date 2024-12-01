"use client";

import NewQuestion from "@/components/survey_builder/build/question/dialogs/NewQuestion";
import Questions from "@/components/survey_builder/build/Questions";
import { useGetSurvey } from "@/hooks/survey_builder/survey";
import { setCurrentSurvey } from "@/store/slices/survey/currentSurveySlice";
import { setQuestions } from "@/store/slices/survey/questionsSlice";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

interface BuildSurveyProps {
  params: Promise<{
    workspaceId: string;
    surveyId: string;
  }>;
}

const BuildSurvey: React.FC<BuildSurveyProps> = ({ params }) => {
  const dispatch = useDispatch();

  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [surveyId, setSurveyId] = useState<string | null>(null);
  const [isNewQuestionDialogOpen, setIsNewQuestionDialogOpen] = useState(false);

  useEffect(() => {
    params.then(({ workspaceId, surveyId }) => {
      setWorkspaceId(workspaceId);
      setSurveyId(surveyId);
    });
  }, [params]);

  const { survey, isError, isLoading } = useGetSurvey(
    workspaceId || "",
    surveyId || ""
  );

  useEffect(() => {
    if (survey) {
      dispatch(setCurrentSurvey(survey));
      dispatch(setQuestions(survey.questions));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [survey]);

  if (isLoading) {
    return (
      <div className="flex w-full h-full flex-1 justify-center items-center">
        <span className="loading loading-infinity w-[150px]" />
      </div>
    );
  }

  if (isError || !workspaceId || !surveyId || (!isLoading && !survey)) {
    return notFound();
  }

  return (
    <div className="flex flex-col flex-1 gap-4 overflow-hidden">
      {/* Header */}
      <header className="flex flex-wrap justify-between w-full bg-base-100 border-b border-b-[#00000046] px-2 py-3 gap-2 text-sm sm:text-2xl">
        <button
          className="flex justify-center flex-1 bg-blue-600 font-semibold rounded-sm py-1 text-white"
          role="tab"
        >
          Builder
        </button>
        <button
          className="flex justify-center flex-1 bg-base-300 font-semibold rounded-sm py-1 text-white"
          role="tab"
        >
          Submissions
        </button>
        <button
          className="flex justify-center flex-1 bg-base-300 font-semibold rounded-sm py-1"
          role="tab"
        >
          Preview
        </button>
      </header>

      {/* Main Content */}
      <div className="flex flex-col gap-4">
        <button
          className="flex justify-center w-[150px] bg-[#5756566e] p-2 font-semibold text-white rounded-r-md"
          onClick={() => setIsNewQuestionDialogOpen(true)}
          aria-label="Add a new question"
        >
          New Question
        </button>
        <span className="w-full text-center mb-2 font-semibold text-xl">
          Questions
        </span>
        <Questions />
      </div>

      {/* New Question Dialog */}
      <NewQuestion
        isOpen={isNewQuestionDialogOpen}
        onClose={() => setIsNewQuestionDialogOpen(false)}
      />
    </div>
  );
};

export default BuildSurvey;
