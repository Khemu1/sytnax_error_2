"use client";

import { useGetGrade } from "@/hooks/quiz";
import { convertToEgyptTime } from "@/utils";
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
              <>
                <div className="text-xl font-semibold text-white">
                  The instructor has set the grades to be hidden. Please contact
                  the instructor to see your grades.
                </div>
                <div className="text-sm text-gray-600">
                  For more details about your grades, please contact{" "}
                  <strong>+20 1080636980</strong>.
                </div>
              </>
            )}

            {data?.gradesVisibility === "visibleAfterSurveyCloses" &&
              data.cleanSubmission &&
              !data.isOpen &&
              data.endTime && (
                <>
                  <div className="text-xl font-semibold text-white">
                    The grades will be visible after the survey closes. Please
                    check again after{" "}
                    {convertToEgyptTime(new Date(data.endTime))}.
                  </div>
                  <div className="text-sm text-gray-600">
                    For more details about your grades, please contact{" "}
                    <strong>+20 1080636980</strong>.
                  </div>
                </>
              )}
            {data?.gradesVisibility === "visibleAfterSurveyCloses" &&
              data.cleanSubmission &&
              !data.isOpen &&
              !data.endTime && (
                <>
                  <div className="text-xl font-semibold text-white">
                    You scored {data.givenPoints} out of {data.totalPoints}.
                  </div>
                  <div className="text-sm text-gray-600">
                    For more details about your grades, please contact{" "}
                    <strong>+20 1080636980</strong>.
                  </div>
                </>
              )}

            {data?.gradesVisibility === "visible" && data.cleanSubmission && (
              <>
                <div className="text-xl font-semibold text-white">
                  You scored {data.givenPoints} out of {data.totalPoints}.
                </div>
                <div className="text-sm text-gray-600">
                  For more details about your grades, please contact{" "}
                  <strong>+20 1080636980</strong>.
                </div>
              </>
            )}

            {!data?.cleanSubmission && (
              <div className="bg-red-700 text-white p-4 rounded-md flex items-center space-x-2">
                <div className="flex-1">
                  <p className="text-xl font-semibold">
                    Your quiz was submitted early due to inactivity (e.g.,
                    navigating away or unfocusing the window). Your data has
                    already been submitted.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <Analytics />
    </div>
  );
};

export default QuizGrade;
