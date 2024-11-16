// middleware.ts
import {
  editCourseSchemaForBackend,
  joinCourseFieldsschema,
  newCourseSchema,
  validateWithSchema,
} from "@/utils/validations/validations";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { CustomError } from "./CustomError";
import { processFormData } from "@/utils";
import { ZodError } from "zod";

export const validateNewCourse = async (
  req: NextRequest,
  res: NextResponse
) => {
  try {
    const userId = res.headers.get("User-Id");
    const data = await req.formData();
    const courseData = processFormData(data);

    // Validate the courseData using your schema
    newCourseSchema.parse(courseData);

    const response = NextResponse.next();
    response.headers.set("User-Id", userId as string);
    return response;
  } catch (error) {
    const validationErrors = validateWithSchema(error);
    throw new CustomError(
      "Validation Error",
      400,
      "validation error",
      false,
      "There were errors with the submitted data.",
      validationErrors
    );
  }
};

export const checkDeletionIds = async (
  req: NextRequest,
  authUser: NextResponse
) => {
  try {
    const userId = authUser.headers.get("User-Id") as string;

    const data = await req.json();
    if (!Array.isArray(data.ids)) {
      throw new CustomError(
        "No  IDs provided",
        400,
        "deletion error",
        true,
        "IDs must be provided as an array in the request body."
      );
    }

    if (data.ids.length < 1) {
      throw new CustomError(
        "Please choose an Id to delete",
        400,
        "deletion error",
        true,
        "At least one course ID must be provided."
      );
    }

    data.ids.forEach((id: number) => {
      if (typeof id !== "number" || !Number.isInteger(id) || id <= 0) {
        throw new CustomError(
          "Invalid  ID",
          400,
          "deletion error",
          true,
          "IDs must be positive integers."
        );
      }
    });

    const response = NextResponse.next();
    response.headers.set("User-Id", userId);
    return response;
  } catch (error) {
    throw error;
  }
};

export const validateCourseForEdit = async (req: NextRequest) => {
  try {
    const form = await req.formData();
    if (!form) {
      throw new CustomError("Invalid data", 400, "validation error");
    }

    const actualValues = processFormData(form);

    console.log("Processed values:", actualValues);

    const schema = editCourseSchemaForBackend();
    schema.parse(actualValues);

    return NextResponse.next();
  } catch (error) {
    const validationErrors = validateWithSchema(error);
    throw new CustomError(
      "Validation Error",
      400,
      "validation error",
      false,
      "There were errors with the submitted data.",
      validationErrors
    );
  }
};

export const vlidateCourseRegister = async (req: NextRequest) => {
  try {
    const data = await req.json();
    const schema = joinCourseFieldsschema();
    schema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      const zodErros = validateWithSchema(error);
      throw new CustomError("validation error", 400, "zod", true, "", zodErros);
    }
    console.log(error);
    throw new CustomError("Invalid request", 400, "validation error");
  }
};
