"use client";

import { Analytics } from "@vercel/analytics/react";
import QuizForm from "@/components/quiz/QuizForm";
import { useEffect, useMemo, useState } from "react";
import { QuizFormErrors, QuizUserFormProps } from "@/types/quiz";
import { validateWithSchema } from "@/utils/validations/validations";
import Quiz from "@/components/quiz/Quiz";
import { notFound, useParams } from "next/navigation";
import {
  useAddQuizParticipant,
  useGetParticipantForQuiz,
  useGetSurveyForQuiz,
} from "@/hooks/quiz";
import { newQuizSchema, quizUserFormschema } from "@/utils/validations/quiz";
import Toast from "@/components/skeletons/Toast";
import { transformDataIntoFormData } from "@/utils/survey_builder/build/questions";
import { getSurveyStatus } from "@/utils";
import Link from "next/link";
import Image from "next/image";

const QuizParticipate: React.FC = () => {
  const params = useParams();
  const [startSearch, setStartSearch] = useState(false);
  const [text, setText] = useState<string>("");
  const { participant, isFetching: isParticipantFetching } =
    useGetParticipantForQuiz(text, params.id as string, startSearch);
  const [participantData, setParticipantData] = useState<QuizUserFormProps>({
    phoneNumber: "",
    countryCode: "EG",
  });
  const { isError, isLoading, survey } = useGetSurveyForQuiz(
    params.id as string,
    participant?.id ?? null,
    participant?.attempts ?? 0
  );
  const {
    handleAddQuizParticipant,
    isError: quizError,
    isSuccess: quizSuccess,
    data,
  } = useAddQuizParticipant();

  const [userQuizAnswers, setUserQuizAnswers] = useState<
    Array<{ questionId: string; choosenAnswersIds: string[]; values: string[] }>
  >([]);
  const [duration, setDuration] = useState<number | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [formErrors, setFormErrors] = useState<QuizFormErrors>({});
  const [validationError, setValidationError] = useState<Record<
    string,
    string
  > | null>(null);
  const [startQuiz, setStartQuiz] = useState(false);
  const [validatingQuiz, setValidatingQuiz] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isQuizStillOpen, setIsQuizStillOpen] = useState(true);
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
      if (survey.endTime) {
        const timeLeftInMinutes =
          (new Date(survey?.endTime).getTime() - Date.now()) / 60000;
        const totalDur = Math.min(survey?.duration, timeLeftInMinutes);
        setDuration(totalDur * 60);
      }
    }
  }, [survey]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (endTime) {
        const currentTime = new Date();
        const endimeTime = new Date(endTime);
        if (currentTime > endimeTime) {
          setIsQuizStillOpen(false);
          setDuration(null);
          clearInterval(interval);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  const handleFormChange = (
    value: string,
    type: "email" | "studentId" | "phoneNumber"
  ) => {
    setParticipantData((prev) => ({
      ...prev,
      [type]: type === "studentId" ? value.slice(0, 7) : value,
    }));
  };

  const handleStudentIdSearch = (text: string) => {
    setValidationError(null);
    if (!text.match(/^\d{7}$/)) {
      setValidationError({
        studentId: "Invalid Student ID",
      });
      return;
    }
    setStartSearch(true);
  };

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

  const returnUrl = useMemo(() => {
    if (data?.id) {
      if (process.env.NEXT_PUBLIC_NODE_ENV === "development") {
        return `${process.env.NEXT_PUBLIC_DEV_URL}quiz/check-grade/${data?.id}`;
      }
      if (process.env.NEXT_PUBLIC_NODE_ENV === "production") {
        return `${process.env.NEXT_PUBLIC_BASE_URL}quiz/check-grade/${data?.id}`;
      }
      return `${process.env.NEXT_PUBLIC_LOCAL_URL}quiz/check-grade/${data?.id}`;
    }
  }, [data?.id]);

  const handleQuizSubmit = (clean = true) => {
    const submissionDate = new Date();
    submissionDate.setMilliseconds(0);
    submissionDate.setSeconds(0);
    try {
      const data = newQuizSchema().parse({
        surveyId: params.id,
        questions: survey?.questions,
        userQuizAnswers,
        submissionDate,
      });

      const prepData = {
        ...data,
        userInfo: participantData,
        clean,
        surveyId: params.id,
        participantId: participant?.id ?? 0,
      };
      const formData = new FormData();
      transformDataIntoFormData(prepData, formData);
      handleAddQuizParticipant({ quizData: formData });

      setToast({ message: "Submitting", type: "success" });
    } catch (error) {
      setToast({ message: "Invalid data", type: "error" });
      console.error(validateWithSchema(error));
    }
  };

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

  useEffect(() => {
    if (quizSuccess) {
      setToast({ message: "You have successfully submitted", type: "success" });
    }
    if (quizError) {
      setToast({ message: "Error submitting", type: "error" });
    }
  }, [quizSuccess, quizError]);

  useEffect(() => {}, [participant]);
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
  if (!participant) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col bg-base-300 justify-center p-6 rounded-md min-h-[300px] w-[300px] shadow-lg gap-4">
          <div className="flex justify-center">
            {" "}
            <Image
              alt="logo"
              src={"/assets/imgs/logo.png"}
              width={75}
              height={50}
            />
          </div>
          <label
            htmlFor="studentId"
            className="text-lg  text-center mb-2 font-semibold"
          >
            Enter Your Student ID
          </label>
          <input
            type="text"
            name="studentId"
            id="studentId"
            placeholder="Student ID"
            className="w-full px-4 py-2 bg-[#2b2b2b] text-[#d1d1d1]  overflow-y-scroll resize-none rounded-md border border-[#3d3d3d] focus:outline-none focus:border-[#4b6ef5] transition-all"
            onChange={(e) => {
              const newValue = e.target.value
                .replace(/\s+/g, "")
                .replace(/\D/g, "")
                .slice(0, 7);
              setText(newValue);
            }}
            value={text}
          />
          <div className="flex justify-center">
            <button
              className="w-[125px] text-xl flex justify-center pr-2 bg-blue-600 font-semibold  p-2 rounded-md shadow-md hover:bg-blue-700 hover:text-white transition duration-300"
              disabled={isParticipantFetching}
              onClick={() => handleStudentIdSearch(text)}
            >
              {isParticipantFetching ? (
                <span className="flex items-center justify-center mx-auto loading loading-spinner loading-md"></span>
              ) : (
                "Check"
              )}
            </button>
          </div>
          {validationError && validationError.studentId && (
            <p className="text-red-600 text-center font-semibold">
              {validationError.studentId}
            </p>
          )}
        </div>
        <Analytics />
      </div>
    );
  }
  if (participant && !participant.hasAccess) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col bg-base-300 justify-center p-6 rounded-md min-h-[300px] w-[300px] shadow-lg gap-4">
          <div className="flex-1 flex items-center justify-center">
            <div className="bg-red-700 text-white p-4 rounded-md flex items-center space-x-2">
              <div className="flex-1">
                <p className="text-xl text-center font-semibold">
                  You don{"'"}t have access to this Quizz
                </p>
              </div>
            </div>
          </div>
        </div>
        <Analytics />
      </div>
    );
  }
  if (participant && participant.attempts < 1) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col bg-base-300 justify-center p-6 rounded-md min-h-[300px] w-[300px] shadow-lg gap-4">
          <div className="flex-1 flex items-center justify-center">
            <div className="bg-red-700 text-white p-4 rounded-md flex items-center space-x-2">
              <div className="flex-1">
                <p className="text-xl text-center font-semibold">
                  You have reached the max attempts
                </p>
              </div>
            </div>
          </div>
        </div>
        <Analytics />
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
        {isQuizStillOpen && duration !== null ? (
          <>
            {!startQuiz &&
              survey &&
              participant &&
              participant.attempts > 0 &&
              !quizSuccess && (
                <QuizForm
                  studentData={participantData}
                  formErrors={formErrors}
                  handleChange={handleFormChange}
                  handleSubmit={handleQuizStart}
                  isValidating={validatingQuiz}
                />
              )}
            {startQuiz &&
              survey &&
              participant &&
              participant.attempts > 0 &&
              !quizSuccess && (
                <Quiz
                  survey={survey}
                  questions={survey.questions}
                  handleSubmit={handleQuizSubmit}
                  handleAnswerSelection={handleAnswerSelection}
                  isSubmitting={isSubmitting}
                  setIsSubmitting={setIsSubmitting}
                  duration={duration}
                />
              )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="bg-red-700 text-white p-4 rounded-md flex items-center space-x-2">
              <div className="flex-1">
                <p className="text-xl font-semibold">The quiz has ended</p>
              </div>
            </div>
          </div>
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
              {survey?.gradesVisibility === "visible" && data?.clean && (
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
                      window.navigator.clipboard.writeText(returnUrl ?? "/");
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
