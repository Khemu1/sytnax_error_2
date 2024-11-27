import { CustomError } from "@/middleware/CustomError";
import { CustomNextRequest } from "@/types";
import { WorkSpaceModel } from "@/types/survey";
import { validateWithSchema } from "@/utils/validations/validations";
import { newWorkspaceSchema } from "@/utils/validations/workspace";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

const prisma = new PrismaClient().$extends(withAccelerate());

export const validateNewWorkSpace = async (
  req: CustomNextRequest,
  res: NextResponse
) => {
  try {
    const data = await req.json();
    const schema = newWorkspaceSchema();
    schema.parse(data);

    const response = NextResponse.next();
    response.headers.set("User-Id", res.headers.get("User-Id")!);
    return response;
  } catch (error) {
    throw new CustomError(
      "Error Validating new Workspace",
      400,
      "workspace",
      true,
      "",
      validateWithSchema(error)
    );
  }
};

export async function checkWorkspaceExists(
  req: CustomNextRequest,
  res: NextResponse
) {
  try {
    const workspaceId = req.nextUrl.pathname.split("/")[4]; // Adjust index based on your route structure

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
    console.log("userGroupIdsHeader", userGroupIdsHeader);
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
    // if it's the creator
    if (workspace.userId === userId) {
      return response;
    }
    // if it's a group memeber
    if (groupMembers.includes(userId)) {
      return response;
    }

    throw new CustomError("You don't have access to this workspace", 403);
  } catch (error) {
    console.error("Error in checkGroupMembershipForWorkspace:", error);
    throw error;
  }
};

export async function checkWorkspaceTitle(req: NextRequest, res: NextResponse) {
  try {
    const { name } = await req.json();
    newWorkspaceSchema().parse({ name });
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
