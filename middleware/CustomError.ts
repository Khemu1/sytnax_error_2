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

export const sendDevError = (error: CustomError) => {
  return NextResponse.json(
    {
      message: error.message,
      status: error.status || "error", // fallback
      details: error.details,
      type: error.type,
      errors: error.errors,
      stack: error.stack,
    },
    { status: error.statusCode }
  );
};

export const sendProdError = (error: CustomError) => {
  return NextResponse.json(
    {
      message: error.message,
      status: error.status || "error", // fallback
      details: error.details,
      errors: error.errors,
      type: error.type,
    },
    { status: error.statusCode }
  );
};

export const errorHandler = (error: any) => {
  return process.env.NODE_ENV === "development"
    ? sendDevError(error)
    : sendProdError(error);
};
