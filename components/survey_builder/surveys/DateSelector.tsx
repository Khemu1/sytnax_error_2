import React, { useState, useEffect } from "react";

interface DateSelectorProps {
  selectedDate: Date | null;
  onDateChange: (newDate: Date) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDate,
  onDateChange,
}) => {
  const today = new Date();

  // State to manage date and time fields
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-based
  const [day, setDay] = useState(today.getDate());
  const [hour, setHour] = useState(today.getHours() % 12 || 12); // 12-hour format
  const [minute, setMinute] = useState(today.getMinutes());
  const [period, setPeriod] = useState(today.getHours() >= 12 ? "PM" : "AM");

  useEffect(() => {
    if (selectedDate) {
      setYear(selectedDate.getFullYear());
      setMonth(selectedDate.getMonth());
      setDay(selectedDate.getDate());
      setHour(selectedDate.getHours() % 12 || 12);
      setMinute(selectedDate.getMinutes());
      setPeriod(selectedDate.getHours() >= 12 ? "PM" : "AM");
      console.log(selectedDate);
    }
  }, []);

  const getDaysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();

  const handleDateChange = () => {
    const newHour = period === "PM" ? (hour % 12) + 12 : hour % 12;
    const newDate = new Date(year, month, day, newHour, minute);

    if (isNaN(newDate.getTime())) {
      alert("Please select a valid start and end time.");
      return;
    }

    onDateChange(newDate);
  };

  const handleYearChange = (newYear: number) => {
    setYear(newYear);
    const maxDays = getDaysInMonth(newYear, month);
    if (day > maxDays) {
      setDay(maxDays);
    }
    handleDateChange();
  };

  const handleMonthChange = (newMonth: number) => {
    setMonth(newMonth);
    const maxDays = getDaysInMonth(year, newMonth);
    if (day > maxDays) {
      setDay(maxDays);
    }
    handleDateChange();
  };

  return (
    <div>
      <div className="flex gap-2">
        {/* Year Selector */}
        <select
          value={year}
          onChange={(e) => handleYearChange(Number(e.target.value))}
          className="text-white p-2 rounded-md text-sm"
        >
          {Array.from({ length: 10 }, (_, i) => today.getFullYear() + i).map(
            (y) => (
              <option key={y} value={y}>
                {y}
              </option>
            )
          )}
        </select>

        {/* Month Selector */}
        <select
          value={month}
          onChange={(e) => handleMonthChange(Number(e.target.value))}
          className="text-white p-2 rounded-md text-sm"
        >
          {Array.from({ length: 12 }, (_, i) => i).map((m) => (
            <option key={m} value={m}>
              {new Date(0, m).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>

        {/* Day Selector */}
        <select
          value={day}
          onChange={(e) => {
            setDay(Number(e.target.value));
            handleDateChange();
          }}
          className="text-white p-2 rounded-md text-sm"
        >
          {Array.from(
            { length: getDaysInMonth(year, month) },
            (_, i) => i + 1
          ).map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2 mt-3">
        {/* Hour Selector */}
        <select
          value={hour}
          onChange={(e) => {
            setHour(Number(e.target.value));
            handleDateChange();
          }}
          className="text-white p-2 rounded-md text-sm"
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>

        {/* Minute Selector */}
        <select
          value={minute}
          onChange={(e) => {
            setMinute(Number(e.target.value));
            handleDateChange();
          }}
          className="text-white p-2 rounded-md text-sm"
        >
          {Array.from({ length: 60 }, (_, i) => i).map((m) => (
            <option key={m} value={m}>
              {m < 10 ? `0${m}` : m}
            </option>
          ))}
        </select>

        {/* AM/PM Selector */}
        <select
          value={period}
          onChange={(e) => {
            setPeriod(e.target.value);
            handleDateChange();
          }}
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
