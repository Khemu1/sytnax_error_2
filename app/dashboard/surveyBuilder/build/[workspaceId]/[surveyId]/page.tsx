"use client";

import PreviewSurvey from "@/components/survey_builder/build/previewSurvey";
import NewQuestion from "@/components/survey_builder/build/question/dialogs/NewQuestion";
import Questions from "@/components/survey_builder/build/Questions";
import { useGetSurvey } from "@/hooks/survey_builder/survey";
import { logout } from "@/store/slices/authSlice";
import { setCurrentSurvey } from "@/store/slices/survey/currentSurveySlice";
import { setQuestions } from "@/store/slices/survey/questionsSlice";
import { RootState } from "@/store/store";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Submissions from "@/components/survey_builder/build/question/submissions/Submissions";
import { useParams } from "next/navigation";

const BuildSurvey: React.FC = () => {
  const dispatch = useDispatch();
  const { workspaceId, surveyId } = useParams() as {
    workspaceId: string;
    surveyId: string;
  };

  const [isNewQuestionDialogOpen, setIsNewQuestionDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "build" | "submissions" | "preview"
  >("build");
  const authState = useSelector((state: RootState) => state.auth);
  const routeTo = useRouter();

  useEffect(() => {
    const localStorageAuth = localStorage.getItem("userData");
    if (localStorageAuth) {
      const { role } = JSON.parse(localStorageAuth);

      if (!authState.isAuthenticated) {
        dispatch(logout());
      }

      if (role !== 1 && role !== 2) {
        routeTo.push("/");
      }
    } else {
      routeTo.push("/authportal");
    }
  }, [authState.isAuthenticated, dispatch, routeTo]);

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

  if (isError || !workspaceId || (!isLoading && !survey)) {
    return notFound();
  }
  return (
    <>
      <div className="flex flex-col flex-1 gap-4 overflow-hidden">
        {/* Header */}
        <header className="flex flex-wrap justify-between w-full bg-base-100 border-b border-b-[#00000046] px-2 py-3 gap-2 text-sm sm:text-2xl">
          <button
            className={`flex justify-center flex-1 transition-all ${
              activeTab === "build" ? "bg-blue-600" : "bg-base-300"
            } font-semibold rounded-sm py-1 text-white`}
            onClick={() => setActiveTab("build")}
          >
            Builder
          </button>
          <button
            className={`flex justify-center flex-1 transition-all ${
              activeTab === "submissions" ? "bg-blue-600" : "bg-base-300"
            } font-semibold rounded-sm py-1 text-white`}
            onClick={() => setActiveTab("submissions")}
          >
            Submissions
          </button>
          <button
            className={`flex justify-center flex-1 transition-all ${
              activeTab === "preview" ? "bg-blue-600" : "bg-base-300"
            }  font-semibold rounded-sm py-1 text-white`}
            onClick={() => setActiveTab("preview")}
          >
            Preview
          </button>
        </header>

        {/* Main Content */}
        {activeTab === "build" && (
          <div className="flex flex-col gap-4">
            <button
              className="flex justify-center w-[150px] bg-[#5756566e] p-2 font-semibold text-white rounded-r-md"
              onClick={() => setIsNewQuestionDialogOpen(true)}
              aria-label="Add a new question"
            >
              New Question
            </button>
            <Link
              href={"/dashboard/surveyBuilder"}
              className="flex justify-center w-[150px] bg-[#5756566e] p-2 font-semibold text-white rounded-r-md"
              aria-label="Add a new question"
            >
              Workspaces
            </Link>
            <span className="w-full text-center mb-2 font-semibold text-xl">
              Questions
            </span>
            <Questions />
          </div>
        )}
        {activeTab === "preview" && <PreviewSurvey />}
        {activeTab === "submissions" && survey?.questionsPerPage && (
          <Submissions />
        )}

        {/* New Question Dialog */}
      </div>
      {activeTab === "build" && (
        <NewQuestion
          isOpen={isNewQuestionDialogOpen}
          onClose={() => setIsNewQuestionDialogOpen(false)}
        />
      )}
    </>
  );
};

export default BuildSurvey;
