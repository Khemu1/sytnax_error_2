import { NextRequest, NextResponse } from "next/server";
import { CustomError, errorHandler } from "@/middleware/CustomError";
import { getCourseService } from "@/backendServices/courseService";

// Define the Params type as a Promise that resolves to an object containing `id`
type Params = Promise<{ id: string }>;

// Asynchronous GET method to handle the request
export const GET = async (req: NextRequest, { params }: { params: Params }) => {
  try {
    // Await the params before using them
    const { id } = await params;

    // Validate the id
    if (isNaN(Number(id)) || Number(id) === 0) {
      throw new CustomError("invalid course id", 404, "", true);
    }

    // Fetch the course using the id
    const course = await getCourseService(+id);
    return NextResponse.json(course, { status: 200 });
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};
