import {
  editedQuestionModel,
  EditQuestionModelBackend,
  NewQuestionModelBackend,
} from "@/types/buildSurvey";
import { filterObject } from "@/utils";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { CustomError } from "@/middleware/CustomError";

import {
  extractChanges,
  handleAnswerUpdates,
  handleCorrectAnswerUpdates,
  handleDescriptionUpdate,
  handleImageUpdate,
  handleImageUpload,
  handleLabelUpadte,
  handlePointsUpdate,
  handleToggleAllowMultipleAnswers,
} from "@/backendServices/survey_builder/helpers/question";
import { deleteImgur, uploadQuestionToImgur } from "../imgurServices";
import { imageDataResponse } from "@/types";
import {
  updateSubmissionGradesAfterAnswersUpdate,
  updateTotalSubmissionsScore,
} from "./SubmissionServices";

const prisma = new PrismaClient().$extends(withAccelerate());

export const addQuestionService = async (
  questionData: NewQuestionModelBackend
) => {
  const { question, options } = questionData;

  try {
    const createdQuestion = await prisma.$transaction(async (prisma) => {
      console.log("in service");
      console.log("questionData", question.imageUrl ? true : false);
      const newQuestion = await prisma.question.create({
        data: {
          label: question.label,
          description: options.isDescriptionEnabled
            ? question.description
            : null,
          allowMultipleAnswers: options.allowMultipleAnswers,
          points: question.points,
          surveyId: questionData.surveyId,
        },
      });

      const createdAnswers = await Promise.all(
        question.answers.map((answerValue) =>
          prisma.questionAnswer.create({
            data: {
              questionId: newQuestion.id,
              answer: answerValue,
            },
          })
        )
      );

      const correctAnswers = await Promise.all(
        question.correctAnswers.map((correctValue) => {
          const matchedAnswer = createdAnswers.find(
            (a) => a.answer === correctValue
          );

          if (!matchedAnswer) {
            throw new CustomError(
              `Correct answer "${correctValue}" does not match any provided answers.`,
              400,
              "adding question"
            );
          }

          return prisma.correctAnswer.create({
            data: {
              questionId: newQuestion.id,
              answerId: matchedAnswer.id,
              value: correctValue,
            },
          });
        })
      );
      let questionImage;
      if (options.isImageUploadEnabled && question.imageUrl) {
        const imageData = await handleImageUpload(question.imageUrl);
        questionImage = await prisma.questionImage.create({
          data: {
            questionId: newQuestion.id,
            imgurId: imageData.imgurId,
            url: imageData.url,
            deleteHash: imageData.deleteHash,
          },
        });
      }

      return {
        ...newQuestion,
        correctAnswers,
        questionAnswers: createdAnswers,
        image: {
          id: questionImage?.id,
          url: questionImage?.url,
          questionId: newQuestion.id,
        },
      };
    });

    return createdQuestion;
  } catch (error) {
    console.error("Error in addQuestionService:", error);
    throw error instanceof CustomError
      ? error
      : new CustomError("Unexpected error occurred.", 500, "adding question");
  }
};

