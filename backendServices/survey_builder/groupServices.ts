import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient().$extends(withAccelerate());

export const addUserToGroupService = async (
  groupId: string,
  userId: number
) => {
  try {
    await prisma.userGroup.create({
      data: {
        groupId,
        userId,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const removeUserFromGroupService = async (
  groupId: string,
  userId: number
) => {
  try {
    await prisma.userGroup.delete({
      where: {
        // since you have this in the schema @@unique([groupId, userId])
        // this is the right way to to use the where clause with it
        groupId_userId: {
          groupId,
          userId,
        },
      },
    });
  } catch (error) {
    throw error;
  }
};
