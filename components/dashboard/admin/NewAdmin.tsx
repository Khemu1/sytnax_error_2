"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import formStyle from "@/styles/formStyle.module.css";
import { SignUpProps } from "@/types";
import { signUpSchema, validateWithSchema } from "@/utils/validations";
import { useCreateAdmin } from "@/hooks/admin";
import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { setAdmins } from "@/store/slices/dashboardSlice";
import { closeDialog } from "@/store/slices/dialogSlice";
export const runtime = "edge";

const NewAdmin: React.FC = () => {
  const [data, setData] = useState<SignUpProps>({
    username: "",
    email: "",
    password: "",
  });
  const {
    loading,
    error: apiErrors,
    success,
    data: newAdmin,
    handleCreateAdmin,
  } = useCreateAdmin();
  const [validationErrors, setValidationErrors] = useState<Record<
    string,
    string
  > | null>(null);
  const dispatch = useDispatch();
  const dashboardState = useSelector((state: RootState) => state.dashboard);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const schema = signUpSchema;
    try {
      e.preventDefault();
      schema.parse(data);
      handleCreateAdmin(data);
    } catch (error) {
      setValidationErrors(validateWithSchema(error));
    }
  };

  useEffect(() => {
    const update = async () => {
      if (newAdmin) {
        dispatch(setAdmins([...dashboardState.admins, newAdmin]));
      }
      dispatch(closeDialog());
      setData({
        username: "",
        email: "",
        password: "",
      });
      setValidationErrors(null);
    };
    if (success && data) {
      update();
    }
  }, [success, data]);
  return (
    <div className="flex flex-col w-full h-full  justify-center items-center gap-6 z-[3]">
      <div className="flex flex-col items-center bg-base-100 shadow-xl rounded-lg p-6 w-[85dvw] sm:w-full sm:max-w-sm">
        <div className="flex flex-col items-center text-center mb-5">
          <Image
            alt="logo"
            src={"/assets/imgs/logo.png"}
            width={75}
            height={50}
          />
          <div className="text-lg font-light mt-2">
            <span className="font-semibold ">New Admin Account</span>
          </div>
        </div>
        <form
          method="POST"
          className={formStyle.form}
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmit(e)}
        >
          <div className={formStyle.input_container}>
            <label htmlFor="username" className="text-sm text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter username"
              className={
                validationErrors?.username || apiErrors?.username
                  ? formStyle.input_error
                  : ""
              }
              value={data.username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setData((prev: SignUpProps) => ({
                  ...prev,
                  username: e.target.value,
                }))
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
              name="username"
              placeholder="Enter email"
              className={
                validationErrors?.email || apiErrors?.email
                  ? formStyle.input_error
                  : ""
              }
              value={data.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setData((prev: SignUpProps) => ({
                  ...prev,
                  email: e.target.value,
                }))
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
              placeholder="Enter password"
              className={
                validationErrors?.password || apiErrors?.password
                  ? formStyle.input_error
                  : ""
              }
              value={data.password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setData((prev: SignUpProps) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
            />
            {/* Error message for Password */}
            <small className="text-red-500 h-[20px]">
              {validationErrors?.password || apiErrors?.password}
            </small>
          </div>

          {apiErrors?.message && (
            <p className="mx-auto h-[10px] font-semibold text-xl text-red-600">
              {apiErrors?.message}
            </p>
          )}

          <button
            type={success ? "button" : "submit"}
            className={success || loading ? formStyle.button_success : ""}
          >
            {loading ? (
              <span className="loading loading-spinner loading-md"></span>
            ) : (
              "Submit"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewAdmin;
