import React from "react";
import moment, { Moment } from "moment";

interface DateSelectorProps {
  selectedDate: Moment | null;
  onDateChange: (newDate: Moment) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDate,
  onDateChange,
}) => {
  // Check if selectedDate is valid, otherwise fallback to the current date
  const date = selectedDate && selectedDate.isValid() ? selectedDate : moment();
  console.log("Selected Date:", selectedDate);
  console.log("Date used:", date);

  const handleDateChange = (
    type: "year" | "month" | "day" | "hour" | "minute" | "period",
    value: string
  ) => {
    let updatedDate = date.clone();

    if (type === "period") {
      const isPM = value === "PM";
      const currentHour = date.hour();
      updatedDate = updatedDate.hour(
        isPM ? currentHour + 12 : currentHour - 12
      );
    } else {
      updatedDate = updatedDate.set(type, parseInt(value));
    }

    onDateChange(updatedDate); // Pass the updated date to the parent
  };

  return (
    <div>
      <div className="flex gap-2">
        {/* Year Selection */}
        <select
          value={date.year()}
          onChange={(e) => handleDateChange("year", e.target.value)}
          className="text-white p-2 rounded-md text-sm"
        >
          {Array.from({ length: 10 }, (_, i) => moment().year() + i).map(
            (year) => (
              <option key={year} value={year}>
                {year}
              </option>
            )
          )}
        </select>

        {/* Month Selection */}
        <select
          value={date.month()}
          onChange={(e) => handleDateChange("month", e.target.value)}
          className="text-white p-2 rounded-md text-sm"
        >
          {moment.months().map((month, index) => (
            <option key={index} value={index}>
              {month}
            </option>
          ))}
        </select>

        {/* Day Selection */}
        <select
          value={date.date()}
          onChange={(e) => handleDateChange("day", e.target.value)}
          className="text-white p-2 rounded-md text-sm"
        >
          {Array.from({ length: date.daysInMonth() }, (_, i) => i + 1).map(
            (day) => (
              <option key={day} value={day}>
                {day}
              </option>
            )
          )}
        </select>
      </div>

      <div className="flex gap-2 mt-3">
        {/* Hour Selection */}
        <select
          value={date.hour() % 12 || 12} // Convert to 12-hour format
          onChange={(e) => handleDateChange("hour", e.target.value)}
          className="text-white p-2 rounded-md text-sm"
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
            <option key={hour} value={hour}>
              {hour}
            </option>
          ))}
        </select>

        {/* Minute Selection */}
        <select
          value={date.minute()}
          onChange={(e) => handleDateChange("minute", e.target.value)}
          className="text-white p-2 rounded-md text-sm"
        >
          {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
            <option key={minute} value={minute}>
              {minute < 10 ? `0${minute}` : minute}
            </option>
          ))}
        </select>

        {/* AM/PM Selection */}
        <select
          value={date.hour() >= 12 ? "PM" : "AM"}
          onChange={(e) => handleDateChange("period", e.target.value)}
          className="text-white p-2 rounded-md text-sm"
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>
    </div>
  );
};

export default DateSelector;
