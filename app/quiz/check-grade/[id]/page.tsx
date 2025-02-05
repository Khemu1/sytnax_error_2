"use client";

import EearlyTermination from "@/components/quiz/participation/early_termination/EearlyTermination";
import HiddenGrades from "@/components/quiz/participation/results_messages/HiddenGrades";
import VisibleAfterClosing from "@/components/quiz/participation/results_messages/VisibleAfterClosing";
import VisibleGrades from "@/components/quiz/participation/results_messages/VisibleGrades";
import { useGetGrade } from "@/hooks/quiz";
import { Analytics } from "@vercel/analytics/react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";

const QuizGrade = () => {
  const params = useParams();
  const { data, isError, isLoading, isSuccess } = useGetGrade(
    params.id as string
  );

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col bg-base-300 justify-center p-6 rounded-md min-h-[300px] w-[300px] shadow-lg">
          <Link className="font-semibold mb-5 underline" href={"/"}>
            Go Home
          </Link>
          <span className="loading loading-infinity loading-lg m-auto"></span>{" "}
        </div>
        <Analytics />
      </div>
    );
  }

  if (isError) {
    return notFound();
  }

  return (
    <div className="flex-1 flex items-center justify-center">
      {isSuccess && (
        <div className="flex flex-col bg-base-300 justify-center p-6 rounded-md min-h-[300px] w-[300px] shadow-lg">
          <Link className="font-semibold mb-5 underline" href={"/"}>
            Go Home
          </Link>
          <div className="text-center space-y-4">
            {data?.gradesVisibility === "hidden" && data.cleanSubmission && (
              <HiddenGrades />
            )}

            {data?.gradesVisibility === "visibleAfterSurveyCloses" &&
              data.cleanSubmission &&
              data.isOpen &&
              data.endTime && <VisibleAfterClosing endTime={data.endTime} />}

            {data?.gradesVisibility === "visible" && data.cleanSubmission && (
              <VisibleGrades
                totalUserScore={data.givenPoints}
                QuizTotalScore={data.totalPoints}
              />
            )}

            {!data?.cleanSubmission && <EearlyTermination />}
          </div>
        </div>
      )}
      <Analytics />
    </div>
  );
};

export default QuizGrade;
