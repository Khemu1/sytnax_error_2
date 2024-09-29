import { RootState } from "@/store/store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import formStyle from "@/styles/formStyle.module.css";

import { EditAdminProps } from "@/types";
import { updatedAdminSchema, validateWithSchema } from "@/utils/validations";
import { closeDialog } from "@/store/slices/dialogSlice";
import { setAdmins } from "@/store/slices/dashboardSlice";
import { useEditAdmin } from "@/hooks/admin";

const EditAdmin = () => {
  const dispatch = useDispatch();
  const dialogState = useSelector((state: RootState) => state.dialog);
  const dashboardState = useSelector((state: RootState) => state.dashboard);
  const {
    loading,
    error: apiErrors,
    success,
    data: newAdmin,
    handleEditAdmin,
  } = useEditAdmin();

  const [data, setData] = useState<EditAdminProps>({
    username: "",
    email: "",
    password: "",
  });

  const [validationErrors, setValidationErrors] = useState<Record<
    string,
    string
  > | null>(null);

  useEffect(() => {
    if (!dialogState.editContent) {
      dispatch(closeDialog());
      return;
    }
  }, [dialogState.editContent, dispatch]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationErrors(null);
    if (!dialogState.editContent) {
      setValidationErrors({ general: "Dialog state is missing" });
      return;
    }

    const schema = updatedAdminSchema(
      dialogState.editContent.email,
      dialogState.editContent.username
    );

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const prepData: any = {};
      for (const [key, value] of Object.entries(data)) {
        if (value.trim().length > 0) {
          prepData[key] = value.trim();
        }
      }
      schema.parse(prepData);
      handleEditAdmin(dialogState.editContent.id, prepData);
    } catch (error) {
      setValidationErrors(validateWithSchema(error));
    }
  };

  useEffect(() => {
    const update = async () => {
      if (newAdmin) {
        const NewAdmins = dashboardState.admins.map((admin) => {
          if (admin.id === newAdmin.id) {
            return newAdmin;
          }
          return admin;
        });
        dispatch(setAdmins(NewAdmins));
      }
      dispatch(closeDialog());
      setData({
        username: "",
        email: "",
        password: "",
      });
      setValidationErrors(null);
    };

    if (success && newAdmin) {
      update();
    }
  }, [success, newAdmin, dashboardState.admins, dispatch]);

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
          <div className="text-lg font-light mt-2">
            <span className="font-semibold">Edit Admin Account</span>
          </div>
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
              placeholder={dialogState.editContent?.username ?? "New Username"}
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
              placeholder={data.email ?? "New Email"}
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
        </form>
      </div>
    </div>
  );
};

export default EditAdmin;
