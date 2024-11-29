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
