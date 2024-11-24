import { Dialog, DialogPanel } from "@headlessui/react";
import React, { useState } from "react";
import moment, { Moment } from "moment";
import DateSelector from "../../surveys/DateSelector";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
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
  console.log(currentSurvey);
  const [surveyDetails, setSurveyDetails] = useState({
    startTime: moment(currentSurvey?.startTime),
    endTime: moment(currentSurvey?.endTime),
    questionsPerPage: currentSurvey?.questionsPerPage ?? 5,
    duration: currentSurvey?.duration ?? 5,
    gradesVisibility: currentSurvey?.gradesVisibility ?? "Hidden",
  });

  const handleGradesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSurveyDetails((prev) => ({
      ...prev,
      gradesVisibility: event.target.value,
    }));
  };
  const handleStartTimeChange = (newStartTime: Moment) => {
    setSurveyDetails((prev) => ({
      ...prev,
      startTime: newStartTime,
    }));
  };

  const handleEndTimeChange = (newEndTime: Moment) => {
    setSurveyDetails((prev) => ({
      ...prev,
      endTime: newEndTime,
    }));
  };
  const handleQuestionsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSurveyDetails((prev) => ({
      ...prev,
      questionsPerPage: Number(event.target.value),
    }));
  };

  const handleDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSurveyDetails((prev) => ({
      ...prev,
      duration: Number(event.target.value),
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formattedStartTime = {
      year: surveyDetails.startTime.year().toString(),
      month: surveyDetails.startTime.month() + 1,
      day: surveyDetails.startTime.date(),
      hours: surveyDetails.startTime.hour() % 12 || 12,
      minutes: surveyDetails.startTime.minute(),
      period: surveyDetails.startTime.hour() >= 12 ? "PM" : "AM",
    };

    const formattedEndTime = {
      year: surveyDetails.endTime.year().toString(),
      month: surveyDetails.endTime.month() + 1,
      day: surveyDetails.endTime.date(),
      hours: surveyDetails.endTime.hour() % 12 || 12,
      minutes: surveyDetails.endTime.minute(),
      period: surveyDetails.endTime.hour() >= 12 ? "PM" : "AM",
    };
    const startString = `${formattedStartTime.year}-${formattedStartTime.month}-${formattedStartTime.day} ${formattedStartTime.hours}:${formattedStartTime.minutes} ${formattedStartTime.period}`;
    const endString = `${formattedEndTime.year}-${formattedEndTime.month}-${formattedEndTime.day} ${formattedEndTime.hours}:${formattedEndTime.minutes} ${formattedEndTime.period}`;

    console.log(startString, endString);

    const startDate = new Date(startString);
    const endDate = new Date(endString);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      alert("Invalid date or time format.");
      return;
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50 font-mono">
      <div
        className="fixed inset-0 bg-black bg-opacity-30"
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-scroll">
        <DialogPanel className="bg-base-100 rounded-md py-5 w-[350px]  ">
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
                  value={surveyDetails.questionsPerPage}
                  onChange={handleQuestionsPerPageChange}
                />
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
                  value={surveyDetails.duration}
                  onChange={handleDurationChange}
                />
              </div>
            </div>

            <div className="">
              <h1 className="text-white font-semibold">
                Select Start and End Time
              </h1>

              <div className="mb-4 ml-2">
                <h2 className="text-white font-semibold">Start Time</h2>
                <DateSelector
                  selectedDate={surveyDetails.startTime}
                  onDateChange={handleStartTimeChange}
                />
              </div>

              <div className="mb-4 ml-2">
                <h2 className="text-white font-semibold">End Time</h2>
                <DateSelector
                  selectedDate={surveyDetails.endTime}
                  onDateChange={handleEndTimeChange}
                />
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
                      value="Hidden"
                      checked={surveyDetails.gradesVisibility === "hidden"}
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
                      value="Visible"
                      checked={surveyDetails.gradesVisibility === "visible"}
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
                        surveyDetails.gradesVisibility ===
                        "visibleAfterSurveyCloses"
                      }
                      onChange={handleGradesChange}
                      className="mr-2 w-max"
                    />
                    Show After Survey Closes
                  </label>
                </div>
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
                type="submit"
                className="bg-blue-500 text-white p-2 rounded-md"
              >
                Save
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default SurveySettingsDialog;
