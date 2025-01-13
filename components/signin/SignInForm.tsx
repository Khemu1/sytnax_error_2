"use client";
import Image from "next/image";
import React, { useState } from "react";
import formStyle from "@/styles/formStyle.module.css";
import { signInPropsFrontEnd } from "@/types";
import { useSignIn } from "@/hooks/auth";
import {
  signInSchema,
  validateWithSchema,
} from "@/utils/validations/validations";

interface Props {
  changeTabTo: (newTab: "signin" | "sendemail") => void;
}
const SignInForm: React.FC<Props> = ({ changeTabTo }) => {
  const [data, setData] = useState<signInPropsFrontEnd>({
    usernameOrEmail: "",
    password: "",
  });
  const { loading, error: apiErrors, success, handleSignIn } = useSignIn();
  const [validationErrors, setValidationErrors] = useState<Record<
    string,
    string
  > | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const schema = signInSchema;
    try {
      e.preventDefault();
      schema.parse(data);
      handleSignIn(data);
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
          <div className="text-lg font-light mt-2">
            Welcome Back to{" "}
            <span className="font-semibold text-blue-500">Syntax Error</span>
          </div>
        </div>
        <form
          method="POST"
          className={formStyle.form}
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmit(e)}
        >
          {/* Username or Email Input */}
          <div className={formStyle.input_container}>
            <label htmlFor="usernameOrEmail" className="text-sm text-gray-700">
              Email or Username
            </label>
            <input
              type="text"
              id="usernameOrEmail"
              name="usernameOrEmail"
              placeholder="Enter your email or username"
              className={
                validationErrors?.usernameOrEmail || apiErrors?.usernameOrEmail
                  ? formStyle.input_error
                  : ""
              }
              value={data.usernameOrEmail}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setData((prev: signInPropsFrontEnd) => ({
                  ...prev,
                  usernameOrEmail: e.target.value,
                }))
              }
            />
            <small className="text-red-500 h-[20px]">
              {validationErrors?.usernameOrEmail || apiErrors?.usernameOrEmail}
            </small>
          </div>

          {/* Password Input */}
          <div className={formStyle.input_container}>
            <label htmlFor="password" className="text-sm text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className={
                validationErrors?.password || apiErrors?.password
                  ? formStyle.input_error
                  : ""
              }
              value={data.password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setData((prev: signInPropsFrontEnd) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
            />
            {/* Error message for Password */}
            <small className="text-red-500 h-[20px]">
              {validationErrors?.password || apiErrors?.password}
            </small>

            <span
              className="text-xs text-blue-500 hover:underline mt-1 cursor-pointer"
              onClick={() => changeTabTo("sendemail")}
            >
              Forgot your password?
            </span>
          </div>

          {apiErrors?.message && (
            <p className="mx-auto text-center mb-5 h-[10px] font-semibold text-xl text-red-600">
              {apiErrors?.message.includes("prisma.user.findFirst()")
                ? "Something went wrong"
                : apiErrors?.message}
            </p>
          )}

          <button
            type={success ? "button" : "submit"}
            className={`flex items-center justify-center  ${
              success || loading ? formStyle.button_success : ""
            }`}
            disabled={success}
          >
            {loading ? (
              <span className="loading loading-spinner loading-md"></span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignInForm;
