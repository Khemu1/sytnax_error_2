import {
  deleteImgur,
  uploadQuestionToImgur,
} from "@/backendServices/imgurServices";
import { CustomError } from "@/middleware/CustomError";
import {
  AnswersModel,
  CorrectAnswerModel,
  editedQuestionModel,
} from "@/types/buildSurvey";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient().$extends(withAccelerate());

export const handleAnswerUpdates = async (
  answersToAdd: string[],
  answersToRemove: AnswersModel[],
  prepQuestion: editedQuestionModel
) => {
  let questionAnswers = [...prepQuestion.questionAnswers];

  if (answersToAdd.length > 0) {
    const newAnswers = await addAnswers(answersToAdd, prepQuestion.id);
    questionAnswers = [...questionAnswers, ...newAnswers];
  }

  if (answersToRemove.length > 0) {
    await deleteAnswers(answersToRemove);
    questionAnswers = questionAnswers.filter(
      (a) => !answersToRemove.some((ar) => ar.id === a.id)
    );
  }

  return questionAnswers;
};

export const handleCorrectAnswerUpdates = async (
  correctAnswersToAdd: string[],
  correctAnswersToRemove: CorrectAnswerModel[],
  answersToAdd: string[],
  prepQuestion: editedQuestionModel,
  allowMultipleCorrectAnswers: boolean
) => {
  let correctAnswers = [...prepQuestion.correctAnswers];
  let questionAnswers = [...prepQuestion.questionAnswers];

  // Add correct answers
  if (correctAnswersToAdd.length > 0) {
    if (answersToAdd.length + correctAnswersToAdd.length > 6) {
      throw new CustomError(
        "Maximum of 6 answers allowed.",
        400,
        "question",
        true
      );
    }

    const answersToInsert = correctAnswersToAdd.filter(
      (ca) => !questionAnswers.some((qa) => qa.answer === ca)
    );

    if (answersToInsert.length > 0) {
      const newAnswers = await addAnswers(answersToInsert, prepQuestion.id);
      questionAnswers = [...questionAnswers, ...newAnswers];

      const correctAnswerAndIds = newAnswers.map((na) => ({
        answer: na.answer,
        id: na.id,
      }));

      const addedCorrectAnswers = await addCorrectAnswers(
        correctAnswerAndIds,
        prepQuestion.id
      );

      correctAnswers = [...correctAnswers, ...addedCorrectAnswers];
    }

    const existingAnswers = correctAnswersToAdd.filter((ca) =>
      questionAnswers.some((qa) => qa.answer === ca)
    );

    const correctAnswerAndIds = existingAnswers
      .map((ca) => {
        const match = questionAnswers.find((qa) => qa.answer === ca);
        return match ? { answer: ca, id: match.id } : null;
      })
      .filter((itme) => itme !== null);

    if (correctAnswerAndIds.length > 0) {
      if (!allowMultipleCorrectAnswers && correctAnswerAndIds.length > 1) {
        throw new CustomError(
          "Only one correct answer is allowed.",
          400,
          "question",
          true
        );
      }

      const addedCorrectAnswers = await addCorrectAnswers(
        correctAnswerAndIds,
        prepQuestion.id
      );

      correctAnswers = [...correctAnswers, ...addedCorrectAnswers];
    }
  }

  // Remove correct answers
  if (correctAnswersToRemove.length > 0) {
    await deleteCorrectAnswers(correctAnswersToRemove);
    correctAnswers = correctAnswers.filter(
      (ca) => !correctAnswersToRemove.some((car) => car.id === ca.id)
    );

    const idsToRemove = correctAnswersToRemove.map((car) => car.id);
    questionAnswers = questionAnswers.filter(
      (qa) => !idsToRemove.includes(qa.id)
    );
  }

  return { correctAnswers, questionAnswers };
};