export const updateQuestionService = async (data: EditQuestionModelBackend) => {
  const prepQuestion: editedQuestionModel = { ...data.question };

  const {
    answersToAdd,
    answersToRemove,
    correactAnswersToAdd,
    correactAnswersToRemove,
  } = extractChanges(data);

  try {
    const result = await prisma.$transaction(async () => {
      prepQuestion.questionAnswers = await handleAnswerUpdates(
        answersToAdd,
        answersToRemove,
        prepQuestion
      );

      const togglerUpdateData = await handleToggleAllowMultipleAnswers(
        prepQuestion.allowMultipleAnswers,
        prepQuestion.id
      );
      prepQuestion.allowMultipleAnswers =
        togglerUpdateData?.isMultipleAnswersEnabled;
      prepQuestion.updatedAt = togglerUpdateData?.updatedAt?.toUTCString();

      const correctAnswers = await handleCorrectAnswerUpdates(
        correactAnswersToAdd,
        correactAnswersToRemove,
        prepQuestion,
        data.options.allowMultipleAnswers
      );
      prepQuestion.correctAnswers = correctAnswers;

      const pointsUpdateData = await handlePointsUpdate(
        data.question.points,
        prepQuestion.id
      );
      prepQuestion.points = pointsUpdateData?.points.toNumber();
      prepQuestion.updatedAt = pointsUpdateData?.updatedAt.toUTCString();

      const descriptionUpdateData = await handleDescriptionUpdate(
        data.question.description,
        prepQuestion.id
      );
      prepQuestion.description = descriptionUpdateData?.description;
      prepQuestion.updatedAt = descriptionUpdateData?.updatedAt.toUTCString();

      prepQuestion.questionImage = await handleImageUpdate(
        data.question.imageUrl,
        prepQuestion.id
      );

      const labelUpdateData = await handleLabelUpadte(
        data.question.label,
        prepQuestion.id
      );
      prepQuestion.label = labelUpdateData?.label;
      prepQuestion.updatedAt = labelUpdateData?.updatedAt.toUTCString();

      /**
       * id
       * surveyId
       * label
       * description
       * questionImage
       * createdAt
       * updatedAt
       * points
       * questionAnswers
       * correctAnswers
       * allowMultipleAnswers
       *
       * any undefined field wasn't shouldn't be changed
       */

      if (
        correactAnswersToAdd.length > 0 ||
        correactAnswersToRemove.length > 0
      ) {
        await updateSubmissionGradesAfterAnswersUpdate(prepQuestion.id);
      }

      const filteredQuestion = filterObject(
        { ...prepQuestion, surveyId: data.surveyId },
        [
          "id",
          "surveyId",
          "label",
          "description",
          "questionImage",
          "createdAt",
          "updatedAt",
          "points",
          "questionAnswers",
          "correctAnswers",
          "allowMultipleAnswers",
        ]
      );
      return filteredQuestion;
    });

    return result;
  } catch (error) {
    console.error("Error in updateQuestionService:", error);
    throw error;
  }
};

export const deleteQuestionService = async (
  questionId: string,
  surveyId: string
) => {
  // await updateSubmissionGradesAfterQuestionDeletion(questionId);
  try {
    const deletedQuestion = await prisma.question.findFirst({
      where: { id: questionId },
      include: {
        questionImage: {
          select: { deleteHash: true },
        },
        correctAnswers: true,
        questionAnswers: true,
      },
    });

    if (!deletedQuestion) {
      throw new CustomError("Question not found", 404, "question");
    }
    // delete if from imgur
    if (deletedQuestion.questionImage) {
      await deleteImgur(deletedQuestion.questionImage.deleteHash);
    }

    // @ts-expect-error says that image can't null
    await updateTotalSubmissionsScore(surveyId, deletedQuestion);

    await prisma.question.delete({
      where: { id: questionId },
    });

    return true;
  } catch (error) {
    console.error("Error in deleteQuestionService:", error);
    throw error;
  }
};

export const duplicateQuestionService = async (questionId: string) => {
  try {
    const result = await prisma.$transaction(async (prisma) => {
      const question = await prisma.question.findUnique({
        where: { id: questionId },
        include: {
          questionImage: true,
          questionAnswers: true,
          correctAnswers: true,
        },
      });

      if (!question) {
        throw new CustomError("Question does not exist", 404, "question");
      }

      let imageData: imageDataResponse | undefined = undefined;
      if (question.questionImage) {
        console.log(
          "this question has an image, trying to upload",
          question.questionImage
        );
        imageData = await uploadQuestionToImgur(
          question.questionImage?.url,
          "url"
        );
        console.log("image uploaded for duplication", imageData);
      }

      const newQuestion = await prisma.question.create({
        data: {
          label: question.label,
          description: question.description,
          allowMultipleAnswers: question.allowMultipleAnswers,
          points: question.points,
          surveyId: question.surveyId,
          createdAt: question.createdAt,
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
      if (question.questionImage && imageData) {
        console.log(
          "this question has an image, and it was uploaded",
          imageData
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
        questionImage: questionImage
          ? {
              id: questionImage.id,
              url: questionImage.url,
              questionId: newQuestion.id,
            }
          : null,
      };
    });

    return result;
  } catch (error) {
    console.error("Error in duplicateQuestionService:", error);
    throw error instanceof CustomError
      ? error
      : new CustomError(
          "Unexpected error occurred.",
          500,
          "duplicating question"
        );
  }
};
