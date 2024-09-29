import React, { useState } from "react";
import Image from "next/image";
import formStyle from "@/styles/formStyle.module.css";
import { useSendEmail } from "@/hooks/auth";
import { validateEmailSchema, validateWithSchema } from "@/utils/validations";
interface Props {
  changeTabTo: (newTab: "signin" | "sendemail") => void;
}
const SendToEmail: React.FC<Props> = ({ changeTabTo }) => {
  const [email, setEmail] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<
    string,
    string
  > | null>(null);

  const {
    loading,
    success,
    handleSendEmail,
    error: apiErrors,
  } = useSendEmail();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const schema = validateEmailSchema();
    setValidationErrors(null);
    try {
      schema.parse({ email });
      handleSendEmail(email);
    } catch (error) {
      setValidationErrors(validateWithSchema(error));
    }
  };

  return (
    <div className="flex flex-1 flex-col w-full h-full bg-base-200 justify-center items-center gap-6">
      <div className="flex flex-col items-center bg-base-100 shadow-xl rounded-lg p-6 w-[85dvw] sm:w-full sm:max-w-sm">
        <div className="flex flex-col items-center text-center mb-5">
          <Image
            alt="logo"
            src={"/assets/imgs/logo.png"}
            width={75}
            height={50}
          />
        </div>

        <form method="POST" className={formStyle.form} onSubmit={handleSubmit}>
          <p
            className="transition-all hover:text-blue-500 active:text-blue-500 w-max cursor-pointer"
            onClick={() => changeTabTo("signin")}
          >
            Go Back
          </p>
          <div className={formStyle.input_container}>
            <label htmlFor="usernameOrEmail" className="text-sm text-gray-700">
              Please Enter Your Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              className={
                validationErrors?.email || apiErrors?.email
                  ? formStyle.input_error
                  : ""
              }
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              disabled={success || loading}
            />
            <small className="text-red-500 h-[20px]">
              {validationErrors?.email || apiErrors?.email}
            </small>
          </div>

          <button
            type={success || loading ? "button" : "submit"}
            className={`flex items-center justify-center  ${
              success || loading ? formStyle.button_success : ""
            }`}
            disabled={success || loading}
          >
            {loading ? (
              <span className="loading loading-spinner loading-md"></span>
            ) : (
              "Send Email"
            )}
          </button>
          {success && (
            <span className="mx-auto text-green-600 font-semibold">
              {" "}
              An Email Has been sent
            </span>
          )}
          {(apiErrors?.message || apiErrors?.restToken) && (
            <p className="mx-auto text-red-600 font-semibold">
              {apiErrors?.message ?? apiErrors?.restToken}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default SendToEmail;
