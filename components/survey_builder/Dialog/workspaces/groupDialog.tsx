import { Dialog, DialogPanel, Transition } from "@headlessui/react";
import { useSelector } from "react-redux";
import {
  useAddGroupMember,
  useRemoveGroupMember,
} from "@/hooks/survey_builder/user_group";
import { useEffect, useState, useCallback, Fragment } from "react";
import { RootState } from "@/store/store";
import Image from "next/image";

interface GroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const GroupDialog: React.FC<GroupDialogProps> = ({ isOpen, onClose }) => {
  const groupState = useSelector((state: RootState) => state.userGroup);
  const {
    handleRemoveMember,
    errorState: removeErrorState,
    isPending: deletePending,
  } = useRemoveGroupMember();
  const { handleAddMember, errorState, isSuccess, isPending } =
    useAddGroupMember();

  const [text, setText] = useState("");

  const addMember = async () => {
    if (!text.trim()) return;
    try {
      await handleAddMember({
        username: text.trim(),
        groupId: groupState.id,
        groupName: groupState.name,
      });
    } catch (error) {
      console.error("Error adding member:", error);
    }
  };

  const removeMember = async (memberId: number) => {
    try {
      await handleRemoveMember({
        memberId,
        groupId: groupState.id,
      });
    } catch (error) {
      console.error("Error removing member:", error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setText("");
    }
  }, [isSuccess]);

  const handleClose = useCallback(() => {
    setText("");
    onClose();
  }, [onClose]);

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        className="relative z-50 "
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <div
          className="fixed inset-0 bg-black bg-opacity-30 "
          aria-hidden="true"
        />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl h-[600px] overflow-hidden">
            <button
              className="w-full flex justify-end pr-2"
              type="button"
              onClick={handleClose}
            >
              <Image
                src="/assets/icons/close.svg"
                alt="close"
                width={25}
                height={25}
              />
            </button>
            <div className="flex flex-col gap-3 p-6 text-white rounded-md">
              <h3
                id="dialog-title"
                className="text-2xl font-bold mb-2 text-[#e4e4e4]"
              >
                {groupState.name ?? "Your Group"}
              </h3>
              <span
                id="dialog-description"
                className="text-sm text-gray-600 font-semibold"
              >
                You can invite other admins to share your surveys with them
              </span>
              <div className="flex flex-col items-center gap-1 overflow-hidden">
                <div className="flex flex-wrap items-center gap-5">
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter user's name"
                    className="w-[350px] px-4 py-2 bg-[#2b2b2b] text-[#d1d1d1] rounded-md border border-[#3d3d3d] focus:outline-none focus:border-[#4b6ef5] transition-all"
                  />
                  <button
                    disabled={isPending}
                    className="flex justify-center items-center bg-blue-600 transition-all py-2 px-4 rounded"
                    type="submit"
                    onClick={addMember}
                  >
                    {isPending ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                      "Add"
                    )}
                  </button>
                </div>
                {errorState?.message && (
                  <span className="text font-semibold text-red-600 text-center">
                    {errorState.message}
                  </span>
                )}
              </div>

              <h4 className="font-semibold mt-4 mb-2 text-[#e4e4e4]">
                Members
              </h4>
              {removeErrorState?.message && (
                <span className="text mx-auto font-semibold text-red-600 text-center">
                  {removeErrorState.message}
                </span>
              )}
              {groupState.groupMembers.length !== 0 ? (
                <ul className="flex flex-col gap-4 px-3 overflow-y-scroll h-[200px] py-2">
                  {groupState.groupMembers.map((member) => (
                    <li
                      key={member.userId}
                      className="flex justify-between px-3 items-center p-2 bg-base-100 rounded-md"
                    >
                      <span className="block text-ellipsis overflow-hidden">
                        {member.user?.username}
                      </span>
                      <button
                        type="button"
                        disabled={deletePending}
                        onClick={() => removeMember(member.userId)}
                        className="text-red-400 hover:text-red-500 transition-all font-semibold"
                      >
                        {deletePending ? (
                          <span className="loading loading-spinner loading-sm"></span>
                        ) : (
                          "Remove"
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Start Inviting others</p>
              )}
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </Transition>
  );
};

export default GroupDialog;
