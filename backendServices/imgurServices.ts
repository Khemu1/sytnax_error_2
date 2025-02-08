import { imageDataResponse, ImageDeleteResponse } from "@/types";
import { CustomError } from "@/middleware/CustomError";
import { Readable } from "stream";

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

async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

function base64ToStream(base64: string): Readable {
  const buffer = Buffer.from(base64, "base64");
  return Readable.from(buffer);
}

export const uploadQuestionImageToImgur = async (
  image: string,
  type: "base64" | "url" = "base64"
): Promise<imageDataResponse> => {
  try {
    if (!image || typeof image !== "string") {
      throw new Error("Invalid image input. Expected a non-empty string.");
    }

    const imgurFormData = new FormData();

    if (type === "base64") {
      // Remove metadata (e.g., "data:image/png;base64,")
      const base64Data = image.includes(",") ? image.split(",")[1] : image;

      // Convert base64 to a readable stream
      const imageStream = base64ToStream(base64Data);

      // Convert stream to buffer
      const buffer = await streamToBuffer(imageStream);

      imgurFormData.append("image", buffer.toString("base64"));
      imgurFormData.append("type", "base64");
    } else if (type === "url") {
      // Directly upload the image from a URL
      imgurFormData.append("image", image);
      imgurFormData.append("type", "url");
    } else {
      throw new Error(`Unsupported image type: ${type}`);
    }

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
    return await response.json();
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
