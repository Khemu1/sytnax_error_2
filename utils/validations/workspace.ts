import { object, string } from "zod";



export const newWorkspaceSchema = () => {
  return object({
    title: string()
      .min(1, "Workspace title is requried")
      .max(100, "Workspace title is too long"),
  });
};
