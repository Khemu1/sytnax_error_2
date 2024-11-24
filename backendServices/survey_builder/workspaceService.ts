import { CustomError } from "@/middleware/CustomError";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient().$extends(withAccelerate());

export const getWorkSpacesService = async (userId: number) => {
  try {
    // getting groups that user is in
    const userGroups = await prisma.userGroup.findMany({
      where: { userId },
      select: { groupId: true },
    });

    const userOwnedGroup = await prisma.group.findFirst({
      where: { ownerId: userId },
    });

    const userGroupAndGroupMembers = await prisma.group.findFirst({
      where: { ownerId: userId },
      include: {
        UserGroup: {
          include: {
            user: {
              select: {
                username: true,
              },
            },
          },
        },
      },
    });

    const groupIds = userGroups
      .map((group) => group.groupId)
      .filter((groupId) => groupId !== userOwnedGroup?.id);

    const myWorkspaces = await prisma.workspace.findMany({
      where: { userId },
      include: {
        surveys: true,
      },
    });

    const groupWorkspaces = await prisma.workspace.findMany({
      where: {
        WorkspaceGroup: {
          some: {
            id: { in: groupIds },
          },
        },
        id: { notIn: myWorkspaces.map((ws) => ws.id) },
      },
      include: {
        surveys: true,
        WorkspaceGroup: true,
      },
    });

    const allWorkspaces = [...myWorkspaces, ...groupWorkspaces].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    return { allWorkspaces, group: userGroupAndGroupMembers };
  } catch (error) {
    console.error("Error fetching workspaces:", error);
    throw error;
  }
};

export const addWorkSpaceService = async (userId: number, name: string) => {
  try {
    console.log(userId, name);
    const group = await prisma.group.findFirst({ where: { ownerId: userId } });
    if (!group) {
      throw new CustomError("Error finding your group", 404, "", false);
    }

    const workspace = await prisma.workspace.create({
      data: {
        name,
        userId,
      },
    });

    await prisma.workspaceGroup.create({
      data: {
        groupId: group.id,
        workspaceId: workspace.id,
      },
    });

    return workspace;
  } catch (error) {
    throw error;
  }
};

export const deleteWorkspaceService = async (workspaceId: string) => {
  try {
    await prisma.workspace.delete({
      where: { id: workspaceId },
    });
    return true;
  } catch (error) {
    throw error;
  }
};

export const updateWorkspaceNameService = async (
  name: string,
  workspaceId: string
) => {
  try {
    const workspace = await prisma.workspace.update({
      where: { id: workspaceId },
      data: { name },
    });
    return workspace;
  } catch (error) {
    throw error;
  }
};
