import { SurveySettings } from "@/types/survey";
import { filterObject } from "@/utils";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { deleteImgur, uploadQuestionToImgur } from "../imgurServices";
import { CustomError } from "@/middleware/CustomError";

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

export const returnSurveyQuizService = async (surveyId: string) => {
  try {
    console.log("surveyId", surveyId);
    const survey = await prisma.survey.findUnique({
      where: { id: surveyId },
      include: {
        questions: {
          include: {
            questionAnswers: true,
            questionImage: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });
    // is survey open || has questions  ?
    if (!survey || survey.questions.length === 0) {
      throw new CustomError(
        "Survey not found",
        404,
        "getSurveyError",
        true,
        "Survey not found",
        {}
      );
    }
    return survey;
  } catch (error) {
    throw error;
  }
};

export const returnSurveySubmissionsService = async (surveyId: string) => {
  try {
    const survey = await prisma.survey.findUnique({
      where: { id: surveyId },
      include: {
        submissions: {
          include: {
            answers: {
              include: {
                question: {
                  include: {
                    questionAnswers: true,
                    correctAnswers: true,
                    questionImage: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!survey) {
      throw new Error("Survey not found.");
    }

    return survey.submissions;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch survey submissions.");
  }
};

export const duplicateSurveyService = async (
  surveyId: string,
  targetWorkspaceId: string,
  name: string
) => {
  try {
    const survey = await prisma.survey.findUnique({
      where: { id: surveyId },
      include: {
        questions: {
          include: {
            questionAnswers: true,
            correctAnswers: true,
            questionImage: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!survey) {
      throw new CustomError("Survey does not exist", 404, "survey");
    }

    const newSurvey = await prisma.survey.create({
      data: {
        name: name,
        workspaceId: targetWorkspaceId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    await Promise.all(
      survey.questions.map(async (question) => {
        const newQuestion = await prisma.question.create({
          data: {
            label: question.label,
            description: question.description,
            allowMultipleAnswers: question.allowMultipleAnswers,
            points: question.points,
            surveyId: newSurvey.id,
          },
        });

        const createdAnswers = await Promise.all(
          question.questionAnswers.map((answer) =>
            prisma.questionAnswer.create({
              data: {
                questionId: newQuestion.id,
                answer: answer.answer,
              },
            })
          )
        );

        const correctAnswers = await Promise.all(
          question.correctAnswers.map((correctValue) => {
            const matchedAnswer = createdAnswers.find(
              (a) => a.answer === correctValue.value
            );

            if (!matchedAnswer) {
              throw new CustomError(
                `Correct answer "${correctValue.value}" does not match any provided answers.`,
                400,
                "duplicating question"
              );
            }

            return prisma.correctAnswer.create({
              data: {
                questionId: newQuestion.id,
                answerId: matchedAnswer.id,
                value: correctValue.value,
              },
            });
          })
        );

        let questionImage;
        if (question.questionImage) {
          const imageData = await uploadQuestionToImgur(
            question.questionImage.url,
            "url"
          );

          questionImage = await prisma.questionImage.create({
            data: {
              questionId: newQuestion.id,
              imgurId: imageData.data.id,
              url: imageData.data.link,
              deleteHash: imageData.data.deletehash,
            },
          });
        }

        return {
          ...newQuestion,
          correctAnswers,
          questionAnswers: createdAnswers,
          image: questionImage
            ? {
                id: questionImage.id,
                url: questionImage.url,
                questionId: newQuestion.id,
              }
            : null,
        };
      })
    );

    return newSurvey;
  } catch (error) {
    console.error("Error in duplicateSurveyService:", error);
    throw error instanceof CustomError
      ? error
      : new CustomError(
          "Unexpected error occurred.",
          500,
          "duplicating survey"
        );
  }
};
