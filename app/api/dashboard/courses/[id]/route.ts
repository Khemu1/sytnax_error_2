import { CustomError, errorHandler } from "@/middleware/CustomError";
import {
  dashboardAllCourseDataService,
  dashboardEditCourseService,
} from "@/backendServices/dashboard";
import { processFormData } from "@/utils";
import {} from "@/utils/validations";
import { NextRequest, NextResponse } from "next/server";
interface Props {
  params: { id: number };
}
export const GET = async (req: NextRequest, { params }: Props) => {
  try {
    const id = params.id;
    if (isNaN(id) || id === 0) {
      throw new CustomError("invalid course id", 404, "", true);
    }
    const course = await dashboardAllCourseDataService(+params.id);
    return NextResponse.json(course, { status: 200 });
  } catch (error) {
    return errorHandler(error);
  }
};

export const PUT = async (req: NextRequest, { params }: Props) => {
  try {
    const id = params.id;
    if (isNaN(id) || id === 0) {
      throw new CustomError("invalid course id", 404, "", true);
    }
    const data = await req.formData();
    const processedFormData = processFormData(data);
    const course = await dashboardEditCourseService(
      +params.id,
      processedFormData
    );
    return NextResponse.json(course, { status: 200 });
  } catch (error) {
    return errorHandler(error);
  }
};
