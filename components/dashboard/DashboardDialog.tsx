import React from "react";
import NewAdmin from "./admin/NewAdmin";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
;
import EditMyAccount from "./myAccount/EditMyAccount";
import EditAdmin from "./admin/EditAdmin";
import EditCourse from "./course/EditCourse";
import { closeDialog } from "@/store/slices/dialogSlice";

const DashboardDialog: React.FC = () => {
  const dispatch = useDispatch();
  const dialogState = useSelector((state: RootState) => state.dialog);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="relative rounded-lg shadow-lg p-6 z-10 h-[100%] overflow-y-auto w-full">
        <button
          className="absolute top-2 right-2 text-white text-3xl font-semibold"
          onClick={() => dispatch(closeDialog())}
        >
          &times;
        </button>

        {dialogState.dialogType === "newAdmin" && <NewAdmin />}
        {dialogState.dialogType === "edit" && <EditAdmin />}
        {dialogState.dialogType === "editCourse" && <EditCourse />}
        {dialogState.dialogType === "myData" && <EditMyAccount />}
      </div>
    </div>
  );
};

export default DashboardDialog;
