import { CustomError } from "@/middleware/CustomError";
import { CustomNextRequest } from "@/types";
import { SurveySettings, WorkSpaceModel } from "@/types/survey";
import {
  newSurveySchema,
  surveySettingsSchema,
} from "@/utils/validations/survey";
import { validateWithSchema } from "@/utils/validations/validations";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

const prisma = new PrismaClient().$extends(withAccelerate());

export const validateNewSurvey = async (
  req: NextRequest,
  res: NextResponse,
  name: string
) => {
  try {
    console.log("validating new survey", name);
    const schema = newSurveySchema();
    schema.parse({ name });

    const response = NextResponse.next();
    response.headers.set("User-Id", res.headers.get("User-Id")!);
    return response;
  } catch (error) {
    throw new CustomError(
      "Error Validating new survey",
      400,
      "survey",
      true,
      "",
      validateWithSchema(error)
    );
  }
};

export async function checkWorkspaceExistsForSurvey(
  req: CustomNextRequest,
  res: NextResponse,
  workspaceId: string
) {
  try {
    if (!workspaceId) {
      throw new CustomError(
        "workspace It doesn't exists",
        400,
        "workspace check for survey",
        false
      );
    }
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
    });

    if (!workspace) {
      console.error("Workspace not found for ID:", workspaceId);
      throw new CustomError(
        "workspace not found",
        404,
        "workspace check for survey",
        true
      );
    }

    const repsonse = NextResponse.next();
    repsonse.headers.set(
      "workspace",
      JSON.stringify({ workspaceId: workspace.id, userId: workspace.userId })
    );
    console.log("added workspace to headers");
    repsonse.headers.set("User-Id", res.headers.get("User-Id")!);
    return repsonse;
  } catch (error) {
    throw error;
  }
}

export const checkGroupMembershipForSurvey = async (
  _req: NextRequest,
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
    if (isNaN(userId) || !workspace || typeof workspace.userId !== "number") {
      throw new CustomError("Invalid User-Id or workspace data", 403, "survey");
    }

    const response = NextResponse.next();

    response.headers.set("User-Group-Ids", JSON.stringify(groupMembers));
    response.headers.set("workspace", JSON.stringify(workspace));
    if (workspace.userId === userId) {
      console.log("group membership check done for survey");

      return response;
    }
    if (groupMembers?.UserGroup.find((group) => group.userId === userId)) {
      console.log("group membership check done for survey");

      return response;
    }
    throw new CustomError(
      "You don't have access to this workspace",
      403,
      "workspace"
    );
  } catch (error) {
    console.error("Error in checkGroupMembershipForWorkspace:", error);
    throw error;
  }
};

export async function checkSurveyTitle(
  _req: NextRequest,
  res: NextResponse,
  name: string
) {
  try {
    newSurveySchema().parse({ name });

    const response = NextResponse.next();
    response.headers.set(
      "workspace",
      JSON.stringify(res.headers.get("workspace"))
    );
    console.log("name checking done");
    return response;
  } catch (error) {
    if (error instanceof ZodError) {
      throw new CustomError(
        "Validation Error",
        400,
        "workspace",
        true,
        "",
        validateWithSchema(error)
      );
    }
    throw error;
  }
}

export const checkSurveyExists = async (
  req: NextRequest,
  res: NextResponse,
  surveyId: string
) => {
  try {
    if (!surveyId) {
      throw new CustomError(
        "Survey Id not doesn't exists",
        400,
        "survey check",
        false
      );
    }

    const survey = await prisma.survey.findUnique({
      where: { id: surveyId },
    });

    if (!survey) {
      console.error("Survey not found for ID:", surveyId);
      throw new CustomError("Survey not found", 404, "survey check", true);
    }
    console.log("survey existense check done for survey");
    const repsonse = NextResponse.next();
    repsonse.headers.set("survey", JSON.stringify(survey));
    repsonse.headers.set(
      "User-Group-Ids",
      res.headers.get("User-Group-Ids") ?? ""
    );
    repsonse.headers.set("User-Id", res.headers.get("User-Id")!);
    return repsonse;
  } catch (error) {
    throw error;
  }
};

export const checkSurveyExistsForQuiz = async (
  _req: NextRequest,
  surveyId: string
) => {
  try {
    if (!surveyId) {
      throw new CustomError(
        "Survey Id not doesn't exists",
        400,
        "survey check",
        false
      );
    }

    const survey = await prisma.survey.findUnique({
      where: { id: surveyId },
    });

    if (!survey) {
      console.error("Survey not found for ID:", surveyId);
      throw new CustomError("Survey not found", 404, "survey check", true);
    }
    console.log("survey existense check done for quiz");
    const repsonse = NextResponse.next();

    return repsonse;
  } catch (error) {
    throw error;
  }
};

export const checkSurveyForDuplicatingOrMoving = async (
  req: NextRequest,
  res: NextResponse,
  targetWorkspaceId: string
) => {
  try {
    console.log("targetWorkspaceId", targetWorkspaceId);
    if (!targetWorkspaceId) {
      throw new CustomError(
        "Targed Workspace Not Found",
        400,
        "duplicateSurvey",
        false
      );
    }
    const targetedWorkspace = await prisma.workspace.findUnique({
      where: { id: targetWorkspaceId },
    });

    if (!targetedWorkspace) {
      console.error("Workspace not found for ID:", targetWorkspaceId);
      return NextResponse.json(
        { message: "Workspace not found" },
        { status: 404 }
      );
    }

    const response = NextResponse.next();
    console.log("checking survey for moving/duplication is done");
    return response;
  } catch (error) {
    throw error;
  }
};

export const validateSurveySettings = async (
  _req: NextRequest,
  _res: NextResponse,
  settings: SurveySettings
) => {
  try {
    const schema = surveySettingsSchema();
    schema.parse({
      ...settings,
      startTime: settings.startTime ? new Date(settings.startTime) : null,
      endTime: settings.endTime ? new Date(settings.endTime) : null,
    });
    const response = NextResponse.next();
    return response;
  } catch (error) {
    throw new CustomError(
      "Error Validating Survey Settings",
      400,
      "survey",
      true,
      "",
      validateWithSchema(error)
    );
  }
};
