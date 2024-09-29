"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import formStyle from "@/styles/formStyle.module.css";
import { useResetPassword } from "@/hooks/auth";
import {
  validatePasswordSchema,
  validateWithSchema,
} from "@/utils/validations";
import { useRouter } from "next/navigation";

const ResetPasswordForm: React.FC = () => {
  const [newPassword, setNewPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<
    string,
    string
  > | null>(null);
  const routeTo = useRouter();

  const {
    loading,
    success,
    handleResetPassword,
    error: apiErrors,
  } = useResetPassword();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationErrors(null);

    const schema = validatePasswordSchema();
    try {
      schema.parse({ newPassword });
      handleResetPassword(newPassword);
    } catch (error) {
      setValidationErrors(validateWithSchema(error));
      console.log(validationErrors);
    }
  };

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        routeTo.push("/authportal");
      }, 2000);
    }
  }, [success]);

  return (
    <div className="my-10 flex flex-1 flex-col w-full h-full bg-base-200 justify-center items-center gap-6">
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
          <div className={formStyle.input_container}>
            <label htmlFor="password" className="text-sm text-gray-700">
              New Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className={
                validationErrors?.newPassword || apiErrors?.newPassword
                  ? formStyle.input_error
                  : ""
              }
              value={newPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewPassword(e.target.value)
              }
              disabled={success || loading}
            />
            <small className="text-red-500 h-[20px]">
              {validationErrors?.newPassword || apiErrors?.newPassword}
            </small>
          </div>

          <button
            type={success || loading ? "button" : "submit"}
            className={`flex items-center justify-center ${
              success || loading ? formStyle.button_success : ""
            }`}
            // disabled={success || loading}
          >
            {loading ? (
              <span className="loading loading-spinner loading-md"></span>
            ) : (
              "Reset Password"
            )}
          </button>

          {apiErrors && apiErrors.message && (
            <p className="font-semibold text-red-600 mx-auto">
              {apiErrors.message}
            </p>
          )}

          {success && (
            <span className="mx-auto text-green-600 font-semibold">
              Password has been reset successfully.
            </span>
          )}
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
