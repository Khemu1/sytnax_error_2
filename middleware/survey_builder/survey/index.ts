import { CustomError } from "@/middleware/CustomError";
import { CustomNextRequest } from "@/types";
import { WorkSpaceModel } from "@/types/survey";
import { newSurveySchema } from "@/utils/validations/survey";
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
  workspaceId:string
) {
  try {
    if (!workspaceId) {
      return NextResponse.json(
        { message: "Workspace ID is required" },
        { status: 400 }
      );
    }
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
    });

    if (!workspace) {
      console.error("Workspace not found for ID:", workspaceId);
      return NextResponse.json(
        { message: "Workspace not found" },
        { status: 404 }
      );
    }

    const repsonse = NextResponse.next();
    repsonse.headers.set("workspace", JSON.stringify(workspace));
    repsonse.headers.set(
      "User-Group-Ids",
      res.headers.get("User-Group-Ids") ?? ""
    );
    repsonse.headers.set("User-Id", res.headers.get("User-Id")!);
    console.log("workspace existing for survey done");
    return repsonse;
  } catch (error) {
    throw error;
  }
}

export const checkGroupMembershipForWorkspace = async (
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
    let groupMembers: number[] = [];
    const userGroupIdsHeader = res.headers.get("User-Group-Ids");
    if (userGroupIdsHeader && userGroupIdsHeader.trim() !== "") {
      try {
        groupMembers = JSON.parse(userGroupIdsHeader) as number[];
        if (!Array.isArray(groupMembers)) {
          throw new Error("Invalid group members");
        }
      } catch (parseError) {
        console.error("Failed to parse User-Group-Ids header:", parseError);
        return NextResponse.json(
          { message: "Invalid User-Group-Ids header format" },
          { status: 400 }
        );
      }
    }
    const userId = +rawUserId;
    const workspace: WorkSpaceModel = JSON.parse(rawWorkspace);

    if (isNaN(userId) || !workspace || typeof workspace.userId !== "number") {
      throw new CustomError("Invalid User-Id or workspace data", 400);
    }

    const response = NextResponse.next();

    response.headers.set("User-Group-Ids", JSON.stringify(groupMembers));
    response.headers.set("workspace", JSON.stringify(workspace));
    console.log("group membership check for survey done");

    if (workspace.userId === userId) {
      return response;
    }

    if (groupMembers.includes(userId)) {
      return response;
    }

    throw new CustomError("You don't have access to this workspace", 403);
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
      return NextResponse.json(
        { message: "Survey ID is required" },
        { status: 400 }
      );
    }
    const survey = await prisma.survey.findUnique({
      where: { id: surveyId },
    });

    if (!survey) {
      console.error("Survey not found for ID:", surveyId);
      return NextResponse.json(
        { message: "Survey not found" },
        { status: 404 }
      );
    }

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

export const checkSurveyForDuplicatingOrMoving = async (
  req: NextRequest,
  res: NextResponse,
  targetWorkspaceId:string
) => {
  try {
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
    response.headers.set("User-Id", res.headers.get("User-Id")!);
    response.headers.set(
      "workspace",
      JSON.stringify(res.headers.get("workspace"))
    );
    response.headers.set("survey", JSON.stringify(res.headers.get("survey")));
    return response;
  } catch (error) {
    throw error;
  }
};
