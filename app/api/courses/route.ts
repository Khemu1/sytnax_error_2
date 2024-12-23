import {
  addCourseService,
  deleteCourseService,
  getAllCoursesService,
} from "@/backendServices/courseService";
import { NextRequest, NextResponse } from "next/server";
import { errorHandler } from "@/middleware/CustomError";
import { processFormData } from "@/utils";
import { NewCourseProps } from "@/types";

export const POST = async (req: NextRequest) => {
  try {
    const userId = req.headers.get("User-Id")!;
    const form = await req.formData();
    const courseData = processFormData(form) as NewCourseProps;

    const newCourse = await addCourseService(courseData, +userId);
    return NextResponse.json(newCourse, { status: 201 });
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};

export const GET = async () => {
  try {
    const courses = await getAllCoursesService();
    return NextResponse.json(courses, { status: 200 });
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    const data = await req.json();
    const ids = data.ids as number[];
    await deleteCourseService(ids);
    return NextResponse.json(
      { message: "Course deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};
