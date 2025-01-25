import {
  useChangeSurveyStatus,
  useDeleteSurvey,
} from "@/hooks/survey_builder/survey";
import { RootState } from "@/store/store";
import { SurveyProps } from "@/types/survey";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import UpdateSurveyTitleDialog from "@/components/survey_builder/Dialog/survey/UpdateSurveyTitleDialog";
import MoveSurveyDialog from "@/components/survey_builder/Dialog/survey/MoveSurveyDialog";
import DuplicateSurveyDialog from "@/components/survey_builder/Dialog/survey/DuplicateSurveyDialog";
import SurveySettingsDialog from "@/components/survey_builder/Dialog/survey/SurveySettingsDialog";
import { getSurveyStatus } from "@/utils";
import { useDispatch } from "react-redux";
import Toast from "@/components/skeletons/Toast";
import AllowedMembersDialog from "../Dialog/survey/AllowedMembers";
import { setCurrentSurvey } from "@/store/slices/survey/surveySlice";
const Survey: React.FC<SurveyProps> = ({ survey, onSelect }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isUpdateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [isMoveDialogOpen, setMoveDialogOpen] = useState(false);
  const [isDuplicateDialogOpen, setDuplicateDialogOpen] = useState(false);
  const [isSettingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [isMembersDialogOpen, setMembersDialogOpen] = useState(false);
  const surveyCardMenuRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const { isActive, startTime, endTime } = getSurveyStatus(
    survey.startTime,
    survey.endTime
  );
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const dispatch = useDispatch();

  const { handleDeleteSurvey, isPending } = useDeleteSurvey();
  const { handleUpdateSurveyStatus, isPending: isPendingStatus } =
    useChangeSurveyStatus();

  const currentWorkspace = useSelector(
    (state: RootState) => state.workspace.currentWorkspace
  );

  const handleOpenDialog = (
    dialogType: "update" | "move" | "duplicate" | "settings" | "participants"
  ) => {
    setMenuOpen(false);
    switch (dialogType) {
      case "update":
        setUpdateDialogOpen(true);
        break;
      case "move":
        setMoveDialogOpen(true);
        break;
      case "duplicate":
        setDuplicateDialogOpen(true);
        break;
      case "settings":
        dispatch(setCurrentSurvey(survey));
        setSettingsDialogOpen(true);
        break;
      case "participants":
        dispatch(setCurrentSurvey(survey));
        setMembersDialogOpen(true);
        break;
    }
  };

  const handleCloseDialogs = () => {
    setUpdateDialogOpen(false);
    setMoveDialogOpen(false);
    setDuplicateDialogOpen(false);
    setSettingsDialogOpen(false);
    setMembersDialogOpen(false);
  };

  const handleDelete = () => {
    handleDeleteSurvey({
      surveyId: survey.id,
      workspaceId: survey.workspaceId,
    });
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        surveyCardMenuRef.current &&
        !surveyCardMenuRef.current.contains(event.target as Node) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="survey">
        <div className="flex sm:flex-row flex-col w-full h-full">
          <Link
            href={`/dashboard/surveyBuilder/build/${currentWorkspace?.id}/${survey.id}`}
            className="flex item sm:h-full pl-2 sm:border-r cursor-pointer sm:border-r-gray-700 sm:w-[60%]  h-[100px] sm:border-b-0  border-b border-b-gray-700"
          >
            <p className="m-auto text-[#859fd1] font-semibold text-ellipsis overflow-hidden px-2 text-nowrap whitespace-nowrap">
              {survey.name}
            </p>
          </Link>

          <div className="flex flex-col justify-start sm:w-[40%] bg-[#1e2a38a1] p-4 gap-3 font-semibold sm:overflow-y-scroll">
            <div className="flex justify-end">
              <button
                ref={toggleButtonRef}
                className="border border-gray-500 rounded-md p-2 hover:bg-gray-700"
                onClick={() => {
                  toggleMenu();
                  onSelect(survey);
                }}
              >
                <Image
                  src="/assets/icons/dots.svg"
                  alt="options"
                  width={27}
                  height={27}
                />
              </button>
            </div>

            {/* Menu Dropdown */}
            {menuOpen && (
              <div
                ref={surveyCardMenuRef}
                className="absolute right-4 top-12 bg-[#0e0e0e] text-sm text-white rounded-md shadow-md p-3 z-10"
              >
                <span
                  className="block py-1 px-3 hover:bg-gray-700 rounded-md cursor-pointer"
                  onClick={() => handleOpenDialog("update")}
                >
                  Rename
                </span>
                <span
                  className="block py-1 px-3 hover:bg-gray-700 rounded-md cursor-pointer"
                  onClick={() => handleOpenDialog("move")}
                >
                  Move
                </span>
                <span
                  className="block py-1 px-3 hover:bg-gray-700 rounded-md cursor-pointer"
                  onClick={() => handleOpenDialog("duplicate")}
                >
                  Duplicate
                </span>
                <button
                  className="block py-1 px-3 text-red-600 hover:bg-gray-700 rounded-md cursor-pointer"
                  onClick={handleDelete}
                  disabled={isPending}
                >
                  {isPending ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            )}

            {/* Survey Details */}
            <div className="flex flex-col">
              {/* Grades Visibility */}
              <div className="text-sm py-2">
                {survey.gradesVisibility === "hidden"
                  ? "Hidden Grades"
                  : survey.gradesVisibility === "visible"
                  ? "Visible Grades"
                  : "Visible Grades After Closing"}
              </div>
              <div className="text-sm py-2">
                Duration: {survey.duration} Mins
              </div>
              {/* Start and End Time */}
              <div className="flex flex-col gap-1">
                {startTime && endTime && (
                  <div className="flex flex-col text-sm gap-2">
                    <div className="flex flex-col gap-1">
                      <strong>Start Time:</strong>
                      <span className="text-[12px]">{startTime}</span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <strong>End Time:</strong>
                      <span className="text-[12px] ">{endTime}</span>
                    </div>
                  </div>
                )}

                <div
                  className={`${
                    isActive ? "text-green-500" : "text-red-600"
                  } py-2 text-base`}
                >
                  {isActive ? "Active" : "Inactive"}
                </div>
                {isActive && (
                  <button
                    disabled={isPendingStatus}
                    className="text-left py-2 text-base text-red-600  "
                    onClick={async () =>
                      await handleUpdateSurveyStatus({
                        surveyId: survey.id,
                        workspaceId: survey.workspaceId,
                      })
                    }
                  >
                    {isPendingStatus ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                      "Deactivate"
                    )}
                  </button>
                )}
              </div>

              <div className="flex justify-between flex-wrap gap-1 items-center">
                <button
                  className="py-2 "
                  onClick={() => handleOpenDialog("settings")}
                >
                  Settings
                </button>
                <button
                  className="py-2 text-start "
                  onClick={() => handleOpenDialog("participants")}
                >
                  Participants
                </button>
                <button
                  className="py-2"
                  onClick={() => {
                    window.navigator.clipboard.writeText(
                      `${
                        process.env.NODE_ENV === "development"
                          ? process.env.NEXT_PUBLIC_DEV_URL
                          : process.env.NEXT_PUBLIC_BASE_URL
                      }/quiz/participate/${survey.id}`
                    );
                    setToast({
                      message: "Link copied to clipboard",
                      type: "success",
                    });
                  }}
                >
                  Share Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isUpdateDialogOpen && (
        <UpdateSurveyTitleDialog
          isOpen={isUpdateDialogOpen}
          onClose={handleCloseDialogs}
        />
      )}
      {isMoveDialogOpen && (
        <MoveSurveyDialog
          isOpen={isMoveDialogOpen}
          onClose={handleCloseDialogs}
        />
      )}
      {isDuplicateDialogOpen && (
        <DuplicateSurveyDialog
          isOpen={isDuplicateDialogOpen}
          onClose={handleCloseDialogs}
        />
      )}
      {isSettingsDialogOpen && (
        <SurveySettingsDialog
          isOpen={isSettingsDialogOpen}
          onClose={handleCloseDialogs}
        />
      )}
      {isMembersDialogOpen && (
        <AllowedMembersDialog
          isOpen={isMembersDialogOpen}
          onClose={handleCloseDialogs}
          surveyId={survey.id}
          workspaceId={survey.workspaceId}
        />
      )}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};

export default Survey;
