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
import NoAccess from "@/components/quiz/participation/NoAccess";
import MaxAttemptsReached from "@/components/quiz/participation/MaxAttemptsReached";
import SearchForID from "@/components/quiz/participation/SearchForID";
import QuizEnded from "@/components/quiz/participation/QuizEnded";
import HiddenGrades from "@/components/quiz/participation/results_messages/HiddenGrades";
import VisibleAfterClosing from "@/components/quiz/participation/results_messages/VisibleAfterClosing";
import VisibleGrades from "@/components/quiz/participation/results_messages/VisibleGrades";
import EearlyTermination from "@/components/quiz/participation/early_termination/EearlyTermination";
import QuizNotStarted from "@/components/quiz/participation/QuizNotStarted";

const QuizParticipate: React.FC = () => {
  const params = useParams();
  const [startSearch, setStartSearch] = useState(false);
  const [text, setText] = useState<string>("");
  const {
    participant,
    isFetching: isParticipantFetching,
    resetParticipant,
  } = useGetParticipantForQuiz(text, params.id as string, startSearch);
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
  const [resetSearch, setResetSearch] = useState(false);

  const handleReset = () => {
    resetParticipant();
    setResetSearch((prev) => !prev);
    setText("");
    setStartSearch(false);
  };

  useEffect(() => {
    if (survey && !survey.closed) {
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
    setResetSearch(false);
    setStartSearch(true);
  };

  const handleStudentIdSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = e.target.value
      .replace(/\s+/g, "")
      .replace(/\D/g, "")
      .slice(0, 7);
    setText(newValue);
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
        return `${process.env.NEXT_PUBLIC_DEV_URL}/quiz/check-grade/${data?.id}`;
      }
      if (process.env.NEXT_PUBLIC_NODE_ENV === "production") {
        return `${process.env.NEXT_PUBLIC_BASE_URL}/quiz/check-grade/${data?.id}`;
      }
      return `${process.env.NEXT_PUBLIC_LOCAL_URL}/quiz/check-grade/${data?.id}`;
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
  if (!participant || resetSearch) {
    return (
      <SearchForID
        text={text}
        handleStudentIdSearch={handleStudentIdSearch}
        handleStudentIdSearchChange={handleStudentIdSearchChange}
        isParticipantFetching={isParticipantFetching}
        validationError={validationError}
      />
    );
  }
  if (participant && !participant.hasAccess) {
    return <NoAccess resetParticipant={handleReset} />;
  }
  if (participant && participant.attempts < 1) {
    return <MaxAttemptsReached />;
  }
  if (survey && survey.closed && survey.startDate) {
    return <QuizNotStarted startDate={survey.startDate} />;
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
              !survey.closed &&
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
              !survey.closed &&
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
          <QuizEnded />
        )}
        {quizSuccess && (
          <div className="flex flex-col bg-base-300 justify-center  p-6 rounded-md min-h-[300px] w-[300px] shadow-lg">
            <Link className="font-semibold mb-5 underline" href={"/"}>
              Go Home
            </Link>
            <div className="text-center space-y-4">
              {survey?.gradesVisibility === "hidden" && data?.clean && (
                <HiddenGrades />
              )}
              {survey?.gradesVisibility === "visibleAfterSurveyCloses" &&
                data?.clean && <VisibleAfterClosing endTime={endTime} />}
              {survey?.gradesVisibility === "visible" && data?.clean && (
                <VisibleGrades
                  totalUserScore={data.totalUserScore}
                  QuizTotalScore={data?.QuizTotalScore}
                />
              )}
              {!data?.clean && <EearlyTermination />}
              {data?.clean && (
                <div className="flex flex-col items-center justify-center mt-5 gap-[1rem]">
                  <div className="mt-4 text-sm text-gray-500">
                    Please save the following link to view your grades later:
                  </div>
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
