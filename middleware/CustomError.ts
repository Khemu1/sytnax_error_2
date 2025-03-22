/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";
export class CustomError extends Error {
  message: string;
  statusCode: number;
  status: string;
  safe: boolean;
  type: string;
  details: string = "";
  errors?: Record<string, string>;

  constructor(
    message: string,
    statusCode: number = 500,
    type: string = "server error",
    safe: boolean = false,
    details?: string,
    errors?: Record<string, string>
  ) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.status = statusCode >= 200 && statusCode < 300 ? "success" : "fail";
    this.safe = safe;
    this.details = details || "";
    this.type = type;
    this.errors = errors;
    // this.stack = new Error().stack;
  }
}

export const sendDevError = (error: any) => {
  if (error instanceof CustomError) {
    return NextResponse.json(
      {
        message: error.message,
        status: error.status || "error",
        details: error.details,
        type: error.type,
        errors: error.errors,
        stack: error.stack,
      },
      { status: error.statusCode || 500 }
    );
  }

  return NextResponse.json(
    {
      message: "An unexpected error occurred.",
      status: "error",
    },
    { status: 500 }
  );
};

export const sendProdError = (error: any) => {
  console.log("got error in proError ", error);

  if (error instanceof CustomError) {
    return NextResponse.json(
      {
        message: error.message,
        status: error.status || "error",
        details: error.details,
        errors: error.errors,
        type: error.type,
      },
      { status: error.statusCode || 500 }
    );
  }

  return NextResponse.json(
    {
      message: "Something went wrong. Please try again later.",
      status: "error",
    },
    { status: 500 }
  );
};

export const errorHandler = (error: any) => {
  console.log(process.env.NODE_ENV, "adsasdsa");

  return process.env.NODE_ENV === "development"
    ? sendDevError(error)
    : sendProdError(error);
};
