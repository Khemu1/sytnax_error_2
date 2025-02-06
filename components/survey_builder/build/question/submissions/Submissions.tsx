import SkeletonTable from "@/components/skeletons/SkeletonTable";
import { useGetSubmissions } from "@/hooks/survey_builder/survey";
import { SubmissionModelForBuilder } from "@/types/buildSurvey";
import { convertToEgyptTime } from "@/utils";
import { useParams } from "next/navigation";
import { useState } from "react";
import SubmissionDialog from "../dialogs/SubmissionDialog";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Image from "next/image";

const Submissions: React.FC = () => {
  const currentSurvey = useSelector(
    (state: RootState) => state.survey.currentSurvey
  );
  const { surveyId, workspaceId } = useParams();
  const [currentSubmission, setCurrentSubmission] =
    useState<SubmissionModelForBuilder | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { submissions, isLoading, isError } = useGetSubmissions(
    workspaceId as string,
    surveyId as string
  );

  const filteredSubmissions = submissions?.filter((submission) =>
    submission.surveyParticipant.studentId
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

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
      <div className="flex flex-col gap-4 px-4 h-[85dvh]">
        <div className="w-full max-w-[250px]">
          <input
            type="text"
            className="w-full border-b-2 border-gray-200 focus:outline-none focus:border-blue-500 dark:border-gray-700 dark:focus:border-blue-600 rounded-lg p-2 bg-gray-50 dark:bg-gray-800 dark:text-gray-200"
            placeholder="Search by student ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="relative overflow-hidden shadow-md sm:rounded-lg flex-1">
          <div className="h-full overflow-y-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="sticky top-0 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3"></th>
                  <th scope="col" className="px-6 py-3">
                    Student ID
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Phone Number
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Grade
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Submitted At
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="overflow-y-auto">
                {filteredSubmissions && filteredSubmissions.length > 0 ? (
                  filteredSubmissions.map((submission) => (
                    <tr
                      key={submission.id}
                      className="cursor-pointer border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-200"
                      onClick={() => setCurrentSubmission(submission)}
                    >
                      <td className="px-6 py-4">
                        {!submission.cleanSubmission && (
                          <Image
                            src="/assets/icons/red-dot.svg"
                            alt="red dot"
                            width={25}
                            height={25}
                            className="flex mx-auto"
                          />
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {submission.surveyParticipant.studentId}
                      </td>
                      <td className="px-6 py-4">{submission.phoneNumber}</td>
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
                      No submissions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Submission Dialog */}
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
