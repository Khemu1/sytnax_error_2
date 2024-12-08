"use client";

import { Analytics } from "@vercel/analytics/react";
import QuizForm from "@/components/quiz/QuizForm";
import { useEffect, useState } from "react";
import { QuizFormErrors, QuizUserFormProps } from "@/types/quiz";
import { validateWithSchema } from "@/utils/validations/validations";
import Quiz from "@/components/quiz/Quiz";
import { notFound, useParams } from "next/navigation";
import { useAddQuizParticipant, useGetSurveyForQuiz } from "@/hooks/quiz";
import { newQuizSchema, quizUserFormschema } from "@/utils/validations/quiz";
import Toast from "@/components/skeletons/Toast";
import { transformDataIntoFormData } from "@/utils/survey_builder/build/questions";
import { getSurveyStatus } from "@/utils";
import Link from "next/link";

const QuizParticipate: React.FC = () => {
  const params = useParams();
  const { isError, isLoading, survey } = useGetSurveyForQuiz(
    params.id as string
  );
  const {
    handleAddQuizParticipant,
    isError: quizError,
    isSuccess: quizSuccess,
    data,
  } = useAddQuizParticipant();

  const [participantData, setParticipantData] = useState<QuizUserFormProps>({
    email: "",
    studentId: "",
    phoneNumber: "",
    countryCode: "EG",
  });

  const [userQuizAnswers, setUserQuizAnswers] = useState<
    Array<{ questionId: string; choosenAnswersIds: string[]; values: string[] }>
  >([]);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [formErrors, setFormErrors] = useState<QuizFormErrors>({});
  const [startQuiz, setStartQuiz] = useState(false);
  const [validatingQuiz, setValidatingQuiz] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { endTime } = getSurveyStatus(
    survey?.startTime ?? null,
    survey?.endTime ?? null
  );

  useEffect(() => {
    if (survey) {
      const initialAnswers = survey.questions.map((question) => ({
        questionId: question.id,
        choosenAnswersIds: [],
        values: [],
      }));
      setUserQuizAnswers(initialAnswers);
    }
  }, [survey]);

  // Form field change handler
  const handleFormChange = (
    value: string,
    type: "email" | "studentId" | "phoneNumber"
  ) => {
    setParticipantData((prev) => ({
      ...prev,
      [type]: type === "studentId" ? value.slice(0, 7) : value,
    }));
  };

  // Start quiz and validate data
  const handleQuizStart = () => {
    setValidatingQuiz(true);
    setFormErrors({});
    const schema = quizUserFormschema();

    try {
      schema.parse(participantData);
      setStartQuiz(true);
    } catch (error) {
      setFormErrors(validateWithSchema(error));
    } finally {
      setValidatingQuiz(false);
    }
  };

  // Submit quiz data
  const handleQuizSubmit = (clean = true) => {
    try {
      const data = newQuizSchema().parse({
        surveyId: params.id,
        questions: survey?.questions,
        userQuizAnswers,
        submissionDate: new Date(),
      });

      const prepData = {
        ...data,
        userInfo: participantData,
        clean,
        surveyId: params.id,
      };
      const formData = new FormData();
      transformDataIntoFormData(prepData, formData);
      console.log(survey?.questions);
      console.log(userQuizAnswers);
      handleAddQuizParticipant({ quizData: formData });

      setToast({ message: "Submitting", type: "success" });
    } catch (error) {
      setToast({ message: "Invalid data", type: "error" });
      console.error(validateWithSchema(error));
    }
  };

  // Handle answer selection for quiz
  const handleAnswerSelection = (
    questionId: string,
    selectedAnswers: string[],
    values: string[]
  ) => {
    setUserQuizAnswers((prevAnswers) =>
      prevAnswers.map((answer) =>
        answer.questionId === questionId
          ? { ...answer, choosenAnswersIds: [...selectedAnswers], values }
          : answer
      )
    );
  };

  // Toast notifications for success and error
  useEffect(() => {
    if (quizSuccess) {
      setToast({ message: "You have successfully submitted", type: "success" });
    }
    if (quizError) {
      setToast({ message: "Error submitting", type: "error" });
    }
  }, [quizSuccess, quizError]);

  // Early return for errors or loading state
  if (!params.id || (isError && !survey)) {
    return notFound();
  }

  if (isLoading) {
    return (
      <div className="flex w-full h-full flex-1 justify-center items-center">
        <span className="loading loading-infinity w-[150px]" />
      </div>
    );
  }

  return (
    <>
      <div
        className={`flex-1 flex ${
          quizSuccess ? "items-center justify-center" : ""
        }`}
      >
        {!startQuiz && survey && !quizSuccess && (
          <QuizForm
            studentData={participantData}
            formErrors={formErrors}
            handleChange={handleFormChange}
            handleSubmit={handleQuizStart}
            isValidating={validatingQuiz}
          />
        )}
        {startQuiz && survey && !quizSuccess && (
          <Quiz
            survey={survey}
            questions={survey.questions}
            handleSubmit={handleQuizSubmit}
            handleAnswerSelection={handleAnswerSelection}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
          />
        )}

        {quizSuccess && (
          <div className="flex flex-col bg-base-300 justify-center  p-6 rounded-md min-h-[300px] w-[300px] shadow-lg">
            <Link className="font-semibold mb-5 underline" href={"/"}>
              Go Home
            </Link>
            <div className="text-center space-y-4">
              {survey?.gradesVisibility === "hidden" && data?.clean && (
                <>
                  <div className="text-xl font-semibold text-white">
                    The instructor has set the grades to be hidden. Please
                    contact the instructor to see your grades.
                  </div>
                  <div className="text-sm text-gray-600">
                    For more details about your grades, please contact{" "}
                    <strong>+20 1080636980</strong>.
                  </div>
                  <div className="mt-4 text-sm text-gray-500">
                    Please save the following link to view your grades later:
                  </div>
                </>
              )}
              {survey?.gradesVisibility === "visibleAfterSurveyCloses" &&
                data?.clean && (
                  <>
                    <div className="text-xl font-semibold  text-white">
                      The grades will be visible after the survey closes. Please
                      check again after {endTime}.
                    </div>
                    <div className="text-sm text-gray-600">
                      For more details about your grades, please contact{" "}
                      <strong>+20 1080636980</strong>.
                    </div>
                    <div className="mt-4 text-sm text-gray-500">
                      Please save the following link to view your grades later:
                    </div>
                  </>
                )}
              {survey?.gradesVisibility === "visible" &&
                data?.totalUserScore &&
                data?.QuizTotalScore &&
                data?.clean && (
                  <>
                    <div className="text-xl font-semibold text-white">
                      You scored {data.totalUserScore} out of{" "}
                      {data?.QuizTotalScore}.
                    </div>
                    <div className="text-sm text-gray-600 mt-2">
                      If you wish to view your grades later, save the following
                      link:
                    </div>
                  </>
                )}
              {!data?.clean && (
                <>
                  <div className="bg-red-700 text-white p-4 rounded-md flex items-center space-x-2">
                    <div className="flex-1">
                      <p className="text-xl font-semibold">
                        Your quiz has been submitted early due to inactivity
                        (e.g., tapping out or unfocusing the window). Your data
                        has already been submitted.
                      </p>
                    </div>
                  </div>
                </>
              )}
              {data?.clean && (
                <div className="flex justify-center mt-5">
                  <button
                    className="py-2 px-4 w-[200px] bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition duration-300"
                    onClick={() => {
                      window.navigator.clipboard.writeText(
                        `${process.env.NEXT_PUBLIC_BASE_URL}/quiz/check-grade/${data?.id}`
                      );
                      setToast({
                        message: "Link copied to clipboard",
                        type: "success",
                      });
                    }}
                  >
                    Copy Link
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <Analytics />
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};

export default QuizParticipate;
