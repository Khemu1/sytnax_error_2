import { addMember, deleteMember } from "@/store/slices/survey/userGroup";
import { UserGroupModel } from "@/types/survey";
import { Dispatch } from "@reduxjs/toolkit";

export const addGroupMemberF = async (
  member: UserGroupModel,
  dispatch: Dispatch
) => {
  try {
    dispatch(
      addMember({
        ...member,
        createdAt:
          // todo: fix it later
          member.createdAt instanceof Date
            ? member.createdAt.toISOString()
            : member.createdAt ?? "",
        updatedAt:
          member.updatedAt instanceof Date
            ? member.updatedAt.toISOString()
            : member.updatedAt ?? "",
      })
    );
  } catch (error) {
    console.error(error);
  }
};

export const removeGroupMemberF = async (
  memberId: number,
  dispatch: Dispatch
) => {
  try {
    dispatch(deleteMember(+memberId));
  } catch (error) {
    console.error(error);
  }
};
