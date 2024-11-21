import { SurveyModel } from "@/types/survey";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient().$extends(withAccelerate());

export const addSurveyService = async (
  workspaceId: string,
  name: string
): Promise<SurveyModel> => {
  try {
    const survey = await prisma.survey.create({
      data: {
        name,
        workspaceId,
      },
    });
    return survey;
  } catch (error) {
    throw error;
  }
};

export const deleteSurveyService = async (surveyId: string) => {
  try {
    await prisma.survey.delete({
      where: { id: surveyId },
    });
    return true;
  } catch (error) {
    throw error;
  }
};

export const updateSurveyNameService = async (
  name: string,
  surveyId: string
) => {
  try {
    const survey = await prisma.survey.update({
      where: { id: surveyId },
      data: { name },
    });
    return survey;
  } catch (error) {
    throw error;
  }
};

export const moveSuveryService = async (
  surveyId: string,
  targetWorkspaceId: string
) => {
  try {
    await prisma.survey.update({
      where: { id: surveyId },
      data: { workspaceId: targetWorkspaceId },
    });
    return true;
  } catch (error) {
    throw error;
  }
};
