import { object, string } from "zod";



export const newWorkspaceSchema = () => {
  return object({
    name: string({required_error: "Workspace name is required"})
      .min(1, "Workspace title is requried")
      .max(100, "Workspace title is too long"),
  });
};
