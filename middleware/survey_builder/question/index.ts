import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { CustomError } from "@/middleware/CustomError";
import { validateWithSchema } from "@/utils/validations/validations";
import {
  editQuestionSchema,
  newQuestionSchema,
  questionOptionsSchema,
} from "@/utils/validations/question";
import {
  EditQuestionModel,
  NewQuestionModel,
  QuestionOptions,
} from "@/types/buildSurvey";
const prisma = new PrismaClient().$extends(withAccelerate());

// for some damn reason, it won't set the headers without the this method
const setResponseHeaders = (
  res: NextResponse,
  headers: Record<string, string>
) => {
  Object.entries(headers).forEach(([key, value]) =>
    res.headers.set(key, value)
  );
};

export const checkDoesWorkspaceExistForQuestion = async (
  req: NextRequest,
  res: NextResponse,
  workspaceId: string
) => {
  try {
    if (!workspaceId) {
      throw new CustomError("Workspace ID is required", 400, "question");
    }

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
    });

    if (!workspace) {
      console.error("Workspace not found for ID:", workspaceId);
      throw new CustomError("Workspace not found", 404, "question");
    }

    const response = NextResponse.next();
    setResponseHeaders(response, {
      workspace: JSON.stringify({ workspaceId, userId: workspace.userId }),
      "User-Id": res.headers.get("User-Id")!,
    });

    return response;
  } catch (error) {
    console.error("Error in checkDoesWorkspaceExistForQuestion:", error);
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
    if (!surveyId || !workspaceId) {
      throw new CustomError(
        "Survey ID and Workspace ID are required",
        400,
        "question"
      );
    }

    const survey = await prisma.survey.findUnique({
      where: {
        id: surveyId,
        workspaceId,
      },
    });

    if (!survey) {
      console.error(
        `Survey not found for ID: ${surveyId} in workspace: ${workspaceId}`
      );
      throw new CustomError("Survey not found for workspace", 404, "question");
    }

    const response = NextResponse.next();
    setResponseHeaders(response, {
      workspace: res.headers.get("workspace")!,
      "User-Id": res.headers.get("User-Id")!,
    });

    return response;
  } catch (error) {
    console.error("Error in checkDoesSurveyExistForQuestion:", error);
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
      console.error("Missing headers:", {
        "User-Id": rawUserId,
        workspace: rawWorkspace,
      });
      throw new CustomError(
        "Missing user ID or workspace",
        400,
        "workspace middleware",
        false
      );
    }

    const userId = +rawUserId;

    let workspace: { workspaceId: string; userId: number };
    try {
      workspace = JSON.parse(rawWorkspace);
    } catch (parseError) {
      console.error("Error parsing rawWorkspace:", parseError, rawWorkspace);
      throw new CustomError(
        "Invalid workspace format in headers",
        400,
        "workspace middleware",
        false
      );
    }

    if (!workspace.userId) {
      console.error("Workspace is missing userId:", workspace);
      throw new CustomError(
        "Workspace does not contain userId",
        400,
        "workspace middleware",
        false
      );
    }

    const ownerId = workspace.userId;

    // If it's the owner
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
    console.error("Error in checkGroupMembershipForQuestion:", error);
    throw error;
  }
};

export const vlidateForNewQuestion = async (
  _req: NextRequest,
  res: NextResponse,
  data: {
    question: NewQuestionModel;
    options: QuestionOptions;
    workspaceId: string;
    surveyId: string;
  }
) => {
  try {
    questionOptionsSchema().parse(data.options);
    newQuestionSchema(data.options).parse(data.question);

    const response = NextResponse.next();
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

export const vlidateForEditQuestion = async (
  _req: NextRequest,
  res: NextResponse,
  data: {
    question: EditQuestionModel;
    options: QuestionOptions;
    workspaceId: string;
    surveyId: string;
  }
) => {
  try {
    questionOptionsSchema().parse(data.options);
    editQuestionSchema(data.options).parse(data.question);

    const response = NextResponse.next();
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

export const doesQuestionExists = async (
  questionId: string,
  surveyId: string
) => {
  try {
    console.log("Checking if question exists:", questionId, surveyId);
    const question = await prisma.question.findUnique({
      where: {
        id: questionId,
        surveyId: surveyId,
      },
    });
    if (!question) {
      throw new CustomError("Question does not exist", 404, "question");
    }
    const response = NextResponse.next();
    response.headers.set("question", JSON.stringify(question));
    return NextResponse.next();
  } catch (error) {
    console.error("faild to find the question", error);
    throw error;
  }
};
