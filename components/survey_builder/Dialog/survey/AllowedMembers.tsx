import { useState, useEffect, useCallback, Fragment } from "react";
import Image from "next/image";
import Toast from "@/components/skeletons/Toast";
import { Dialog, DialogPanel, Transition } from "@headlessui/react";
import {
  useAddMembersToSurvey,
  useDeleteAllMembers,
  useDeleteMembersFromSurvey,
  useGetSurveyParticipants,
  useResetAllMembersAttempts,
} from "@/hooks/survey_builder/survey";
import { useDispatch, useSelector } from "react-redux";
import {
  addMembersToSurveyFirstTime,
  clearCurrentSurvey,
} from "@/store/slices/survey/surveySlice";
import { RootState } from "@/store/store";

interface AllowedMembersDialogProps {
  isOpen: boolean;
  onClose: () => void;
  surveyId: string;
  workspaceId: string;
}

const AllowedMembersDialog: React.FC<AllowedMembersDialogProps> = ({
  isOpen,
  onClose,
  surveyId,
  workspaceId,
}) => {
  const dispatch = useDispatch();
  const { participants, isLoading, isError, isFetched, refetch } =
    useGetSurveyParticipants(workspaceId, surveyId);
  const currentSurvey = useSelector(
    (state: RootState) => state.survey.currentSurvey
  );

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const {
    handleAddMembersToSurvey,
    isError: isAddMembersError,
    isSuccess: isAddMembersSuccess,
    isPending: isAddMembersPending,
    errorState: addMembersError,
  } = useAddMembersToSurvey();

  const {
    handleDeleteMembersFromSurvey,
    isPending: isRemoveMemberPending,
    isError: isRemoveMemberError,
    isSuccess: isRemoveMemberSuccess,
    errorState: deleteMemebersError,
  } = useDeleteMembersFromSurvey();

  const {
    handleDeleteAllMembers,
    isPending: isDeleteAllMembersPending,
    errorState: deleteAllMembersError,
  } = useDeleteAllMembers();

  const {
    handleResetAllMembersAttempts,
    isPending: isResetAttemptsPending,
    isError: isResetAttemptsError,
    errorState: resetMembersError,
  } = useResetAllMembersAttempts();

  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [text, setText] = useState<string>("");

  const handleToggle = (member: string) => {
    setSelectedMembers((prevSelectedMembers) =>
      prevSelectedMembers.includes(member)
        ? prevSelectedMembers.filter((m) => m !== member)
        : [...prevSelectedMembers, member]
    );
  };

  const handleClose = useCallback(() => {
    setText("");
    onClose();
    dispatch(clearCurrentSurvey());
  }, [onClose]);
  useEffect(() => {
    if (isAddMembersSuccess || isRemoveMemberSuccess) {
      setToast({
        message: "Members updated successfully",
        type: "success",
      });
    } else if (isAddMembersError || isRemoveMemberError) {
      setToast({
        message: "Something went wrong, please try again",
        type: "error",
      });
    }
  }, [
    isAddMembersSuccess,
    isRemoveMemberSuccess,
    isAddMembersError,
    isRemoveMemberError,
  ]);
  useEffect(() => {
    if (isOpen) {
      refetch(); // Trigger refetch when dialog is opened
    }
  }, [isOpen, refetch]);

  useEffect(() => {
    if (participants) {
      console.log(participants);
      dispatch(
        addMembersToSurveyFirstTime({ members: participants, surveyId })
      );
    }
  }, [dispatch, participants, surveyId]);

  const handleAddMembers = () => {
    if (text.trim()) {
      const processedIds = text
        .split(/\s+/)
        .map((id) => id.trim())
        .filter((id) => id.length === 7);

      handleAddMembersToSurvey({
        surveyId,
        workspaceId,
        members: processedIds,
      });
      setText("");
    }
  };

  const handleRemoveSelectedMembers = () => {
    handleDeleteMembersFromSurvey({
      surveyId,
      workspaceId,
      members: selectedMembers,
    });
  };

  const handleRemoveAllMembers = () => {
    handleDeleteAllMembers({ surveyId, workspaceId });
  };

  const handleResetAllAttempts = () => {
    handleResetAllMembersAttempts({ workspaceId, surveyId });
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        className="relative z-50"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <div
          className="fixed inset-0 bg-black bg-opacity-30"
          aria-hidden="true"
        />
        <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-scroll">
          <DialogPanel className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl h-max overflow-x-hidden  ">
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
              {isLoading || !isFetched ? (
                <span className="flex items-center justify-center mx-auto loading loading-spinner loading-lg"></span>
              ) : isError ? (
                <p className="text-red-600 text-center font-semibold">
                  Failed to load participants
                </p>
              ) : (
                <>
                  <h3
                    id="dialog-title"
                    className="text-2xl font-bold mb-2 text-[#e4e4e4]"
                  >
                    Allowed Members
                  </h3>
                  <span
                    id="dialog-description"
                    className="text-sm text-gray-600 font-semibold"
                  >
                    Here you can add or remove participants to/from your survey
                  </span>
                  <div className="flex flex-col items-center gap-1 overflow-hidden">
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Enter user IDs (space or newline separated)"
                      rows={4}
                      className="w-full px-4 py-2 bg-[#2b2b2b] text-[#d1d1d1] h-[152px] overflow-y-scroll resize-none rounded-md border border-[#3d3d3d] focus:outline-none focus:border-[#4b6ef5] transition-all"
                    />
                  </div>

                  <div className="flex flex-wrap gap-3 justify-center mt-4 font-semibold">
                    <button
                      className="px-3 py-2 bg-green-700 hover:bg-green-800 text-sm rounded-md transition-all basis-[150px]"
                      onClick={handleAddMembers}
                      disabled={isAddMembersPending}
                    >
                      {isAddMembersPending ? (
                        <span className="flex items-center justify-center mx-auto loading loading-spinner loading-xs"></span>
                      ) : (
                        "Add Members"
                      )}
                    </button>
                    <button
                      className="px-3 py-2 bg-orange-700 hover:bg-orange-800 text-sm rounded-md transition-all basis-[150px]"
                      onClick={handleRemoveSelectedMembers}
                      disabled={isRemoveMemberPending}
                    >
                      {isRemoveMemberPending ? (
                        <span className="flex items-center justify-center mx-auto loading loading-spinner loading-xs"></span>
                      ) : (
                        "Remove Members"
                      )}
                    </button>
                  </div>

                  <h4 className="font-semibold mt-4 mb-2 text-[#e4e4e4]">
                    Members
                  </h4>
                  {!isLoading &&
                  currentSurvey &&
                  currentSurvey.participants &&
                  currentSurvey.participants.length !== 0 ? (
                    <ul className="flex flex-col gap-4 px-3 overflow-y-scroll h-[200px] py-2">
                      {currentSurvey.participants.map((member) => (
                        <li
                          key={member.id}
                          className={`flex justify-between px-3 items-center p-2 bg-base-100 rounded-md cursor-pointer ${
                            selectedMembers.includes(member.id)
                              ? "bg-blue-800"
                              : ""
                          }`}
                          onClick={() => handleToggle(member.id)}
                        >
                          <span className="block text-ellipsis overflow-hidden">
                            {member.studentId}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Start Inviting others</p>
                  )}

                  <div>
                    {isAddMembersError && addMembersError?.message && (
                      <p className="text-red-600 text-center font-semibold">
                        Add Members Error: {addMembersError?.message}
                      </p>
                    )}

                    {isRemoveMemberError && deleteMemebersError?.message && (
                      <p className="text-red-600 text-center font-semibold">
                        Remove Members Error: {deleteMemebersError?.message}
                      </p>
                    )}

                    {deleteAllMembersError?.message && (
                      <p className="text-red-600 text-center font-semibold">
                        Delete All Members Error:{" "}
                        {deleteAllMembersError?.message}
                      </p>
                    )}

                    {isResetAttemptsError && resetMembersError?.message && (
                      <p className="text-red-600 text-center font-semibold">
                        Reset Attempts Error: {resetMembersError?.message}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between flex-wrap w-full mt-6 font-semibold">
                    <button
                      className="px-3 py-2 bg-red-700 hover:bg-red-800 text-sm rounded-md transition-all basis-[170px]"
                      onClick={handleResetAllAttempts}
                      disabled={isResetAttemptsPending}
                    >
                      {isResetAttemptsPending ? (
                        <span className="flex items-center justify-center mx-auto loading loading-spinner loading-xs"></span>
                      ) : (
                        "Reset All Attempts"
                      )}
                    </button>
                    <button
                      className="px-3 py-2 bg-red-700 hover:bg-red-800 text-sm rounded-md transition-all basis-[170px]"
                      onClick={handleRemoveAllMembers}
                      disabled={isDeleteAllMembersPending}
                    >
                      {isDeleteAllMembersPending ? (
                        <span className="flex items-center justify-center mx-auto loading loading-spinner loading-xs"></span>
                      ) : (
                        "Remove All Members"
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </DialogPanel>
          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
              duration={1500}
            />
          )}
        </div>
      </Dialog>
    </Transition>
  );
};

export default AllowedMembersDialog;
