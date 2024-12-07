"use client";
import { quizUserForm } from "@/constants";
import Image from "next/image";
import formStyle from "@/styles/formStyle.module.css";
import ReactPhoneInput from "react-phone-input-2";
import { QuizFormErrors, QuizUserFormProps } from "@/types/quiz";
import "react-phone-input-2/lib/style.css";

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
    <div className="my-8 flex flex-1 flex-col w-full h-full bg-base-200 justify-center items-center gap-6">
      <div className="flex flex-col items-center bg-base-100 shadow-xl rounded-lg p-6 w-[85dvw] sm:w-full sm:max-w-screen-sm">
        <div className="flex flex-col items-center text-center mb-5">
          <Image
            alt="logo"
            src={"/assets/imgs/logo.png"}
            width={75}
            height={50}
          />
          <div className="text-lg  mt-2 text-white">
            <p>Please Enter Your Information To Start the Quiz</p>
            <p className="text-yellow-500 font-semibold">
              Your Information is safe with us
            </p>
          </div>
        </div>
        <form className={formStyle.form}>
          {quizUserForm.map((field) => (
            <div key={field.name} className="form-group ">
              <label htmlFor={field.name}>{field.label}</label>
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
                      For Example : 2201579
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
          <button type="button" disabled={isValidating} onClick={handleSubmit}>
            Start Quiz
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuizForm;
