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
  useResetMembersAttempts,
} from "@/hooks/survey_builder/survey";
import { useDispatch, useSelector } from "react-redux";
import {
  addMembersToSurveyFirstTime,
  clearCurrentSurvey,
} from "@/store/slices/survey/surveySlice";
import { RootState } from "@/store/store";
import {
  addNembersSchema,
  removeOrUpdateMembersSchema,
} from "@/utils/validations/survey";
import { validateWithSchema } from "@/utils/validations/validations";

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
  const {
    participants,
    isLoading,
    isError,

    isFetching,
  } = useGetSurveyParticipants(workspaceId, surveyId);
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
    handleResetMembersAttempts,
    isPending: isResetAttemptsPending,
    isError: isResetAttemptsError,
    errorState: resetMembersError,
    isSuccess: isResetMembersSuccess,
    isError: isResetMembersError,
  } = useResetMembersAttempts();

  const {
    handleDeleteMembersFromSurvey,
    isPending: isRemoveMemberPending,
    isError: isDeleteMembersError,
    isSuccess: isRemoveMemberSuccess,
    errorState: deleteMemebersError,
    isSuccess: isDeleteMembersSuccess,
  } = useDeleteMembersFromSurvey();

  const {
    handleDeleteAllMembers,
    isPending: isDeleteAllMembersPending,
    errorState: deleteAllMembersError,
    isSuccess: isDeleteAllMembersSuccess,
    isError: isDeleteAllMembersError,
  } = useDeleteAllMembers();

  const {
    handleResetAllMembersAttempts,
    isPending: isResetAllAttemptsPending,
    isError: isResetAllAttemptsError,
    errorState: resetAllMembersError,
    isSuccess: isResetAllAttemptsSuccess,
  } = useResetAllMembersAttempts();

  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [text, setText] = useState<string>("");
  const [validationError, setValidationError] = useState<Record<
    string,
    string
  > | null>(null);

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
    if (isAddMembersSuccess) {
      setToast({
        message: "Members added successfully",
        type: "success",
      });
    } else if (isRemoveMemberSuccess) {
      setToast({
        message: "Member removed successfully",
        type: "success",
      });
    } else if (isResetAllAttemptsSuccess) {
      setToast({
        message: "All attempts reset successfully",
        type: "success",
      });
    } else if (isResetMembersSuccess) {
      setToast({
        message: "Members reset successfully",
        type: "success",
      });
    } else if (isDeleteAllMembersSuccess) {
      setToast({
        message: "All members deleted successfully",
        type: "success",
      });
    } else if (isDeleteMembersSuccess) {
      setToast({
        message: "Members deleted successfully",
        type: "success",
      });
    } else if (isAddMembersError) {
      setToast({
        message: "Error adding members, please try again",
        type: "error",
      });
    } else if (isDeleteMembersError) {
      setToast({
        message: "Error removing member, please try again",
        type: "error",
      });
    } else if (isResetAllAttemptsError) {
      setToast({
        message: "Error resetting all attempts, please try again",
        type: "error",
      });
    } else if (isResetMembersError) {
      setToast({
        message: "Error resetting members, please try again",
        type: "error",
      });
    } else if (isDeleteAllMembersError) {
      setToast({
        message: "Error deleting all members, please try again",
        type: "error",
      });
    }
  }, [
    isAddMembersSuccess,
    isRemoveMemberSuccess,
    isAddMembersError,
    isResetAllAttemptsSuccess,
    isResetMembersSuccess,
    isDeleteAllMembersSuccess,
    isResetAllAttemptsError,
    isResetMembersError,
    isDeleteMembersSuccess,
    isDeleteAllMembersError,
    isDeleteMembersError,
  ]);

  useEffect(() => {
    if (participants) {
      dispatch(
        addMembersToSurveyFirstTime({ members: participants, surveyId })
      );
    }
  }, [dispatch, participants, surveyId]);

  const handleAddMembers = () => {
    setValidationError(null);
    try {
      if (text.trim()) {
        const processedIds = text
          .split(/\s+/)
          .map((id) => id.trim())
          .filter((id) => id.length === 7);
        addNembersSchema().parse({ members: processedIds });
        handleAddMembersToSurvey({
          surveyId,
          workspaceId,
          members: processedIds,
        });
        setText("");
      }
    } catch (error) {
      setValidationError(validateWithSchema(error));
      console.error(validationError);
    }
  };

  const handleRemoveSelectedMembers = () => {
    setValidationError(null);
    setSelectedMembers([]);

    try {
      removeOrUpdateMembersSchema().parse({ members: selectedMembers });
      handleDeleteMembersFromSurvey({
        surveyId,
        workspaceId,
        members: selectedMembers,
      });
      setSelectedMembers([]);
    } catch (error) {
      setValidationError(validateWithSchema(error));
      console.error(validationError);
    }
  };

  const handleRemoveAllMembers = () => {
    setValidationError(null);

    try {
      setSelectedMembers([]);
      const ids = currentSurvey?.participants.map((member) => member.studentId);

      removeOrUpdateMembersSchema().parse({
        members: ids ?? [],
      });
      handleDeleteAllMembers({ surveyId, workspaceId });
    } catch (error) {
      setValidationError(validateWithSchema(error));
      console.error(validationError);
    }
  };

  const handleResetAllAttempts = () => {
    setValidationError(null);

    try {
      const ids = currentSurvey?.participants.map((member) => member.studentId);

      removeOrUpdateMembersSchema().parse({
        members: ids ?? [],
      });
      handleResetAllMembersAttempts({ workspaceId, surveyId });
    } catch (error) {
      setValidationError(validateWithSchema(error));
      console.error(validationError);
    }
  };
  const handleMembersResetAttempts = () => {
    setValidationError(null);
    try {
      removeOrUpdateMembersSchema().parse({ members: selectedMembers });
      handleResetMembersAttempts({
        surveyId,
        workspaceId,
        members: selectedMembers,
      });
    } catch (error) {
      setValidationError(validateWithSchema(error));
      console.error(validationError);
    }
  };

  if (isFetching || !currentSurvey?.participants) {
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
                <span className="flex items-center justify-center mx-auto loading loading-spinner loading-lg"></span>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      </Transition>
    );
  }
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
              {isError ? (
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
                    <button
                      className="px-3 py-2 bg-orange-700 hover:bg-orange-800 text-sm rounded-md transition-all basis-[150px]"
                      onClick={handleMembersResetAttempts}
                      disabled={isResetAttemptsPending}
                    >
                      {isResetAttemptsPending ? (
                        <span className="flex items-center justify-center mx-auto loading loading-spinner loading-xs"></span>
                      ) : (
                        "Reset Members"
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
                          <span
                            className={`font-semibold ${
                              member.attempts > 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {member.attempts}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Start Inviting others</p>
                  )}

                  <div>
                    {validationError && validationError.members && (
                      <p className="text-red-600 text-center font-semibold">
                        {validationError.members}
                      </p>
                    )}
                    {isAddMembersError && addMembersError?.message && (
                      <p className="text-red-600 text-center font-semibold">
                        Add Members Error: {addMembersError?.message}
                      </p>
                    )}

                    {isDeleteMembersError && deleteMemebersError?.message && (
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

                    {isResetAllAttemptsError &&
                      resetAllMembersError?.message && (
                        <p className="text-red-600 text-center font-semibold">
                          Reset Attempts Error: {resetAllMembersError?.message}
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
                      disabled={isResetAllAttemptsPending}
                    >
                      {isResetAllAttemptsPending ? (
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
