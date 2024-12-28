import { CustomError } from "@/middleware/CustomError";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { deleteImgur } from "../imgurServices";

const prisma = new PrismaClient().$extends(withAccelerate());

export const getWorkSpacesService = async (userId: number) => {
  try {
    // getting groups that user is in
    const userGroups = await prisma.userGroup.findMany({
      where: { userId },
      select: { groupId: true },
    });
    console.log("userGroups", userGroups);

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
    const updatedGroup = {
      ...userGroupAndGroupMembers,
      groupMembers: userGroupAndGroupMembers?.UserGroup ?? [],
      UserGroup: undefined,
    };

    const groupIds = userGroups
      .map((group) => group.groupId)
      .filter((groupId) => groupId !== userGroupAndGroupMembers?.id);

    console.log("groupIds", groupIds);

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
            groupId: { in: groupIds },
          },
        },
        id: { notIn: myWorkspaces.map((ws) => ws.id) },
      },
      include: {
        surveys: true,
        WorkspaceGroup: true,
      },
    });

    console.log("groupWorkspaces", groupWorkspaces);

    const allWorkspaces = [...myWorkspaces, ...groupWorkspaces].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    return { allWorkspaces, group: updatedGroup };
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
    // todo make a helper instead

    const surveys = await prisma.survey.findMany({
      where: { workspaceId },
      include: {
        questions: {
          include: {
            questionImage: {
              select: { deleteHash: true },
            },
          },
        },
      },
    });

    await Promise.all(
      surveys.map(async (survey) => {
        await Promise.all(
          survey.questions.map(async (question) => {
            try {
              if (question.questionImage) {
                await deleteImgur(question.questionImage.deleteHash);
              }

              await prisma.question.delete({
                where: { id: question.id },
              });
            } catch (error) {
              console.error(
                `Error deleting question or image for question ID ${question.id}:`,
                error
              );
            }
          })
        );
      })
    );

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
