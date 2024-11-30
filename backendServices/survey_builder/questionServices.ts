import { NewQuestionModelBackend } from "@/types/buildSurvey";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { uploadQuestionToImgur } from "../imgurServices";
import { CustomError } from "@/middleware/CustomError";

const prisma = new PrismaClient().$extends(withAccelerate());

export const addQuestionService = async (
  questionData: NewQuestionModelBackend
) => {
  const { question, options } = questionData;

  try {
    const createdQuestion = await prisma.$transaction(async (prisma) => {
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
            },
          });
        })
      );
      let questionImage;
      if (options.isImageUploadEnabled && question.imageUrl) {
        const imageData = await handleImageUpload(question.imageUrl);
        console.log("Image data:", imageData);
        console.log("Question ID:", newQuestion.id);
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
        answers:createdAnswers,
        image: questionImage,
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

const handleImageUpload = async (imageUrl: string) => {
  try {
    const uploadResult = await uploadQuestionToImgur(imageUrl);
    const imageData = uploadResult?.data;

    if (!imageData?.id || !imageData.link || !imageData.deletehash) {
      console.error("Invalid Imgur response:", uploadResult);
      throw new CustomError(
        "Invalid image upload response.",
        500,
        "adding question"
      );
    }

    return {
      imgurId: imageData.id,
      url: imageData.link,
      deleteHash: imageData.deletehash,
    };
  } catch (error) {
    console.error("Error uploading image to Imgur:", error);
    throw new CustomError(
      "Failed to upload image. Please try again.",
      400,
      "adding question"
    );
  }
};
