import {
  useDeleteSurvey,
} from "@/hooks/survey_builder/survey";
import { RootState } from "@/store/store";
import { SurveyProps } from "@/types/survey";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import UpdateSurveyTitleDialog from "../Dialog/survey/UpdateSurveyTitleDialog";
import MoveSurveyDialog from "../Dialog/survey/MoveSurveyDialog";
import DuplicateSurveyDialog from "../Dialog/survey/DuplicateSurveyDialog";

const Survey: React.FC<SurveyProps> = ({ survey, onSelect }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isUpdateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [isMoveDialogOpen, setMoveDialogOpen] = useState(false);
  const [isDuplicateDialogOpen, setDuplicateDialogOpen] = useState(false);
  const surveyCardMenuRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  const { handleDeleteSurvey } = useDeleteSurvey();

  const currentWorkspace = useSelector(
    (state: RootState) => state.currentWorkspace.currentWorkspace
  );

  const handleOpenDialog = (dialogType: "update" | "move" | "duplicate") => {
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
    }
  };

  const handleCloseDialogs = () => {
    setUpdateDialogOpen(false);
    setMoveDialogOpen(false);
    setDuplicateDialogOpen(false);
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
        <div className="flex w-full h-full">
          {/* Survey Name & Link */}
          <Link
            href={`/survey/${currentWorkspace?.id}/${survey.id}/build`}
            className="flex item h-full pl-2 border-r cursor-pointer border-r-gray-500 w-[60%]"
          >
            <p className="m-auto text-[#859fd1] font-semibold text-ellipsis overflow-hidden px-2 text-nowrap whitespace-nowrap">
              {survey.name}
            </p>
          </Link>

          {/* Survey Actions */}
          <div className="flex flex-col justify-end h-full w-[40%] bg-[#1b1b1b] p-2 gap-1">
            <div className="relative">
              <button className="survey_card_buttons">Copy Link</button>
            </div>

            {/* Toggle Menu Button */}
            <button
              ref={toggleButtonRef}
              className="border opacity-100 border-gray-500 w-max h-max rounded-md"
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

            {/* Menu Dropdown */}
            {menuOpen && (
              <div
                ref={surveyCardMenuRef}
                className="flex flex-col text-left right-0 text-sm absolute top-0 bg-[#0e0e0e] p-2 rounded-md shadow-md z-10"
              >
                <span
                  className="survey_card_buttons"
                  onClick={() => handleOpenDialog("update")}
                >
                  Rename
                </span>
                <span
                  className="survey_card_buttons"
                  onClick={() => handleOpenDialog("move")}
                >
                  Move
                </span>
                <span
                  className="survey_card_buttons"
                  onClick={() => handleOpenDialog("duplicate")}
                >
                  Duplicate
                </span>
                <span
                  className="survey_card_buttons text-red-600"
                  onClick={handleDelete}
                >
                  Delete
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dialogs */}
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
    </>
  );
};

export default Survey;