export const addCorrectAnswers = async (
  correctAnswersToAdd: { answer: string; id: string }[],
  questionId: string
): Promise<CorrectAnswerModel[]> => {
  console.log("adding correct answers", correctAnswersToAdd);
  const createdAnswers = await Promise.all(
    correctAnswersToAdd.map((a) =>
      prisma.correctAnswer.create({
        data: {
          answerId: a.id,
          questionId: questionId,
          value: a.answer,
        },
      })
    )
  );

  const modifiedAnswers: CorrectAnswerModel[] = createdAnswers.map((ca) => ({
    id: ca.id,
    questionId: ca.questionId,
    value: ca.value,
    answerId: ca.answerId,
    createdAt: ca.createdAt ? ca.createdAt.toUTCString() : undefined,
    updatedAt: ca.updatedAt ? ca.updatedAt.toUTCString() : undefined,
  }));
  console.log("added", modifiedAnswers);
  return modifiedAnswers;
};

export const addAnswers = async (
  answersToAdd: string[],
  questionId: string
): Promise<AnswersModel[]> => {
  const createdAnswers = await Promise.all(
    answersToAdd.map((answerValue) =>
      prisma.questionAnswer.create({
        data: {
          questionId: questionId,
          answer: answerValue,
        },
      })
    )
  );

  const modifiedAnswers: AnswersModel[] = createdAnswers.map((ca) => ({
    id: ca.id,
    questionId: ca.questionId,
    answer: ca.answer,
    createdAt: ca.createdAt ? ca.createdAt.toUTCString() : undefined,
    updatedAt: ca.updatedAt ? ca.updatedAt.toUTCString() : undefined,
  }));

  return modifiedAnswers;
};

export const deleteAnswers = async (answersToDelete: AnswersModel[]) => {
  await Promise.all(
    answersToDelete.map((answer) =>
      prisma.questionAnswer.delete({
        where: {
          id: answer.id,
        },
      })
    )
  );
};

const deleteCorrectAnswers = async (
  correctAnswersToDelete: CorrectAnswerModel[]
) => {
  await Promise.all(
    correctAnswersToDelete.map((answer) =>
      prisma.correctAnswer.delete({
        where: {
          id: answer.id,
        },
      })
    )
  );
};

export const handleLabelUpadte = async (
  label: string | undefined,
  questionId: string
) => {
  if (label) {
    const updateLabel = await prisma.question.update({
      where: { id: questionId },
      data: {
        label,
        updatedAt: new Date(),
      },
    });
    return { label: updateLabel.label!, updatedAt: updateLabel.updatedAt! };
  }
};

export const handleImageUpdate = async (
  imageUrl: string | undefined | null,
  questionId: string
) => {
  console.log("trying to handle image update", questionId);
  if (imageUrl === undefined) return;

  try {
    let image = undefined;
    if (imageUrl === null) {
      console.log("Deleting image since imageUrl is null");
      const imageData = await prisma.questionImage.delete({
        where: { questionId },
        select: { deleteHash: true },
      });
      if (!imageData) {
        throw new CustomError("Image not found in the database", 404, "image");
      }
      console.log("image deleted from the db now removing from imgur");
      await deleteImageFromImgur(imageData.deleteHash);
    } else {
      console.log(
        "Looking for image to edit or upload using questionId:",
        questionId
      );
      const imageData = await prisma.questionImage.findUnique({
        where: { questionId },
      });

      if (!imageData) {
        //adding new image
        console.log(
          "This question doesn't have an existing image, uploading..."
        );
        const newImageData = await uploadImageToImgur(imageUrl);
        if (!newImageData) {
          throw new CustomError(
            "Failed to upload image to Imgur",
            500,
            "image"
          );
        }
        console.log("Updating image record");
        image = await updateImageRecord(questionId, newImageData, "new");
        if (!image) {
          throw new CustomError(
            "Failed to update image record after upload",
            500,
            "image"
          );
        }
      } else {
        // update the iamge
        console.log("Existing image found. Deleting old image...");
        await deleteImageFromImgur(imageData.deleteHash);

        console.log("Uploading new image...");
        const newImageData = await uploadImageToImgur(imageUrl);
        if (!newImageData) {
          throw new CustomError(
            "Failed to upload new image to Imgur",
            500,
            "image"
          );
        }

        image = await updateImageRecord(questionId, newImageData, "edit");
        if (!image) {
          throw new CustomError(
            "Failed to update image record after replacing",
            500,
            "image"
          );
        }
      }
    }

    return image;
  } catch (error) {
    console.error("Error handling image update:", error);
    throw new CustomError("Failed to handle image update.", 500, "image", true);
  }
};

