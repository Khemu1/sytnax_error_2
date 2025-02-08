import { imageDataResponse, ImageDeleteResponse } from "@/types";
import { CustomError } from "@/middleware/CustomError";

export const uploadICourseImageToImgur = async (
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
    throw new CustomError(`Imgur error: ${errorData.message}`, 500);
  }
  console.log("image uploaded");
  return response.json();
};

export const uploadQuestionImageToImgur = async (
  image: string,
  type = "base64"
): Promise<imageDataResponse> => {
  try {
    if (!image || typeof image !== "string") {
      console.error("Invalid image input:", image);
      throw new Error("Invalid image input. Expected a non-empty string.");
    }

    const modifiedImage =
      type === "base64" && image.includes(",") ? image.split(",")[1] : image;

    if (!modifiedImage || typeof modifiedImage !== "string") {
      console.error("Invalid modified image:", modifiedImage);
      throw new Error("Processed image is empty or invalid.");
    }

    const imgurFormData = new FormData();
    imgurFormData.append("image", modifiedImage);
    imgurFormData.append("type", "base64");
    imgurFormData.append("title", "question image");
    imgurFormData.append("description", new Date().toISOString());

    if (!process.env.IMGUR_TOKEN) {
      throw new Error("Missing Imgur API token! Ensure IMGUR_TOKEN is set.");
    }

    const response = await fetch("https://api.imgur.com/3/image", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.IMGUR_TOKEN}`,
      },
      body: imgurFormData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Imgur API error:", errorData);
      throw new Error(`Imgur error: ${errorData.data.error}`);
    }

    console.log("Uploaded image successfully");
    const parsedRes = await response.json();
    return parsedRes;
  } catch (error) {
    console.error("Image upload failed:", error);
    throw error;
  }
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
