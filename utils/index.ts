import { PublicCardCourseProps } from "@/types";

export const calculateExpirationDate = (duration: string): Date => {
  const match = duration.match(/^(\d+)([smhd])$/); // Matches the format "15m", "1h", etc.

  if (!match) {
    throw new Error("Invalid expiration duration format.");
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  const now = new Date();

  switch (unit) {
    case "s": // seconds
      return new Date(now.getTime() + value * 1000);
    case "m": // minutes
      return new Date(now.getTime() + value * 60 * 1000);
    case "h": // hours
      return new Date(now.getTime() + value * 60 * 60 * 1000);
    case "d": // days
      return new Date(now.getTime() + value * 24 * 60 * 60 * 1000);
    default:
      throw new Error("Invalid time unit.");
  }
};

export const formatDate = (date: Date) => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return null; // Handle invalid dates
  }

  const hours = date.getHours();
  return {
    year: date.getFullYear().toString(),
    month: date.getMonth() + 1, // `getMonth()` is 0-indexed, so add 1
    day: date.getDate(),
    hours: hours % 12 || 12, // Convert to 12-hour format
    minutes: date.getMinutes(),
    period: hours >= 12 ? "PM" : "AM",
  };
};

export const getSurveyStatus = (
  _startTime: string | null,
  _endTime: string | null
) => {
  if (!_startTime || !_endTime) {
    return {
      startTime: null,
      endTime: null,
      isActive: false,
    };
  }
  const startTime = new Date(_startTime);
  const endTime = new Date(_endTime);

  const convertToEgyptTime = (date: Date) => {
    // Convert the provided date to Africa/Cairo timezone and format it
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Africa/Cairo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false, // Use 24-hour format
    });

    const formattedDate = formatter.format(date);

    // Split formatted date into components
    const [month, day, year] = formattedDate.split(", ")[0].split("/");
    const [hour, minute, second] = formattedDate.split(", ")[1].split(":");

    // Construct a new Date object in the Cairo time zone
    const egyptDate = new Date(
      `${year}-${month}-${day}T${hour}:${minute}:${second}+02:00`
    );

    // Return the ISO string representation
    return egyptDate.toISOString();
  };

  const egyptStartTime = convertToEgyptTime(startTime);
  const egyptEndTime = convertToEgyptTime(endTime);

  const now = new Date();
  const isActive = now < endTime;

  return {
    startTime: egyptStartTime,
    endTime: egyptEndTime,
    isActive,
  };
};

export const filterBy = (data: PublicCardCourseProps[], by: string) => {
  // Create a copy of the data array to avoid mutating the original
  const sortedData = [...data];

  switch (by) {
    case "name-asc":
      return sortedData.sort((a, b) => a.title.localeCompare(b.title));

    case "name-desc":
      return sortedData.sort((a, b) => b.title.localeCompare(a.title));

    case "price-asc":
      return sortedData.sort((a, b) => a.price - b.price);

    case "price-desc":
      return sortedData.sort((a, b) => b.price - a.price);

    default:
      return sortedData;
  }
};

export const filterBySearch = (
  data: PublicCardCourseProps[],
  searchQuery: string
) => {
  if (!searchQuery) {
    return data;
  }

  return data.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
};

export const processFormData = (data: FormData) => {
  return Array.from(data.entries()).reduce((acc, [key, value]) => {
    if (typeof value === "string") {
      const trimmedValue = value.trim();
      const parsedNumber = Number(trimmedValue);

      if (!isNaN(parsedNumber) && parsedNumber >= 0) {
        acc[key] = parsedNumber;
      } else if (trimmedValue.length > 0) {
        acc[key] = trimmedValue;
      }
    } else if (typeof value === "object") {
      acc[key] = value as File;
    }

    return acc;
  }, {} as Record<string, string | number | object>);
};

export function formatDateToCustomString(date: Date): string {
  // Options for formatting hours, minutes, and seconds
  const optionsTime: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: "Africa/Cairo", // Correct time zone for Egypt
  };

  const optionsDate: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Africa/Cairo",
  };

  // Get the time part
  const timeString = date.toLocaleTimeString("en-US", optionsTime); // Keep the locale as 'en-US'
  const dateString = date
    .toLocaleDateString("en-CA", optionsDate)
    .replace(/-/g, "/"); // Use 'en-CA' to keep numbers in default format

  // Combine time and date in the desired format
  return `${timeString} ${dateString}`;
}

// export function clearSlices(dispatch: Dispatch) {
//   dispatch(resetSharedFormSliceFields());
//   dispatch(resetGenericTextSliceFields());
// }
