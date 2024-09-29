import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useEditMyInfo } from "@/hooks/admin";
import { EditMyAccountProps } from "@/types";
import { updateMyAccount, validateWithSchema } from "@/utils/validations";
import formStyle from "@/styles/formStyle.module.css";
import { closeDialog } from "@/store/slices/dialogSlice";
import Toast from "../../skeletons/Toast";
import { updateData } from "@/store/slices/authSlice";

const EditMyAccount = () => {
  const authState = useSelector((state: RootState) => state.auth);
  const {
    loading,
    error: apiErrors,
    success,
    data: newInfo,
    handleEditMyInfo,
  } = useEditMyInfo();

  const [data, setData] = useState<EditMyAccountProps>({
    username: "",
    email: "",
    password: "",
  });

  const [validationErrors, setValidationErrors] = useState<Record<
    string,
    string
  > | null>(null);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const dispatch = useDispatch();
  const closeToast = () => {
    setToast(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationErrors(null);
    if (!authState.email || !authState.username) {
      setValidationErrors({ message: "Auth state is missing" });
      return;
    }

    const schema = updateMyAccount(authState.email, authState.username);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const prepData: any = {};
      for (const [key, value] of Object.entries(data)) {
        if (value.trim().length > 0) {
          prepData[key] = value.trim();
        }
      }
      schema.parse(prepData);

      handleEditMyInfo(prepData);
    } catch (error) {
      setValidationErrors(validateWithSchema(error));
    }
  };

  useEffect(() => {
    if (success && newInfo) {
      dispatch(updateData(newInfo));
      setToast({
        message: "Account data have been updated successfully.",
        type: "success",
      });
      setTimeout(() => {
        dispatch(closeDialog());
      }, 2000);
    }
  }, [newInfo]);
  return (
    <div className="flex flex-col w-full h-full justify-center items-center gap-6 z-[3]">
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
            <label htmlFor="username" className="text-sm text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder={authState?.username ?? "New Username"}
              className={
                validationErrors?.username ||
                validationErrors?.emptyFields ||
                apiErrors?.username ||
                apiErrors?.emptyFields
                  ? formStyle.input_error
                  : ""
              }
              onChange={(e) =>
                setData((prev) => ({ ...prev, username: e.target.value }))
              }
            />
            <small className="text-red-500 h-[20px]">
              {validationErrors?.username || apiErrors?.username}
            </small>
          </div>

          <div className={formStyle.input_container}>
            <label htmlFor="email" className="text-sm text-gray-700">
              Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              placeholder={authState.email ?? "New Email"}
              className={
                validationErrors?.email ||
                validationErrors?.emptyFields ||
                apiErrors?.email ||
                apiErrors?.emptyFields
                  ? formStyle.input_error
                  : ""
              }
              value={data.email ?? ""}
              onChange={(e) =>
                setData((prev) => ({ ...prev, email: e.target.value }))
              }
            />
            <small className="text-red-500 h-[20px]">
              {validationErrors?.email || apiErrors?.email}
            </small>
          </div>

          <div className={formStyle.input_container}>
            <label htmlFor="password" className="text-sm text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="●●●●●●●●●●●●●●●"
              className={
                validationErrors?.password ||
                validationErrors?.emptyFields ||
                apiErrors?.password ||
                apiErrors?.emptyFields
                  ? formStyle.input_error
                  : ""
              }
              onChange={(e) =>
                setData((prev) => ({ ...prev, password: e.target.value }))
              }
            />
            <small className="text-red-500 h-[20px]">
              {validationErrors?.password || apiErrors?.password}
            </small>
          </div>

          <p className="mx-auto text-center h-[10px] font-semibold text-xl text-red-600">
            {apiErrors?.message ??
              validationErrors?.emptyFields ??
              apiErrors?.emptyFields}
          </p>
          <button
            type="submit"
            className={success || loading ? formStyle.button_success : ""}
          >
            {loading ? (
              <span className="loading loading-spinner loading-md"></span>
            ) : (
              "Update"
            )}
          </button>
          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={closeToast}
            />
          )}
        </form>
      </div>
    </div>
  );
};

export default EditMyAccount;
