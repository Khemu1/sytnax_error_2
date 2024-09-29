import { imageDataResponse, ImageDeleteResponse } from "@/types";
import { CustomError } from "@/middleware/CustomError";

export const uploadToImgur = async (
  image: File
): Promise<imageDataResponse> => {
  const imgurFormData = new FormData();
  imgurFormData.append("image", image);
  imgurFormData.append("type", image.type);
  imgurFormData.append("type", Date.now().toString());

  const response = await fetch("https://api.imgur.com/3/image", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.IMGUR_TOKEN}`,
    },
    body: imgurFormData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new CustomError(`Imgur error: ${errorData.message}`,500);
  }
  return response.json();
};

export const deleteImgur = async (
  deleteHash: string
): Promise<ImageDeleteResponse> => {
  try {
    console.log(`Deleting image with hash: ${deleteHash}`);
    const response = await fetch(
      `https://api.imgur.com/3/image/${deleteHash}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${process.env.IMGUR_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error from Imgur API:", response.status, errorData);
      throw new CustomError(
        `Something happened when deleting imgur image with ${deleteHash}`,
        500,
        "imgur",
        true
      );
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};
