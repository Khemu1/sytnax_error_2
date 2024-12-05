"use client";
import QuizForm from "@/components/quiz/QuizForm";
import { useEffect, useState } from "react";
import { QuizFormErrors, QuizUserFormProps } from "@/types";
import {
  quizUserFormschema,
  validateWithSchema,
} from "@/utils/validations/validations";
import Quiz from "@/components/quiz/Quiz";
import { notFound, useParams } from "next/navigation";
import { useGetSurveyForQuiz } from "@/hooks/quiz";


const QuizParticipate: React.FC = () => {
  const params = useParams();
  const { isError, isLoading, survey } = useGetSurveyForQuiz(
    params.id as string
  );

  const [participantData, setParticipantData] = useState<QuizUserFormProps>({
    email: "",
    studentId: "",
    phoneNumber: "",
    countryCode: "EG",
  });

  const [userQuizAnswers, setUserQuizAnswers] = useState<
    Array<{ questionId: string; choosenAnswersId: string[]; values: string[] }>
  >([]);

  const [formErrors, setFormErrors] = useState<QuizFormErrors>({});
  const [startQuiz, setStartQuiz] = useState(false);
  const [validatingQuiz, setValidatingQuiz] = useState(false);

  useEffect(() => {
    if (survey) {
      const initialAnswers = survey.questions.map((question) => ({
        questionId: question.id,
        choosenAnswersId: [],
        values: [],
      }));
      setUserQuizAnswers(initialAnswers);
    }
  }, [survey]);

  const handleFormChange = (
    value: string,
    type: "email" | "studentId" | "phoneNumber"
  ) => {
    setParticipantData((prev) => ({
      ...prev,
      [type]: type === "studentId" ? value.slice(0, 7) : value,
    }));
  };

  const handleQuizStart = () => {
    setValidatingQuiz(true);
    setFormErrors({});
    const schema = quizUserFormschema();
    try {
      schema.parse(participantData);
      setValidatingQuiz(false);
      setStartQuiz(true);
    } catch (error) {
      setFormErrors(validateWithSchema(error));
      setValidatingQuiz(false);
    }
  };

  const handleQuizSubmit = () => {
    console.log(userQuizAnswers);
  };

  const handleAnswerSelection = (
    questionId: string,
    selectedAnswers: string[],
    values: string[]
  ) => {
    setUserQuizAnswers((prevAnswers) =>
      prevAnswers.map((answer) =>
        answer.questionId === questionId
          ? {
              ...answer,
              choosenAnswersId: selectedAnswers,
              values: values,
            }
          : answer
      )
    );
  };

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
    <div className="flex-1">
      {startQuiz && survey ? (
        <Quiz
          survey={survey}
          questions={survey.questions}
          handleSubmit={handleQuizSubmit}
          handleAnswerSelection={handleAnswerSelection}
        />
      ) : (
        <QuizForm
          studentData={participantData}
          formErrors={formErrors}
          handleChange={handleFormChange}
          handleSubmit={handleQuizStart}
          isValidating={validatingQuiz}
        />
      )}
    </div>
  );
};

export default QuizParticipate;
