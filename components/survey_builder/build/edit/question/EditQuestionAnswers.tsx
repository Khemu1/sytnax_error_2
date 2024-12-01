import React from "react";

interface EditQuestionAnswersProps {
  answers: string[];
  correctAnswers: string[];
  addedAnswers: string[];
  addedCorrectAnswers: string[];
  addAnswer: (answer: string) => void;
  removeAnswer: (answer: string) => void;
  addCorrectAnswer: (answer: string) => void;
  removeCorrectAnswer: (answer: string) => void;
}

const EditQuestionAnswers: React.FC<EditQuestionAnswersProps> = ({
  answers,
  correctAnswers,
  addedAnswers,
  addedCorrectAnswers,
  addAnswer,
  removeAnswer,
  addCorrectAnswer,
  removeCorrectAnswer,
}) => {
  return <div>EditQuestionAnswers</div>;
};

export default EditQuestionAnswers;
