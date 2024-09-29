import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AdminDashboard,
  MyDataDashboard,
  OwnerDashboard,
  CourseDashboard,
} from "@/types";

// Define initial states
const myDataInitState: MyDataDashboard = {
  username: "",
  email: "",
};
const ownersInitState: OwnerDashboard[] = [];
const adminsInitState: AdminDashboard[] = [];
const coursesInitState: CourseDashboard[] = [];

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    myData: myDataInitState,
    owners: ownersInitState,
    admins: adminsInitState,
    courses: coursesInitState,
  },
  reducers: {
    setMyData: (state, action: PayloadAction<MyDataDashboard>) => {
      state.myData = action.payload;
    },
    setOwners: (state, action: PayloadAction<OwnerDashboard[] | []>) => {
      state.owners = action.payload;
    },
    setAdmins: (state, action: PayloadAction<AdminDashboard[] | []>) => {
      state.admins = action.payload;
    },
    setCourses: (state, action: PayloadAction<CourseDashboard[] | []>) => {
      state.courses = action.payload;
    },
  },
});

// Export the actions and reducer
export const { setCourses, setAdmins, setOwners, setMyData } =
  dashboardSlice.actions;
export default dashboardSlice.reducer;
