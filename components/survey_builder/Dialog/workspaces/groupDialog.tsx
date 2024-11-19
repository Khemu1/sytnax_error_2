import { Dialog, DialogPanel } from "@headlessui/react";
import { useSelector } from "react-redux";
import {
  useAddGroupMember,
  useRemoveGroupMember,
} from "@/hooks/survey_builder/user_group";
import { useEffect, useState } from "react";
import { RootState } from "@/store/store";
import Image from "next/image";

interface GroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const GroupDialog: React.FC<GroupDialogProps> = ({ isOpen, onClose }) => {
  const groupState = useSelector((state: RootState) => state.userGroup);
  const { handleRemoveMember, errorState: removeErrorState } =
    useRemoveGroupMember();
  const { handleAddMember, errorState, isSuccess } = useAddGroupMember();

  const [text, setText] = useState("");

  const addMember = async () => {
    if (!text.trim()) return;
    await handleAddMember({
      username: text,
      groupId: groupState.id,
      groupName: groupState.name,
    });
  };

  const removeMember = async (memberId: number) => {
    await handleRemoveMember({
      memberId,
      groupId: groupState.id,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      setText("");
    }
  }, [isSuccess]);
  useEffect(() => {
    setText("");
  }, [onClose]);
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div
        className="fixed inset-0 bg-black bg-opacity-30"
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className=" bg-base-100 rounded-md py-5">
          <button
            className="w-full flex justify-end pr-2"
            type="button"
            onClick={() => {
              onClose();
            }}
          >
            <Image
              src="/assets/icons/close.svg"
              alt="close"
              width={25}
              height={25}
            />
          </button>
          <div className="flex flex-col gap-3 p-6 text-white rounded-md">
            <h3 className="text-2xl font-bold mb-2 text-[#e4e4e4]">
              Your Group
            </h3>
            <span className="text-sm text-gray-600 font-semibold">
              You can invite other admins to share your surveys with them
            </span>
            <div className="flex flex-col items-center gap-1">
              <div className="flex flex-wrap items-center gap-5">
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter user's name"
                  className="w-[350px] px-4 py-2 bg-[#2b2b2b] text-[#d1d1d1] rounded-md border border-[#3d3d3d] focus:outline-none focus:border-[#4b6ef5] transition-all"
                />
                <button
                  className="bg-[#4b6ef5] px-4 py-2 rounded-md text-sm font-semibold transition-all hover:bg-[#3d37a9]"
                  onClick={addMember}
                >
                  Add
                </button>
              </div>
              {errorState && errorState.message && (
                <span className="text font-semibold text-red-600 text-center">
                  {errorState.message}
                </span>
              )}
            </div>

            <h4 className="font-semibold mt-4 mb-2 text-[#e4e4e4]">Members</h4>
            {removeErrorState && removeErrorState.message && (
              <span className="text mx-auto font-semibold text-red-600 text-center">
                {removeErrorState.message}
              </span>
            )}
            {groupState.members.length !== 0 ? (
              <ul className="px-3">
                {groupState.members.map((member) => (
                  <li
                    key={member.userId}
                    className="flex justify-between px-3 items-center p-2 bg-[#2b2b2b] rounded-md"
                  >
                    <span>{member.username}</span>
                    <button
                      onClick={() => removeMember(member.userId)}
                      className="text-red-400 hover:text-red-500 transition-all"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Start Inviting others </p>
            )}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default GroupDialog;
