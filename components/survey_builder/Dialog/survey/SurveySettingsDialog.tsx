import { Dialog, DialogPanel } from "@headlessui/react";
import React, { useState } from "react";

interface SurveySettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const SurveySettingsDialog: React.FC<SurveySettingsProps> = ({
  isOpen,
  onClose,
}) => {
  const [startTime, setStartTime] = useState({
    month: "",
    day: "",
    hours: "",
    minutes: "",
  });
  const [endTime, setEndTime] = useState({
    month: "",
    day: "",
    hours: "",
    minutes: "",
  });
  const [questionsPerPage, setQuestionsPerPage] = useState(5);
  const [duration, setDuration] = useState(5);
  const [gradesVisibility, setGradesVisibility] = useState<string>("Visible");

  const handleGradesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGradesVisibility(event.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fullFormatRegex =
      /^\d{1,2}-\d{1,2}-\d{1,2}-\d{1,2}-to-\d{1,2}-\d{1,2}-\d{1,2}-\d{1,2}$/;
    const start = `${startTime.month}-${startTime.day}-${startTime.hours}-${startTime.minutes}`;
    const end = `${endTime.month}-${endTime.day}-${endTime.hours}-${endTime.minutes}`;
    const fullRange = `${start}-to-${end}`;

    if (fullFormatRegex.test(fullRange)) {
      alert("Time range is valid!");
    } else {
      alert("Invalid time range format.");
    }
    // onClose();
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    timeType: "start" | "end"
  ) => {
    const { name, value } = event.target;
    const singleDigitRegex = /^\d{1}$/;

    if (value === "" || singleDigitRegex.test(value)) {
      if (timeType === "start") {
        setStartTime((prev) => ({ ...prev, [name]: value }));
      } else {
        setEndTime((prev) => ({ ...prev, [name]: value }));
      }
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50 font-mono">
      <div
        className="fixed inset-0 bg-black bg-opacity-30"
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="bg-base-100 rounded-md py-5 w-[300px]">
          <h2 className="text-center font-semibold text-white text-xl mb-4">
            Survey{"'"}s Settings
          </h2>
          <form
            className="space-y-4 px-4"
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmit(e)}
          >
            <div className="flex flex-col gap-4 pb-6 border-b">
              <div className="flex flex-col flex-wrap">
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
                  className="w-full bg-[#2a2a2a] text-white border-none outline-none p-2 rounded-md"
                  placeholder="Enter Questions Per Page"
                  min={1}
                  max={10}
                  value={questionsPerPage}
                  onChange={(e) => setQuestionsPerPage(Number(e.target.value))}
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
                  className="w-full bg-[#2a2a2a] text-white border-none outline-none p-2 rounded-md"
                  min={5}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 pb-4 border-b">
              <p className="font-semibold text-white mb-2">
                When the survey should be active
              </p>
              <div className="flex flex-col gap-4 pb-4">
                <div className="flex flex-col flex-wrap">
                  <span className="block text-sm text-white mb-3 font-semibold">
                    From
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    <input
                      type="text"
                      name="month"
                      placeholder="Month"
                      value={startTime.month}
                      onChange={(e) => handleInputChange(e, "start")}
                      className="bg-[#2a2a2a] text-white p-2 rounded-md text-sm"
                    />
                    <input
                      type="text"
                      name="day"
                      placeholder="Day"
                      value={startTime.day}
                      onChange={(e) => handleInputChange(e, "start")}
                      className="bg-[#2a2a2a] text-white p-2 rounded-md text-sm"
                    />
                    <input
                      type="text"
                      name="hours"
                      placeholder="Hours"
                      value={startTime.hours}
                      onChange={(e) => handleInputChange(e, "start")}
                      className="bg-[#2a2a2a] text-white p-2 rounded-md text-sm"
                    />
                    <input
                      type="text"
                      name="minutes"
                      placeholder="Minutes"
                      value={startTime.minutes}
                      onChange={(e) => handleInputChange(e, "start")}
                      className="bg-[#2a2a2a] text-white p-2 rounded-md text-sm"
                    />
                  </div>
                </div>
                <div>
                  <span className="block text-sm text-white mb-3 font-semibold">
                    To
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    <input
                      type="text"
                      name="month"
                      placeholder="Month"
                      value={endTime.month}
                      onChange={(e) => handleInputChange(e, "end")}
                      className="bg-[#2a2a2a] text-white p-2 rounded-md text-sm"
                    />
                    <input
                      type="text"
                      name="day"
                      placeholder="Day"
                      value={endTime.day}
                      onChange={(e) => handleInputChange(e, "end")}
                      className="bg-[#2a2a2a] text-white p-2 rounded-md text-sm"
                    />
                    <input
                      type="text"
                      name="hours"
                      placeholder="Hours"
                      value={endTime.hours}
                      onChange={(e) => handleInputChange(e, "end")}
                      className="bg-[#2a2a2a] text-white p-2 rounded-md text-sm"
                    />
                    <input
                      type="text"
                      name="minutes"
                      placeholder="Minutes"
                      value={endTime.minutes}
                      onChange={(e) => handleInputChange(e, "end")}
                      className="bg-[#2a2a2a] text-white p-2 rounded-md text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <span className="font-semibold text-white mb-2 block">
                Grades Visibility
              </span>
              <div className="space-y-2">
                <div className="flex justify-start gap-4">
                  <input
                    type="radio"
                    id="visible"
                    name="grades"
                    value="Visible"
                    checked={gradesVisibility === "Visible"}
                    onChange={handleGradesChange}
                    className="w-max"
                  />
                  <label htmlFor="visible" className="text-white">
                    Visible
                  </label>
                </div>
                <div className="flex justify-start gap-4">
                  <input
                    type="radio"
                    id="hidden"
                    name="grades"
                    value="Hidden"
                    checked={gradesVisibility === "Hidden"}
                    onChange={handleGradesChange}
                    className="w-max"
                  />
                  <label htmlFor="hidden" className="text-white">
                    Hidden
                  </label>
                </div>
                <div className="flex justify-start gap-4">
                  <input
                    type="radio"
                    id="visibleAfterClose"
                    name="grades"
                    value="Visible after survey closes"
                    checked={gradesVisibility === "Visible after survey closes"}
                    onChange={handleGradesChange}
                    className="w-max"
                  />
                  <label htmlFor="visibleAfterClose" className="text-white">
                    Visible after survey closes
                  </label>
                </div>
              </div>
            </div>
            <div className="mt-4 flex  justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Cancle
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
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
