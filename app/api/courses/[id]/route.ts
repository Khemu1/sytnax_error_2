import { NextRequest, NextResponse } from "next/server";
import { CustomError, errorHandler } from "@/middleware/CustomError";
import { getCourseService } from "@/backendServices/courseService";

type Params = Promise<{ id: string }>;

export const GET = async (req: NextRequest, { params }: { params: Params }) => {
  try {
    const { id } = await params;

    if (isNaN(Number(id)) || Number(id) === 0) {
      throw new CustomError("invalid course id", 404, "", true);
    }

    const course = await getCourseService(+id);
    return NextResponse.json(course, { status: 200 });
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};
