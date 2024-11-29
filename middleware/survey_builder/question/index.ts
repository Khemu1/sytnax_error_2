import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { CustomError } from "@/middleware/CustomError";
import { WorkSpaceModel } from "@/types/survey";
import { validateWithSchema } from "@/utils/validations/validations";
import { returnQuestionData } from "@/utils/survey_builder/build/questions";
import {
  newQuestionSchema,
  questionOptionsSchema,
} from "@/utils/validations/question";
const prisma = new PrismaClient().$extends(withAccelerate());

export const checkDoesWorkspaceExistForQuestion = async (
  req: NextRequest,
  res: NextResponse,
  workspaceId: string
) => {
  try {
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
    });

    if (!workspace) {
      console.error("Workspace not found for ID:", workspaceId);
      throw new CustomError("Workspace not found", 404, "question");
    }
    const response = NextResponse.next();
    response.headers.set("workspace", JSON.stringify(workspace));
    response.headers.set("User-Id", res.headers.get("User-Id")!);
    return response;
  } catch (error) {
    throw error;
  }
};

export const checkDoesSurveyExistForQuestion = async (
  req: NextRequest,
  res: NextResponse,
  surveyId: string,
  workspaceId: string
) => {
  try {
    const survey = await prisma.survey.findUnique({
      where: {
        id: surveyId,
        workspaceId,
      },
    });

    if (!survey) {
      throw new CustomError("Survey not found for workspace", 404, "question");
    }
    const response = NextResponse.next();
    response.headers.set(
      "workspace",
      JSON.stringify(res.headers.get("workspace"))
    );
    response.headers.set("User-Id", res.headers.get("User-Id")!);
    return response;
  } catch (error) {
    throw error;
  }
};

export const checkGroupMemberShipForQuestion = async (
  req: NextRequest,
  res: NextResponse
) => {
  try {
    const rawUserId = res.headers.get("User-Id");
    const rawWorkspace = res.headers.get("workspace");
    if (!rawUserId || !rawWorkspace) {
      throw new CustomError(
        "missing user id or workspace",
        400,
        "workspace middleware",
        false
      );
    }
    const userId = +rawUserId;
    const workspace: WorkSpaceModel = JSON.parse(rawWorkspace);
    const ownerId = workspace.userId;

    // if it's the owner
    if (ownerId === userId) {
      return res;
    }

    const groupMembers = await prisma.group.findFirst({
      where: {
        ownerId,
      },
      include: {
        UserGroup: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (groupMembers?.UserGroup.find((group) => group.userId === userId)) {
      return res;
    }

    throw new CustomError("You don't have access to this workspace", 403);
  } catch (error) {
    console.error("Error in checkGroupMembershipForWorkspace:", error);
    throw error;
  }
};

export const vlidateForNewQuestion = async (
  req: NextRequest,
  res: NextResponse,
  data: { question: FormDataEntryValue; options: FormDataEntryValue }
) => {
  try {
    // const formData = returnQuestionData(data);
    // questionOptionsSchema().parse(formData);
    // newQuestionSchema(formData.options!).parse(formData.question);
    const response = NextResponse.next();
    response.headers.set("User-Id", res.headers.get("User-Id")!);
    // response.headers.set("question", JSON.stringify(formData));
    return response;
  } catch (error) {
    throw new CustomError(
      "Error validating new question",
      400,
      "question",
      true,
      "",
      validateWithSchema(error)
    );
  }
};
