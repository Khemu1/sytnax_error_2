import { object, string, date, number } from "zod";

const allowedGradesVisibility = [
  "visible",
  "hidden",
  "visibleAfterSurveyCloses",
];

export const newSurveySchema = () => {
  return object({
    name: string()
      .min(1, "survey title is required")
      .max(100, "survey title is too long"),
  });
};

export const updateUrlSchema = () => {
  return object({
    url: string()
      .min(1, "URL is requried")
      .max(100, "URL is too long")
      .regex(
        /^[a-zA-Z0-9]+$/,
        "URL can only contain english letters and numbers"
      ),
  });
};

export const surveySettingsSchema = () => {
  return object({
    questionsPerPage: number()
      .min(1, "Minimum number for questions per page is 1")
      .max(20, "Maximum number for questions per page is 20")
      .optional()
      .nullable(),
    duration: number()
      .min(5, "Minimum number for duration is 5")
      .optional()
      .nullable(),
    startTime: date().optional().nullable(),
    endTime: date().optional().nullable(),
    gradesVisibility: string()
      .nullable()
      .refine((value) => !value || allowedGradesVisibility.includes(value), {
        message: "grade visibility must be choosen",
      })

      .optional(),
  }).superRefine((val, ctx) => {
    const isEmpty =
      !val.duration &&
      !val.endTime &&
      !val.startTime &&
      !val.questionsPerPage &&
      !val.gradesVisibility;

    if (isEmpty) {
      ctx.addIssue({
        code: "custom",
        message: "Please select at least one option",
        path: ["form"],
      });
    }

    if (val.startTime && !val.endTime) {
      ctx.addIssue({
        code: "custom",
        message: "End time is required if start time is set",
        path: ["endTime"],
      });
    } else if (!val.startTime && val.endTime) {
      ctx.addIssue({
        code: "custom",
        message: "Start time is required if end time is set",
        path: ["startTime"],
      });
    }
  });
};
