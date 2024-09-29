import { AdminDashboard, MyDataDashboard } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DialogState {
  isDialogOpen: boolean;
  dialogType: "edit" | "newAdmin" | "editCourse" | "myData" | "";
  editContent: AdminDashboard | null; // Data for editing an admin
  myData: MyDataDashboard | null;
  courseId: number | null;
}

const initialState: DialogState = {
  isDialogOpen: false,
  dialogType: "",
  editContent: null,
  courseId: null,
  myData: null,
};

const dialogSlice = createSlice({
  name: "dialog",
  initialState,
  reducers: {
    openEditDialog(state, action: PayloadAction<AdminDashboard>) {
      state.isDialogOpen = true;
      state.dialogType = "edit";
      state.editContent = action.payload;
    },
    openNewAdminDialog(state) {
      state.isDialogOpen = true;
      state.dialogType = "newAdmin";
      state.editContent = null;
    },
    openEditCourseDialog(state, action: PayloadAction<number>) {
      state.isDialogOpen = true;
      state.dialogType = "editCourse";
      state.courseId = action.payload;
    },
    openMyDataDialog(state, action: PayloadAction<MyDataDashboard>) {
      state.isDialogOpen = true;
      state.dialogType = "myData";
      state.myData = action.payload;
    },
    closeDialog(state) {
      state.isDialogOpen = false;
      state.dialogType = "";
      state.editContent = null;
      state.courseId = null;
    },
  },
});

export const {
  openEditDialog,
  openEditCourseDialog,
  openNewAdminDialog,
  closeDialog,
  openMyDataDialog,
} = dialogSlice.actions;

export default dialogSlice.reducer;
