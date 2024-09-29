import { NextRequest, NextResponse } from "next/server";
import { CustomError, errorHandler } from "@/middleware/CustomError";
import { getCourseService } from "@/backendServices/courseService";
interface Props {
  params: { id: number };
}
export const GET = async (req: NextRequest, { params }: Props) => {
  try {
    const id = params.id;
    if (isNaN(id) || id === 0) {
      throw new CustomError("invalid course id", 404, "", true);
    }
    const course = await getCourseService(+params.id);
    return NextResponse.json(course, { status: 200 });
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};
