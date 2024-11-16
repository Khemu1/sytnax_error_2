"use client";

import { setWorkspaces } from "@/store/slices/survey/workspaceSlice";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Workspaces from "@/components/survey_builder/workspaces/Workspaces";
import Surveys from "@/components/survey_builder/surveys/Surveys";
import CreateWorkspaceDialog from "@/components/survey_builder/Dialog/workspaces/CreateWorkspaceDialog";
import UpdateWorkspaceTitleDialog from "@/components/survey_builder/Dialog/workspaces/UpdateWorkspaceTitleDialog";
import SearchDialog from "@/components/survey_builder/Dialog/workspaces/searchDialog";
import { useDispatch, useSelector } from "react-redux";
import {
  useDeleteWorkspace,
  useGetWorkspaces,
} from "@/hooks/survey_builder/workspace";
import { RootState } from "@/store/store";

const SurveyBuilder = () => {
  const { handleGetWorkspaces, loading, error, data } = useGetWorkspaces();
  const dispatch = useDispatch();

  const currentWorkspace = useSelector(
    (state: RootState) => state.currentWorkspace.currentWorkspace
  );
  const [menuOpen, setMenuOpen] = useState(false);

  const workspaceChangeMenuRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const [isUpdateWorkspaceTitleOpen, setIsUpdateWorkspaceTitleOpen] =
    useState(false);

  const [isWorkspaceSearchOpen, setIsWorkspaceSearchOpen] = useState(false);

  const [isCreateWorkspaceOpen, setIsCreateWorkspaceOpen] = useState(false);

  const { handleDeleteWorkspace } = useDeleteWorkspace();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        workspaceChangeMenuRef.current &&
        !workspaceChangeMenuRef.current.contains(event.target as Node) &&
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

  useEffect(() => {
    handleGetWorkspaces();
  }, [handleGetWorkspaces]);

  useEffect(() => {
    if (Array.isArray(data) && data.length > 0) {
      dispatch(setWorkspaces(data));
    }
  }, [data, dispatch]);

  if (loading) {
    // todo: use loading animation
    return <div>Loading...</div>;
  }

  if (error) {
    // todo: redirect to error page
    return <div>error</div>;
  }

  return (
    <div className="home">
      <aside>
        <div className="w-full flex items-end justify-between font-semibold mb-5">
          <p className="p-1">Workspaces</p>
          <div className="flex items-center gap-5">
            <button
              className="p-1 cursor-pointer transition-all hover:bg-[#6272a4] rounded-md"
              aria-label="Add Workspace"
              onClick={() => setIsCreateWorkspaceOpen(true)}
            >
              <Image
                src="/assets/icons/plus.svg"
                alt="Add Workspace"
                className="w-[20px]"
                width={20}
                height={20}
              />
            </button>
            <button
              onClick={() => setIsWorkspaceSearchOpen(true)}
              className="p-1 cursor-pointer transition-all hover:bg-[#6272a4] rounded-md"
              aria-label="Search Workspaces"
            >
              <Image
                src="/assets/icons/search.svg"
                alt="Search Workspaces"
                width={20}
                height={20}
              />
            </button>
          </div>
        </div>
        <Workspaces />
      </aside>

      <section>
        <div className="flex flex-col gap-2">
          <div className="flex items-end gap-5 mb-5 relative w-max">
            <p className="font-extrabold text-gray-300 text-xl max-w-[250px] text-ellipsis overflow-hidden">
              {currentWorkspace?.title}
            </p>
            <button
              className="p-[.5px] bg-[#292c2e] cursor-pointer transition-all hover:bg-[#6272a4] rounded-md "
              onClick={toggleMenu}
              ref={toggleButtonRef}
            >
              <Image
                src="/assets/icons/dots.svg"
                alt="More Options"
                className="w-[20px]"
                width={20}
                height={20}
              />
            </button>
            {menuOpen && (
              <div
                className="flex w-[150px] flex-col text-left right-0 top-[30px] text-sm absolute font-semibold bg-[#0e0e0e] p-2 rounded-md shadow-md z-10"
                ref={workspaceChangeMenuRef}
              >
                <span
                  className="survey_card_buttons"
                  onClick={() => setIsUpdateWorkspaceTitleOpen(true)}
                >
                  Rename Workspace
                </span>
                <span
                  className="survey_card_buttons text-red-600"
                  onClick={() => {
                    handleDeleteWorkspace({
                      workspaceId: currentWorkspace!.id,
                    });
                    setMenuOpen(false);
                  }}
                >
                  Delete
                </span>
              </div>
            )}
          </div>
        </div>
        <Surveys />
      </section>

      <CreateWorkspaceDialog
        isOpen={isCreateWorkspaceOpen}
        onClose={() => setIsCreateWorkspaceOpen(false)}
      />
      <UpdateWorkspaceTitleDialog
        isOpen={isUpdateWorkspaceTitleOpen}
        onClose={() => setIsUpdateWorkspaceTitleOpen(false)}
      />
      <SearchDialog
        isOpen={isWorkspaceSearchOpen}
        onClose={() => setIsWorkspaceSearchOpen(false)}
      />
    </div>
  );
};

export default SurveyBuilder;
