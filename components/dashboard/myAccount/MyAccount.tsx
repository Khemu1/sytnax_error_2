import { useGetMyInfo } from "@/hooks/admin";
import { updateEmail } from "@/store/slices/authSlice";
import { RootState } from "@/store/store";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DashboardDialog from "../DashboardDialog";
import { openMyDataDialog } from "@/store/slices/dialogSlice";

const MyAccount = () => {
  const { loading, error, data, handleGetMyInfo } = useGetMyInfo();
  const authState = useSelector((state: RootState) => state.auth);
  const dialogState = useSelector((state: RootState) => state.dialog);

  const dispatch = useDispatch();
  useEffect(() => {
    if (!authState.email) {
      handleGetMyInfo();
    }
  }, [authState]);

  useEffect(() => {
    if (data) {
      dispatch(updateEmail(data.email));
    }
  }, [data]);

  if (loading) {
    return (
      <div className="flex w-full flex-grow  items-center justify-center gap-2">
        <span className="loading loading-spinner w-[75px]"></span>
      </div>
    );
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="p-4 flex flex-col bg-base-100 w-full rounded-xl gap-5">
      <div className="flex justify-end">
        <button
          className="bg-base-300 transition-all hover:bg-blue-700  hover:text-white font-semibold p-2 rounded-lg"
          type="button"
          onClick={() =>
            dispatch(
              openMyDataDialog({
                email: authState.email!,
                username: authState.username!,
              })
            )
          }
        >
          Update My Account Data
        </button>
      </div>
      <div className="profile_input_container">
        <label>Email</label>
        <input
          className="profile_input"
          type="text"
          value={authState.email ?? "somthing off"}
          onChange={(e) => dispatch(updateEmail(e.target.value))}
          disabled={true}
        />
      </div>
      <div className="profile_input_container">
        <label>Username</label>
        <input
          disabled={true}
          className="profile_input"
          type="text"
          value={authState.username ?? "somthing off"}
        />
      </div>
      {dialogState.isDialogOpen && <DashboardDialog />}
    </div>
  );
};

export default MyAccount;
