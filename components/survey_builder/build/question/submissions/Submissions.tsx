import SkeletonTable from "@/components/skeletons/SkeletonTable";
import { useGetSubmissions } from "@/hooks/survey_builder/survey";
import { SubmissionModelForBuilder } from "@/types/buildSurvey";
import { convertToEgyptTime } from "@/utils";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import SubmissionDialog from "../dialogs/SubmissionDialog";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Image from "next/image";

const Submissions: React.FC = () => {
  const { currentSurvey } = useSelector((state: RootState) => ({
    currentSurvey: state.currentSurvey.currentSurvey,
  }));
  const { surveyId, workspaceId } = useParams();
  const [currentSubmission, setCurrentSubmission] =
    useState<SubmissionModelForBuilder | null>(null);
  const { submissions, isLoading, isError } = useGetSubmissions(
    workspaceId as string,
    surveyId as string
  );

  useEffect(() => {
    console.log("Is submissions an array?", Array.isArray(submissions));
    console.log("Type of submissions:", typeof submissions);
    console.log("Actual submissions:", submissions);
  }, [submissions]);

  if (isLoading && !submissions) {
    return (
      <div className="px-4">
        <SkeletonTable />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 flex justify-center items-center">
        <span className="text-red-500">Error loading submissions</span>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4 px-4 overflow-hidden h-[85dvh]">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg overflow-y-hidden">
          <div className="max-h-[100dvh] py-2 overflow-y-auto">
            {" "}
            {/* Added container for scroll */}
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3"></th>

                  <th scope="col" className="px-6 py-3">
                    Student ID
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Phone Number
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Grade
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Submitted At
                  </th>
                </tr>
              </thead>
              <tbody>
                {submissions && submissions.length > 0 ? (
                  submissions.map((submission) => (
                    <tr
                      key={submission.id}
                      className={` cursor-pointer border-b dark:border-gray-700 hover:bg-gray-400/10 `}
                      onClick={() => setCurrentSubmission(submission)}
                    >
                      <td className=" m-auto ">
                        {!submission.cleanSubmission && (
                          <Image
                            src={"/assets/icons/red-dot.svg"}
                            alt="red dot"
                            width={25}
                            height={25}
                            className="flex mx-auto"
                          />
                        )}
                      </td>
                      <td className="px-6 py-4">{submission.studentId}</td>
                      <td className="px-6 py-4">{submission.phoneNumber}</td>
                      <td
                        scope="row"
                        className="px-6 py-4 font-medium text-white"
                      >
                        {submission.email}
                      </td>
                      <td className="px-6 py-4">
                        {submission.givenPoints}/{submission.totalPoints}
                      </td>
                      <td className="px-6 py-4">
                        {convertToEgyptTime(new Date(submission.submittedAt))}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center px-6 py-4">
                      No submissions available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {currentSubmission && currentSurvey && (
        <SubmissionDialog
          isOpen={true}
          onClose={() => setCurrentSubmission(null)}
          submission={currentSubmission}
          questionsPerPage={currentSurvey.questionsPerPage}
        />
      )}
    </>
  );
};

export default Submissions;
