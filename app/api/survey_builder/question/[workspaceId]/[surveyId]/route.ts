import { errorHandler } from "@/middleware/CustomError";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: Promise<{
    workspaceId: string;
    surveyId: string;
  }>;
}

export const POST = (_request: NextRequest, { params }: Props) => {
  try {
    
  } catch (error) {
    return errorHandler(error);
  }
};
