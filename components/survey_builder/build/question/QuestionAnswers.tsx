import Image from "next/image";
import { useState } from "react";
import "@/styles/formStyle.module.css";

interface QuestionAnswersProps {
  answers: string[];
  correctAnswers: string[];
  addAnswer: (answer: string) => void;
  removeAnswer: (answer: string) => void;
  addCorrectAnswer: (answer: string) => void;
  removeCorrectAnswer: (answer: string) => void;
  zodError: Record<string, string> | null;
}

const QuestionAnswers: React.FC<QuestionAnswersProps> = ({
  answers,
  correctAnswers,
  addAnswer,
  removeAnswer,
  addCorrectAnswer,
  removeCorrectAnswer,
  zodError,
}) => {
  const [answer, setAnswer] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<
    string,
    string
  > | null>(null);

  const toggleCorrectAnswer = (answer: string) => {
    if (correctAnswers.includes(answer)) {
      console.log("removing");
      removeCorrectAnswer(answer);
    } else {
      console.log("adding");
      addCorrectAnswer(answer);
    }
  };

  const handleAddAnswer = () => {
    try {
      setValidationErrors(null);
      if (answers.length < 6) {
        if (answer.trim() !== "") {
          if (answers.includes(answer.trim())) {
            setValidationErrors({
              answers: "Answer already exists",
            });
            return;
          }
          addAnswer(answer);
          setAnswer("");
        }
      }
    } catch (error) {
      console.error("Error adding answer:", error);
    }
  };



  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end gap-2 flex-wrap items-end">
        <input
          type="text"
          id="addAnswer"
          placeholder="Add Answer"
          onChange={(e) => setAnswer(e.target.value)}
          value={answer}
          onKeyPress={(e) => e.key === "Enter" && e.preventDefault()} 
          className={`${
            validationErrors?.answers ? "input_error_border" : ""
          } `}
        />
        <button
          onClick={handleAddAnswer}
          type="button" 
          className="bg-blue-600 text-white rounded-md p-2 hover:bg-blue-700"
        >
          Add Answer
        </button>
        <div className="flex w-full justify-center">
          <p className={`${validationErrors?.answers ? "error_message" : ""} `}>
            {validationErrors?.answers}
          </p>

          {zodError?.answers && (
            <p className="error_message">{zodError.answers}</p>
          )}
        </div>
      </div>
      <div>
        <h3 className="font-semibold">Answers</h3>
        <div className="flex flex-col border border-[#42484b] h-[200px] rounded-md overflow-y-scroll">
          {answers.map((answer, index) => (
            <div key={index} className="flex items-center justify-between p-2">
              <div
                onClick={() => toggleCorrectAnswer(answer)}
                className={`flex justify-between w-full items-center cursor-pointer font-semibold ${
                  correctAnswers.includes(answer)
                    ? "bg-green-600 text-white"
                    : "bg-[#42484b9c]"
                } rounded-md p-1 pl-2 transition-all`}
              >
                <div className="flex items-center flex-1 ">{answer}</div>{" "}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeAnswer(answer);
                  }}
                  className="text-red-600 hover:text-red-800 ml-2"
                >
                  <Image
                    src="/assets/icons/close.svg"
                    alt="Close"
                    width={15}
                    height={15}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
        {zodError?.correctAnswers && (
          <p className="error_message">{zodError.correctAnswers}</p>
        )}
        <p
          className={`${
            answers.length === 6 ? "error_message" : "font-semibold"
          } `}
        >
          {answers.length === 6
            ? "Limit Reached"
            : "You are limited to 6 answers"}
        </p>
      </div>
    </div>
  );
};

export default QuestionAnswers;
