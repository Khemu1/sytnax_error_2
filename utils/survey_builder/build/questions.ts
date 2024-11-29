import { filterObject } from "@/utils";

export const returnFileAndUrl = (
  file: File | null
): Promise<{ file: File | null; url: string | undefined }> => {
  try {
    return new Promise((resolve) => {
      let url: string | undefined = undefined;

      if (file) {
        // asynchronous
        const reader = new FileReader();
        reader.onloadend = () => {
          url = reader.result as string;
          resolve({ file, url });
        };
        reader.readAsDataURL(file);
      } else {
        resolve({ file, url });
      }
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const transformDataIntoFormData = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>,
  form: FormData
) => {
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      form.append(key, JSON.stringify(value));
    }
  }
};

export const returnQuestionData = (formData: {
  question: FormDataEntryValue;
  options: FormDataEntryValue;
}) => {
  return filterObject(formData, ["question", "options"]);
};
