import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import {
  addUserToGroup,
  removeUserFromGroup,
} from "@/frontendServices/survey_builder/user_group";
import { UserGroupModel } from "@/types/survey";
import { addGroupMemberF, removeGroupMemberF } from "@/utils/survey_builder/user_group";
import { useDispatch } from "react-redux";
import { CustomError } from "@/middleware/CustomError";

export const useAddGroupMember = () => {
  const dispatch = useDispatch();
  const [errorState, setErrorState] = useState<Record<
    string,
    string | undefined
  > | null>(null);

  const mutation = useMutation<
    UserGroupModel,
    CustomError | unknown,
    {
      username: string;
      groupId: number;
      groupName: string;
    }
  >({
    mutationFn: async ({
      username,
      groupId,
      groupName,
    }) => {
      setErrorState(null);

      const response = await addUserToGroup(
        groupId,
        groupName,
        username,
      );

      return response;
    },
    onSuccess: async (groupMember: UserGroupModel) => {
      console.log("just arrived", groupMember);
      await addGroupMemberF(groupMember, dispatch);
    },
    onError: (err: CustomError | unknown) => {
      console.log(err);

      const message =
        err instanceof CustomError
          ? err.errors || { message: err.message }
          : { message: "Unknown Error" };
      setErrorState(message);
      console.error("Error adding group member:", err);
    },
  });

  const {
    mutateAsync: handleAddMember,
    isError,
    isSuccess,
    isPending,
  } = mutation;

  return {
    handleAddMember,
    isError,
    isSuccess,
    errorState,
    isPending,
  };
};

export const useRemoveGroupMember = () => {
  const dispatch = useDispatch();

  const [errorState, setErrorState] = useState<Record<
    string,
    string | undefined
  > | null>(null);

  const mutation = useMutation<
    number,
    CustomError | unknown,
    {
      memberId: number;
      groupId: number;
    }
  >({
    mutationFn: async ({
      memberId,
      groupId,
    }) => {
      setErrorState(null);

      const response = await removeUserFromGroup(
        groupId,
        memberId,
      );
      return response;
    },
    onSuccess: (userId: number) => {
      console.log("just arrived", userId);
      removeGroupMemberF(+userId, dispatch);
    },
    onError: (err: CustomError | unknown) => {
      const message =
        err instanceof CustomError
          ? err.errors || { message: err.message }
          : { message: "Unknown Error" };
      setErrorState(message);
      console.error("Error creating new survey:", err);
    },
  });

  const {
    mutateAsync: handleRemoveMember,
    isError,
    isSuccess,
    isPending,
  } = mutation;

  return {
    handleRemoveMember,
    isError,
    isSuccess,
    errorState,
    isPending,
  };
};
