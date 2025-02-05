"use client";
import { quizUserForm } from "@/constants";
import Image from "next/image";
import formStyle from "@/styles/formStyle.module.css";
import ReactPhoneInput from "react-phone-input-2";
import { QuizFormErrors, QuizUserFormProps } from "@/types/quiz";
import "react-phone-input-2/lib/style.css";
import { useMemo } from "react";

const QuizForm: React.FC<{
  studentData: QuizUserFormProps;
  formErrors: QuizFormErrors;
  handleChange: (
    value: string,
    type: "email" | "studentId" | "phoneNumber"
  ) => void;
  handleSubmit: () => void;
  isValidating: boolean;
}> = ({
  studentData,
  formErrors,
  handleChange,
  handleSubmit,
  isValidating,
}) => {
  return (
    <div className="flex flex-1 my-auto flex-col w-full h-full bg-base-200 justify-center items-center gap-6">
      <div className="flex flex-col items-center bg-base-100 shadow-xl rounded-lg p-6 sm:w-[400px]">
        <div className="flex flex-col items-center text-center mb-5">
          <Image
            alt="logo"
            src={"/assets/imgs/logo.png"}
            width={75}
            height={50}
          />
          <div className="text-lg mt-2 text-white">
            <p>Please Enter Your Information To Start the Quiz</p>
            <p className="text-yellow-500 font-semibold">
              Your Information is safe with us
            </p>
          </div>
        </div>

        <AlertMessage />

        <form className={formStyle.form}>
          {quizUserForm.map((field) => (
            <div key={field.name} className="form-group">
              <label htmlFor={field.name} className="!mb-2">
                {field.label}
              </label>
              {field.type === "phone" ? (
                <ReactPhoneInput
                  inputProps={{
                    name: field.name,
                    required: true,
                    className: "phone-input",
                  }}
                  onlyCountries={["eg"]}
                  country={"eg"}
                  value={studentData.phoneNumber}
                  countryCodeEditable={false}
                  placeholder=""
                  onChange={(phoneValue) => {
                    handleChange(phoneValue, "phoneNumber");
                  }}
                  containerClass="phone-input-container"
                  buttonClass="phone-input-button"
                  inputClass="phone-input"
                  disableDropdown={true}
                  disableSearchIcon={true}
                />
              ) : (
                <>
                  <input
                    type={field.type}
                    name={field.name}
                    value={studentData[field.name as keyof QuizUserFormProps]}
                    onChange={(e) =>
                      handleChange(
                        e.target.value,
                        field.onChangeType as
                          | "email"
                          | "studentId"
                          | "phoneNumber"
                      )
                    }
                  />
                  {field.onChangeType === "id" && (
                    <span className="text-gray-500 font-semibold">
                      For Example: 2201579
                    </span>
                  )}
                </>
              )}
              {formErrors[field.name as keyof QuizFormErrors] && (
                <div className="text-red-600 font-semibold">
                  {formErrors[field.name as keyof QuizFormErrors]}
                </div>
              )}
            </div>
          ))}
          <button
            type="button"
            disabled={isValidating}
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
          >
            {isValidating ? (
              <span className="flex items-center justify-center mx-auto loading loading-spinner loading-md"></span>
            ) : (
              "Start Quiz"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

const AlertMessage: React.FC = () => {
  const message = useMemo(() => {
    return (
      <div className="bg-red-800 border-l-8 border-red-500 text-white p-6 mb-6 w-full rounded-lg shadow-lg">
        <div className="flex items-start">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-3 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div>
            <p className="font-bold text-lg mb-2">Important:</p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>
                  Please ensure that the information you provide is accurate.
                  Submitting incorrect or invalid data may result in
                  disqualification from the quiz.
                </span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="font-semibold">
                  Tapping out of the window or unfocusing the window will
                  terminate the quiz.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }, []);
  return message;
};

export default QuizForm;
