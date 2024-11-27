import { Dialog, DialogPanel } from "@headlessui/react";
import React, { useEffect, useState } from "react";
import DateSelector from "../../surveys/DateSelector";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { surveySettingsSchema } from "@/utils/validations/survey";
import { validateWithSchema } from "@/utils/validations/validations";
import { useUpdateSurveySettings } from "@/hooks/survey_builder/survey";
import { SurveySettings } from "@/types/survey";
interface SurveySettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const SurveySettingsDialog: React.FC<SurveySettingsProps> = ({
  isOpen,
  onClose,
}) => {
  const currentSurvey = useSelector(
    (state: RootState) => state.currentSurvey.currentSurvey
  );
  const [surveySettings, setSurveySettings] = useState({
    startTime: currentSurvey?.startTime
      ? new Date(currentSurvey.startTime)
      : null,
    endTime: currentSurvey?.endTime ? new Date(currentSurvey.endTime) : null,
    questionsPerPage: currentSurvey?.questionsPerPage ?? 5,
    duration: currentSurvey?.duration ?? 5,
    gradesVisibility: currentSurvey?.gradesVisibility ?? "hidden",
  });

  const [validationErrors, setValidationErrors] = useState<Record<
    string,
    string
  > | null>(null);

  const {
    errorState: addApiErros,
    handleUpdateSurveySettings,
    isPending,
    isSuccess,
  } = useUpdateSurveySettings();

  const handleGradesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSurveySettings((prev) => ({
      ...prev,
      gradesVisibility: event.target.value as
        | "hidden"
        | "visible"
        | "visibleAfterSurveyCloses",
    }));
  };
  const handleStartTimeChange = (newStartTime: Date | null) => {
    setSurveySettings((prev) => ({
      ...prev,
      startTime: newStartTime,
    }));
  };

  const handleEndTimeChange = (newEndTime: Date | null) => {
    setSurveySettings((prev) => ({
      ...prev,
      endTime: newEndTime,
    }));
  };
  const handleQuestionsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSurveySettings((prev) => ({
      ...prev,
      questionsPerPage: Number(event.target.value),
    }));
  };

  const handleDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSurveySettings((prev) => ({
      ...prev,
      duration: Number(event.target.value),
    }));
  };

  useEffect(() => {
    if (isSuccess) {
      onClose();
    }
  }, [isSuccess]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    try {
      setValidationErrors(null);
      e.preventDefault();

      surveySettingsSchema().parse({ ...surveySettings });

      // Initialize the settings object
      const settings: SurveySettings = {
        questionsPerPage: null,
        duration: null,
        startTime: null,
        endTime: null,
        gradesVisibility: null,
      };

      if (surveySettings.gradesVisibility !== currentSurvey?.gradesVisibility) {
        settings.gradesVisibility = surveySettings.gradesVisibility;
      }

      if (surveySettings.duration !== currentSurvey?.duration) {
        settings.duration = surveySettings.duration;
      }

      if (surveySettings.questionsPerPage !== currentSurvey?.questionsPerPage) {
        settings.questionsPerPage = surveySettings.questionsPerPage;
      }

      if (
        surveySettings.startTime &&
        surveySettings.startTime !== new Date(currentSurvey?.startTime ?? "")
      ) {
        settings.startTime = surveySettings.startTime.toISOString();
      }

      if (
        surveySettings.endTime &&
        surveySettings.endTime !== new Date(currentSurvey?.endTime ?? "")
      ) {
        settings.endTime = surveySettings.endTime.toISOString();
      }

      handleUpdateSurveySettings({
        workspaceId: currentSurvey!.workspaceId,
        surveyId: currentSurvey!.id,
        settings,
      });
    } catch (error) {
      setValidationErrors(validateWithSchema(error));
      console.error(validationErrors);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50 font-mono">
      <div
        className="fixed inset-0 bg-black bg-opacity-30"
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-scroll">
        <DialogPanel
          transition
          className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
        >
          <h2 className="text-center font-semibold text-white text-xl mb-4">
            Survey{"'"}s Settings
          </h2>
          <form className="space-y-4 px-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4 pb-6 border-b">
              <div>
                <label
                  htmlFor="questionsPerPage"
                  className="block font-semibold text-white mb-1"
                >
                  Questions Per Page
                </label>
                <input
                  type="number"
                  id="questionsPerPage"
                  name="questionsPerPage"
                  className="w-full  text-white border-none outline-none p-2 rounded-md"
                  placeholder="Enter Questions Per Page"
                  min={1}
                  max={10}
                  value={surveySettings.questionsPerPage}
                  onChange={handleQuestionsPerPageChange}
                />
                <p className="text-red-500 font-semibold w-[250px] h-[10px]">
                  {validationErrors?.questionsPerPage ??
                    addApiErros?.questionsPerPage ??
                    ""}
                </p>
              </div>
              <div>
                <label
                  htmlFor="duration"
                  className="block font-semibold text-white mb-1"
                >
                  Survey Duration (in minutes)
                </label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  className="w-full  text-white border-none outline-none p-2 rounded-md"
                  min={5}
                  value={surveySettings.duration}
                  onChange={handleDurationChange}
                />
                <p className="text-red-500 font-semibold w-[250px] h-[10px]">
                  {validationErrors?.duration ?? addApiErros?.duration ?? ""}
                </p>
              </div>
            </div>

            <div className="">
              <h1 className="text-white font-semibold">
                Select Start and End Time
              </h1>

              <div className="mb-4 ml-2">
                <h2 className="text-white font-semibold">Start Time</h2>
                <DateSelector
                  selectedDate={surveySettings.startTime}
                  onDateChange={handleStartTimeChange}
                />
                <p className="text-red-500 font-semibold w-[250px] mt-2">
                  {" "}
                  {validationErrors?.startTime ?? addApiErros?.startTime ?? ""}
                </p>
              </div>

              <div className="mb-4 ml-2">
                <h2 className="text-white font-semibold">End Time</h2>
                <DateSelector
                  selectedDate={surveySettings.endTime}
                  onDateChange={handleEndTimeChange}
                />
                <p className="text-red-500 font-semibold w-[250px] mt-2">
                  {validationErrors?.endTime ?? addApiErros?.endTime ?? ""}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 pb-6 border-b">
              <p className="font-semibold text-white mb-2">Grades Visibility</p>
              <div className="flex flex-col gap-4 ml-2">
                <div>
                  <label>
                    <input
                      type="radio"
                      name="gradesVisibility"
                      value="hidden"
                      checked={surveySettings.gradesVisibility === "hidden"}
                      onChange={handleGradesChange}
                      className="mr-2 w-max"
                    />
                    Hidden
                  </label>
                </div>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="gradesVisibility"
                      value="visible"
                      checked={surveySettings.gradesVisibility === "visible"}
                      onChange={handleGradesChange}
                      className="mr-2 w-max"
                    />
                    Visible
                  </label>
                </div>
                <div className="flex">
                  <label>
                    <input
                      type="radio"
                      name="gradesVisibility"
                      value="visibleAfterSurveyCloses"
                      checked={
                        surveySettings.gradesVisibility ===
                        "visibleAfterSurveyCloses"
                      }
                      onChange={handleGradesChange}
                      className="mr-2 w-max"
                    />
                    Show After Survey Closes
                  </label>
                </div>
                <p>
                  {validationErrors?.gradesVisibility ??
                    addApiErros?.gradesVisibility ??
                    ""}
                </p>
              </div>
            </div>

            <div className="flex justify-between  font-semibold text-white">
              <button
                onClick={onClose}
                className="bg-red-700 text-white p-2 rounded-md"
              >
                Close
              </button>
              <button
                disabled={isPending}
                className="flex justify-center items-center bg-blue-600 transition-all py-2 px-4 rounded"
                type="submit"
              >
                {isPending ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default SurveySettingsDialog;
