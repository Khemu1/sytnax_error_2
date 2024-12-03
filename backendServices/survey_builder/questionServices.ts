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
  extractAnswersToAdd,
  extractAnswersToDelete,
  extractCorrectAnswersToAdd,
  extractCorrectAnswersToDelete,
} from "@/utils/survey_builder/build/questions";
import {
  handleAnswerUpdates,
  handleCorrectAnswerUpdates,
  handleDescriptionUpdate,
  handleImageUpdate,
  handleImageUpload,
  handleLabelUpadte,
  handlePointsUpdate,
  handleToggleAllowMultipleAnswers,
} from "@/backendServices/survey_builder/helpers/question";

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

      const { correctAnswers, questionAnswers } =
        await handleCorrectAnswerUpdates(
          correactAnswersToAdd,
          correactAnswersToRemove,
          answersToAdd,
          prepQuestion,
          data.options.allowMultipleAnswers
        );
      prepQuestion.correctAnswers = correctAnswers;
      prepQuestion.questionAnswers = questionAnswers;

      const pointsUpdateData = await handlePointsUpdate(
        data.question.points,
        prepQuestion.id
      );
      prepQuestion.points = pointsUpdateData?.points;
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
    throw error;
  }
};

// helpers
export const extractChanges = (data: EditQuestionModelBackend) => {
  const { question } = data;

  return {
    answersToAdd: extractAnswersToAdd(
      question.questionAnswers,
      question.addedAnswers
    ),
    answersToRemove: extractAnswersToDelete(
      question.questionAnswers,
      question.deletedAnswers
    ),
    correactAnswersToAdd: extractCorrectAnswersToAdd(
      question.correctAnswers,
      question.addedCorrectAnswers
    ),
    correactAnswersToRemove: extractCorrectAnswersToDelete(
      question.correctAnswers,
      question.deletedCorrectAnswers
    ),
  };
};
