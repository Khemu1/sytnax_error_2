/* eslint-disable no-use-before-define */
import { addMember, deleteMember } from "@/store/slices/survey/userGroup";
import { UserGroupModel } from "@/types/survey";
import { Dispatch } from "@reduxjs/toolkit";
export const addGroupMemberF = async (
  member: UserGroupModel,
  dispatch: Dispatch
) => {
  try {
    const formatDate = (date: unknown): string =>
      typeof date === "string" && !isNaN(Date.parse(date))
        ? new Date(date).toISOString()
        : date instanceof Date
        ? date.toISOString()
        : "";

    dispatch(
      addMember({
        ...member,
        createdAt: formatDate(member.createdAt),
        updatedAt: formatDate(member.updatedAt),
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
