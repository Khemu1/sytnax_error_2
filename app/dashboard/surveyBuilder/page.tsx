"use client";

import "../../../styles/surveyBuilder.css";

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
import GroupDialog from "@/components/survey_builder/Dialog/workspaces/groupDialog";
import { logout } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import { setGroup } from "@/store/slices/survey/userGroup";
import GlobalError from "@/app/global-error";

const SurveyBuilder = () => {
  const [isMobileAsideOpen, setIsMobileAsideOpen] = useState(false);
  const { workspaces: data, isLoading, isError,errorState:apiError } = useGetWorkspaces();
  const dispatch = useDispatch();
  const routeTo = useRouter();

  const { currentWorkspace, workspaces, authState } = useSelector(
    (state: RootState) => ({
      currentWorkspace: state.currentWorkspace.currentWorkspace,
      workspaces: state.workspace.workspaces,
      authState: state.auth,
    })
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

  const [isGroupProfileOpen, setIsGroupProfileOpen] = useState(false);
  const { handleDeleteWorkspace } = useDeleteWorkspace();

  const deleteWorkspace = async (workspaceId: string) => {
    try {
      if (!workspaceId) {
        return;
      }
      await handleDeleteWorkspace({ workspaceId });
      console.log("sending");
      setMenuOpen(false);
      // todo : add the toast later
      // setToast({
      //   message: `Workspace deleted successfully.`,
      //   type: "success",
      // });
    } catch (error) {
      console.error("Error deleting workspace:", error);
    }
  };

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
    if (
      data &&
      Array.isArray(data.allWorkspaces) &&
      data.allWorkspaces.length > 0
    ) {
      dispatch(setWorkspaces(data.allWorkspaces));
    }
    if (data && data.group) {
      console.log("group", data.group);
      dispatch(setGroup(data.group));
    }
  }, [data, dispatch]);

  useEffect(() => {
    const localStorageAuth = localStorage.getItem("userData");
    if (localStorageAuth) {
      const { role } = JSON.parse(localStorageAuth);

      if (!authState.isAuthenticated) {
        dispatch(logout());
        routeTo.push("/authportal");
      }
      if (role !== 1 && role !== 2) {
        routeTo.push("/authportal");
      }
    } else {
      routeTo.push("/authportal");
    }
  }, [authState.isAuthenticated, dispatch, routeTo]);

  if (isLoading) {
    return (
      <div className="flex w-full h-full my-auto justify-center items-center">
        <span className="loading loading-infinity w-[150px]" />
      </div>
    );
  }

  if (isError && apiError?.message) {
    return <GlobalError />;
  }

  return (
    <div className="home">
      <div className="ml-2 mt-5 lg:hidden">
        <button
          className="flex left-4 top-3 w-[32px] h-[32px]"
          onClick={() => setIsMobileAsideOpen(true)}
        >
          <Image
            alt="sidebar"
            src={"/assets/icons/sidebar.svg"}
            width={32}
            height={32}
          />
        </button>
      </div>
      <aside>
        <div className="w-full flex items-end justify-between font-semibold mb-5">
          <p className="p-1">Workspaces</p>
          <div className="flex flex-wrap items-center gap-5">
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
            {workspaces.length > 1 && (
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
            )}
          </div>
        </div>
        <Workspaces />
      </aside>

      {/* mobile aside */}

      <aside
        className={`bg-base-100 aside_mobile ${
          !isMobileAsideOpen ? "aside_mobile_closed" : ""
        }`}
      >
        <button
          className="text-white flex justify-center bg-blue-600 mb-5 h-max"
          onClick={() => setIsMobileAsideOpen(false)}
        >
          Close SideBar
        </button>{" "}
        <div className="w-full flex items-end justify-between font-semibold mb-5">
          <p className="p-1">Workspaces</p>
          <div className="flex flex-wrap items-center gap-5">
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
            {workspaces.length > 1 && (
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
            )}
          </div>
        </div>
        <Workspaces />
      </aside>

      <section>
        <div className="flex flex-col gap-2">
          {currentWorkspace && (
            <div className="flex items-end gap-5 mb-5 relative w-max">
              <p className="font-extrabold text-gray-300 text-xl max-w-[250px] text-ellipsis overflow-hidden">
                {currentWorkspace?.name}
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
                      deleteWorkspace(currentWorkspace?.id);
                    }}
                  >
                    Delete
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
        {currentWorkspace ? (
          <Surveys />
        ) : (
          <div className="text-center font-semibold text-2xl">
            Create a workspace to start
          </div>
        )}
      </section>
      <button
        className="flex items-start absolute right-0"
        onClick={() => setIsGroupProfileOpen(true)}
      >
        <Image
          src={"/assets/icons/group.svg"}
          alt="Group"
          width={64}
          height={64}
        />
      </button>

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
      <GroupDialog
        isOpen={isGroupProfileOpen}
        onClose={() => setIsGroupProfileOpen(false)}
      />
    </div>
  );
};

export default SurveyBuilder;
