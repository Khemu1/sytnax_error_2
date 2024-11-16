import { object, string } from "zod";



export const newSurveySchema = () => {
  return object({
    title: string()
      .min(1, "survey title is required")
      .max(100, "survey title is too long"),
  });
};


export const updateUrlSchema = () => {
  return object({
    url: string()
      .min(1, "URL is requried")
      .max(100, "URL is too long")
      .regex(/^[a-zA-Z0-9]+$/, "URL can only contain english letters and numbers"),
  });
};
