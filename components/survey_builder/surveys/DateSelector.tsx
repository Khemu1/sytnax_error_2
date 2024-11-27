import React, { useState, useEffect } from "react";

interface DateSelectorProps {
  selectedDate: Date | null;
  onDateChange: (newDate: Date | null) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDate,
  onDateChange,
}) => {
  const today = new Date();

  const [year, setYear] = useState<number | null>(null);
  const [month, setMonth] = useState<number | null>(null);
  const [day, setDay] = useState<number | null>(null);
  const [hour, setHour] = useState<number | null>(null); // 12-hour format
  const [minute, setMinute] = useState<number | null>(null);
  const [period, setPeriod] = useState<"AM" | "PM" | null>(null);

  useEffect(() => {
    if (selectedDate) {
      setYear(selectedDate.getFullYear());
      setMonth(selectedDate.getMonth());
      setDay(selectedDate.getDate());
      setHour(selectedDate.getHours() % 12 || 12);
      setMinute(selectedDate.getMinutes());
      setPeriod(selectedDate.getHours() >= 12 ? "PM" : "AM");
    }
  }, []);

  const getDaysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();

  useEffect(() => {
    if (
      year === null ||
      month === null ||
      day === null ||
      hour === null ||
      minute === null ||
      period === null
    ) {
      onDateChange(null);
      return;
    }

    const newHour = period === "PM" ? (hour % 12) + 12 : hour % 12;
    const newDate = new Date(year, month, day, newHour, minute);

    if (isNaN(newDate.getTime())) {
      console.error("Invalid date generated.");
      onDateChange(null);
      return;
    }

    onDateChange(newDate);
  }, [year, month, day, hour, minute, period]);

  const handleYearChange = (newYear: number) => {
    setYear(newYear);
    const maxDays = getDaysInMonth(newYear, month || 0);
    if (day && day > maxDays) {
      setDay(maxDays);
    }
  };

  const handleMonthChange = (newMonth: number) => {
    setMonth(newMonth);
    const maxDays = getDaysInMonth(year || today.getFullYear(), newMonth);
    if (day && day > maxDays) {
      setDay(maxDays);
    }
  };

  return (
    <div>
      <div className="flex gap-2">
        {/* Year Selector */}
        <select
          value={year ?? ""}
          onChange={(e) => handleYearChange(Number(e.target.value))}
          className="text-white p-2 rounded-md text-sm"
        >
          <option value="" disabled>
            Year
          </option>
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
          value={month ?? ""}
          onChange={(e) => handleMonthChange(Number(e.target.value))}
          className="text-white p-2 rounded-md text-sm"
        >
          <option value="" disabled>
            Month
          </option>
          {Array.from({ length: 12 }, (_, i) => i).map((m) => (
            <option key={m} value={m}>
              {new Date(0, m).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>

        {/* Day Selector */}
        <select
          value={day ?? ""}
          onChange={(e) => setDay(Number(e.target.value))}
          className="text-white p-2 rounded-md text-sm"
        >
          <option value="" disabled>
            Day
          </option>
          {Array.from(
            { length: getDaysInMonth(year || today.getFullYear(), month || 0) },
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
          value={hour ?? ""}
          onChange={(e) => setHour(Number(e.target.value))}
          className="text-white p-2 rounded-md text-sm"
        >
          <option value="" disabled>
            Hour
          </option>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>

        {/* Minute Selector */}
        <select
          value={minute ?? ""}
          onChange={(e) => setMinute(Number(e.target.value))}
          className="text-white p-2 rounded-md text-sm"
        >
          <option value="" disabled>
            Minute
          </option>
          {Array.from({ length: 60 }, (_, i) => i).map((m) => (
            <option key={m} value={m}>
              {m < 10 ? `0${m}` : m}
            </option>
          ))}
        </select>

        {/* AM/PM Selector */}
        <select
          value={period ?? ""}
          onChange={(e) => setPeriod(e.target.value as "AM" | "PM")}
          className="text-white p-2 rounded-md text-sm"
        >
          <option value="" disabled>
            Period
          </option>
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>
    </div>
  );
};

export default DateSelector;
