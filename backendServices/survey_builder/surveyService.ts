import { SurveySettings } from "@/types/survey";
import { filterObject } from "@/utils";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { deleteImgur } from "../imgurServices";

const prisma = new PrismaClient().$extends(withAccelerate());

export const addSurveyService = async (workspaceId: string, name: string) => {
  try {
    console.log("name", name);
    console.log("workspaceId", workspaceId);
    const survey = await prisma.survey.create({
      data: {
        name,
        workspaceId,
        duration: 5,
        questionsPerPage: 5,
        startTime: null,
        endTime: null,
        gradesVisibility: "hidden",
      },
    });
    return survey;
  } catch (error) {
    throw error;
  }
};

export const deleteSurveyService = async (surveyId: string) => {
  // todo make a helper instead
  const questions = await prisma.question.findMany({
    where: { surveyId },
    include: {
      questionImage: {
        select: { deleteHash: true },
      },
    },
  });

  await Promise.all(
    questions.map(async (question) => {
      try {
        // delete from imgur if image exists
        if (question.questionImage) {
          await deleteImgur(question.questionImage.deleteHash);
        }

        // delete question from database
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

export const updateSurveySettingsService = async (
  surveyId: string,
  settings: SurveySettings
) => {
  console.log(surveyId);
  try {
    const allowedKeys: (keyof typeof settings)[] = [
      "questionsPerPage",
      "duration",
      "startTime",
      "endTime",
      "gradesVisibility",
    ];

    const updateData = filterObject(settings, allowedKeys);
    const survey = await prisma.survey.update({
      where: { id: surveyId },
      data: updateData as {
        questionsPerPage: number;
        duration: number;
        startTime: string;
        endTime: string;
        gradesVisibility: "hidden" | "visible" | "visibleAfterSurveyCloses";
      },
    });

    return survey;
  } catch (error) {
    throw error;
  }
};

export const updateSurveyStatusService = async (surveyId: string) => {
  try {
    const survey = await prisma.survey.update({
      where: { id: surveyId },
      data: {
        startTime: null,
        endTime: null,
      },
    });
    return survey;
  } catch (error) {
    throw error;
  }
};

export const returnSurveyForBuilderService = async (surveyId: string) => {
  try {
    const survey = await prisma.survey.findUnique({
      where: { id: surveyId },
      include: {
        questions: {
          include: {
            correctAnswers: true,
            questionAnswers: true,
            questionImage: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    return survey;
  } catch (error) {
    throw error;
  }
};
