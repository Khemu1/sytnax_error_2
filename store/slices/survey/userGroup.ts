import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GroupModel, UserGroupModel } from "../../../types/survey";

const initialState: GroupModel = {
  id: "",
  ownerId: 0,
  name: "",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  groupMembers: [],
};

const groupSlice = createSlice({
  name: "userGroup",
  initialState,
  reducers: {
    setGroup: (state, action: PayloadAction<GroupModel>) => {
      return { ...state, ...action.payload };
    },

    addMember: (state, action: PayloadAction<UserGroupModel>) => {
      state.groupMembers.push(action.payload);
    },

    deleteMember: (state, action: PayloadAction<number>) => {
      console.log("bfeore", state.groupMembers.length);
      console.log("in", action.payload);
      state.groupMembers = state.groupMembers.filter(
        (member) => +member.userId !== +action.payload
      );
      console.log("after", state.groupMembers.length);
    },
  },
});

export const { setGroup, addMember, deleteMember } = groupSlice.actions;

export default groupSlice.reducer;
