import { clearCurrentSurvey } from "@/store/slices/survey/currentSurveySlice";
import { setCurrentWorkspace } from "@/store/slices/survey/currentWorkspaceSlice";
import { setSurveys } from "@/store/slices/survey/surveySlice";
import { RootState } from "@/store/store";
import { retrunSearchData } from "@/utils/survey_builder/workspace";
import { Dialog, DialogPanel } from "@headlessui/react";
import Link from "next/link";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchDialog: React.FC<SearchDialogProps> = ({ isOpen, onClose }) => {
  const allWorkspaces = useSelector(
    (state: RootState) => state.workspace.workspaces
  );

  const dispatch = useDispatch();

  const [title, setTitle] = useState("");

  const { workspaces, surveys } = title
    ? retrunSearchData(allWorkspaces, title)
    : { workspaces: [], surveys: [] };

  const setWorksapceAsCurrent = (title: string) => {
    const workspace = allWorkspaces.find(
      (workspace) => workspace.name === title
    );
    const surveys = workspace!.surveys || [];
    dispatch(setCurrentWorkspace(workspace!));
    dispatch(setSurveys(surveys));
    dispatch(clearCurrentSurvey());
    setTitle("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div
        className="fixed inset-0 bg-black bg-opacity-30"
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          transition
          className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
        >
          <div>
            <form className="">
              <div className="flex gap-5 border-b border-b-gray-500 p-[2rem]">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Search"
                  className="w-full bg-[#2a2a2a] text-white border-none outline-none p-2 rounded-md"
                />
                <button
                  className="bg-red-700 py-2 px-4 rounded text-white"
                  type="button"
                  onClick={() => {
                    onClose();
                    setTitle("");
                  }}
                >
                  Cancel
                </button>
              </div>

              {title && (
                <div className="mt-4  overflow-y-auto px-4 h-full">
                  <div className="flex flex-col border-b border-b-gray-500 pb-3 h-full">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Workspaces
                    </h3>
                    {workspaces.length ? (
                      workspaces.map((workspace, index) => (
                        <button
                          type="button"
                          key={index}
                          className="flex  p-2 cursor-pointer hover:bg-gray-700 rounded-md"
                          value={workspace}
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            setWorksapceAsCurrent(e.currentTarget.value);
                          }}
                        >
                          {workspace}
                        </button>
                      ))
                    ) : (
                      <div className="text-sm text-gray-400">
                        No workspaces Found
                      </div>
                    )}
                  </div>

                  <div className="mt-4 h-full">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Surveys
                    </h3>
                    {surveys.length ? (
                      surveys.map((survey, index) => (
                        <Link
                          href={`/survey/${survey.workspace}/${survey.id}/build`}
                          key={index}
                          className="p-2 cursor-pointer hover:bg-gray-700 rounded-md"
                          onClick={() => setTitle(survey.name)}
                        >
                          {survey.name}
                        </Link>
                      ))
                    ) : (
                      <div className="text-sm text-gray-400">
                        No Surveys Found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </form>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default SearchDialog;
