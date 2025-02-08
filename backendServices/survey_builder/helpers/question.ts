import {
  deleteImgur,
  uploadQuestionImageToImgur,
} from "@/backendServices/imgurServices";
import { CustomError } from "@/middleware/CustomError";
import {
  AnswersModel,
  CorrectAnswerModel,
  editedQuestionModel,
  EditQuestionModelBackend,
} from "@/types/buildSurvey";
import {
  extractAnswersToAdd,
  extractAnswersToDelete,
  extractCorrectAnswersToAdd,
  extractCorrectAnswersToDelete,
} from "@/utils/survey_builder/build/questions";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient({ log: ["error", "warn"] }).$extends(
  withAccelerate()
);

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

/**
 *
 * this function is used to delete or add answers that aren't correct
 **/
export const handleAnswerUpdates = async (
  answersToAdd: string[],
  answersToRemove: AnswersModel[],
  prepQuestion: editedQuestionModel
) => {
  let questionAnswers = [...prepQuestion.questionAnswers];

  console.log("Answers to Add:", answersToAdd);
  console.log("Answers to Remove:", answersToRemove);

  if (answersToAdd.length > 0) {
    const newAnswers = await addAnswers(answersToAdd, prepQuestion.id);
    questionAnswers = [...questionAnswers, ...newAnswers];
  }

  if (answersToRemove.length > 0) {
    await deleteAnswers(answersToRemove);
    questionAnswers = questionAnswers.filter(
      (qa) => !answersToRemove.some((ar) => ar.id === qa.id)
    );
  }

  return questionAnswers;
};

export const handleCorrectAnswerUpdates = async (
  correctAnswersToAdd: string[],
  correctAnswersToRemove: CorrectAnswerModel[],
  prepQuestion: editedQuestionModel,
  allowMultipleCorrectAnswers: boolean
) => {
  let correctAnswers = [...prepQuestion.correctAnswers];

  console.log("Correct Answers to Remove:", correctAnswersToRemove);
  console.log("Correct Answers to Add:", correctAnswersToAdd);

  if (correctAnswersToAdd.length > 0) {
    if (!allowMultipleCorrectAnswers && correctAnswersToAdd.length > 1) {
      throw new CustomError(
        "Only one correct answer is allowed.",
        400,
        "question",
        true
      );
    }

    const existingAnswers = prepQuestion.questionAnswers.filter((qa) =>
      correctAnswersToAdd.includes(qa.answer)
    );

    const newCorrectAnswers = correctAnswersToAdd.filter(
      (answer) => !existingAnswers.some((qa) => qa.answer === answer)
    );

    if (newCorrectAnswers.length > 0) {
      const addedAnswers = await addAnswers(newCorrectAnswers, prepQuestion.id);
      const correctAnswerAndIds = addedAnswers.map((na) => ({
        answer: na.answer,
        id: na.id,
      }));

      const addedCorrectAnswers = await addCorrectAnswers(
        correctAnswerAndIds,
        prepQuestion.id
      );

      correctAnswers = [...correctAnswers, ...addedCorrectAnswers];
    }

    if (existingAnswers.length > 0) {
      const correctAnswerAndIds = existingAnswers.map((qa) => ({
        answer: qa.answer,
        id: qa.id,
      }));

      const addedCorrectAnswers = await addCorrectAnswers(
        correctAnswerAndIds,
        prepQuestion.id
      );

      correctAnswers = [...correctAnswers, ...addedCorrectAnswers];
    }
  }

  if (correctAnswersToRemove.length > 0) {
    await deleteCorrectAnswers(correctAnswersToRemove);
    correctAnswers = correctAnswers.filter(
      (ca) => !correctAnswersToRemove.some((car) => car.id === ca.id)
    );
  }

  return correctAnswers;
};
export const addCorrectAnswers = async (
  correctAnswersToAdd: { answer: string; id: string }[],
  questionId: string
): Promise<CorrectAnswerModel[]> => {
  console.log("Adding correct answers:", correctAnswersToAdd);

  const createdAnswers: CorrectAnswerModel[] = [];

  for (const answer of correctAnswersToAdd) {
    const existingAnswer = await prisma.correctAnswer.findFirst({
      where: {
        answerId: answer.id,
        questionId: questionId,
      },
    });

    if (existingAnswer) {
      console.warn(
        `Warning: Answer "${answer.answer}" is already in the database. Skipping.`
      );
      continue;
    }

    const createdAnswer = await prisma.correctAnswer.create({
      data: {
        answerId: answer.id,
        questionId: questionId,
        value: answer.answer,
      },
    });

    createdAnswers.push({
      id: createdAnswer.id,
      questionId: createdAnswer.questionId,
      value: createdAnswer.value,
      answerId: createdAnswer.answerId,
      createdAt: createdAnswer.createdAt
        ? createdAnswer.createdAt.toUTCString()
        : undefined,
      updatedAt: createdAnswer.updatedAt
        ? createdAnswer.updatedAt.toUTCString()
        : undefined,
    });
  }

  console.log("Added Correct Answers:", createdAnswers);
  return createdAnswers;
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
  console.log("Deleting correct answers:", correctAnswersToDelete);
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
  console.log("trying to handle image update for question", questionId);
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
          "This question doesn't have an existing image, sending upload request"
        );
        const newImageData = await handleImageUpload(imageUrl);
        if (!newImageData) {
          throw new CustomError(
            "Failed to upload image to Imgur",
            500,
            "image"
          );
        }
        console.log("New image data from Imgur:", newImageData);
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
        const newImageData = await handleImageUpload(imageUrl);
        if (!newImageData) {
          throw new CustomError(
            "Failed to upload new image to Imgur",
            500,
            "image"
          );
        }
        console.log("New image data for edit from Imgur:", newImageData);

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

const updateImageRecord = async (
  questionId: string,
  imageData: { imgurId: string; deleteHash: string; url: string },
  type: "new" | "edit"
) => {
  try {
    console.log("Checking for type:", type);
    console.log("Image data before inserting/updating:", imageData);

    // Ensure the question exists
    const questionExists = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!questionExists) {
      throw new CustomError(
        `Question with ID ${questionId} not found`,
        404,
        "database"
      );
    }

    console.log("question id found for image insertion");

    let updateImage;
    if (type === "new") {
      console.log("Adding new record");
      updateImage = await prisma.questionImage.create({
        data: { ...imageData, questionId },
      });
    } else {
      console.log("Updating existing record");
      updateImage = await prisma.questionImage.update({
        where: { questionId },
        data: imageData,
      });
    }

    console.log("Database update successful:", updateImage);

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
    const uploadResult = await uploadQuestionImageToImgur(imageUrl);
    const imageData = uploadResult?.data;
    console.log("Imgur Response:", JSON.stringify(imageData, null, 2));
    if (!imageData?.id || !imageData?.link || !imageData?.deletehash) {
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
  if (isMultipleAnswersEnabled === undefined) {
    console.log("no change here", isMultipleAnswersEnabled);
    return;
  }
  try {
    console.log("updating toggler value", isMultipleAnswersEnabled);
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