const deleteImageFromImgur = async (deleteHash: string): Promise<void> => {
  try {
    await deleteImgur(deleteHash);
    console.log("Image deleted from Imgur");
  } catch (error) {
    console.error("Error deleting image from Imgur:", error);
    throw new CustomError(
      "Failed to delete image from Imgur.",
      500,
      "imgur",
      true
    );
  }
};

const uploadImageToImgur = async (imageUrl: string) => {
  try {
    return await handleImageUpload(imageUrl);
  } catch (error) {
    console.error("Error uploading image to Imgur:", error);
    throw new CustomError(
      "Failed to upload image to Imgur.",
      500,
      "imgur",
      true
    );
  }
};

const updateImageRecord = async (
  questionId: string,
  imageData: { imgurId: string; deleteHash: string; url: string },
  type: "new" | "edit"
) => {
  try {
    console.log("checking for type");
    let updateImage;
    if (type === "new") {
      console.log("addign new record");
      updateImage = await prisma.questionImage.create({
        data: { ...imageData, questionId },
      });
    } else {
      console.log("updating existing record");
      updateImage = await prisma.questionImage.update({
        where: { questionId },
        data: imageData,
      });
    }
    return { id: updateImage.id, questionId, url: updateImage.url };
  } catch (error) {
    console.error("Error updating image record in database:", error);
    throw new CustomError(
      "Failed to update image record.",
      500,
      "database",
      true
    );
  }
};

export const handleImageUpload = async (imageUrl: string) => {
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
    console.log("Image uploaded to Imgur and now returning data");
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

export const handlePointsUpdate = async (
  points: number | undefined,
  questionId: string
) => {
  if (!points) return;

  try {
    const updatePoints = await prisma.question.update({
      where: { id: questionId },
      data: {
        points,
        updatedAt: new Date(),
      },
    });
    return { points: updatePoints.points!, updatedAt: updatePoints.updatedAt! };
  } catch (error) {
    console.error("Error updating points in database:", error);
    throw new CustomError("Failed to update points.", 500, "database", true);
  }
};

export const handleDescriptionUpdate = async (
  description: string | undefined | null,
  questionId: string
) => {
  if (description === undefined) return;

  try {
    let updateDescription;
    if (description === null) {
      updateDescription = await prisma.question.update({
        where: { id: questionId },
        data: {
          description: null,
          updatedAt: new Date(),
        },
      });
    } else {
      updateDescription = await prisma.question.update({
        where: { id: questionId },
        data: {
          description,
          updatedAt: new Date(),
        },
      });
    }
    return {
      description: updateDescription.description!,
      updatedAt: updateDescription.updatedAt!,
    };
  } catch (error) {
    console.error("Error updating description in database:", error);
    throw new CustomError(
      "Failed to update description.",
      500,
      "database",
      true
    );
  }
};

export const handleToggleAllowMultipleAnswers = async (
  isMultipleAnswersEnabled: boolean | undefined,
  questionId: string
) => {
  if (isMultipleAnswersEnabled===undefined) {
    console.log("no change here",isMultipleAnswersEnabled)
    return;
  }
  try {
    console.log("updating toggler value",isMultipleAnswersEnabled)
    const updateQuestion = await prisma.question.update({
      where: {
        id: questionId,
      },
      data: {
        allowMultipleAnswers: isMultipleAnswersEnabled,
        updatedAt: new Date(),
      },
    });

    return {
      isMultipleAnswersEnabled: updateQuestion.allowMultipleAnswers!,
      updatedAt: updateQuestion.updatedAt,
    };
  } catch (error) {
    console.error("Error updating multiple answers in database:", error);
    throw new CustomError(
      "Failed to update multiple answers.",
      500,
      "database",
      true
    );
  }
};
