import { object, string, array, boolean, number } from "zod";
import { AnswersModel, CorrectAnswerModel } from "@/types/buildSurvey";

export const questionOptionsSchema = () => {
  return object({
    isDescriptionEnabled: boolean({ message: "Missing Description Option" }),
    isImageUploadEnabled: boolean({ message: "Missing image Option" }),
    allowMultipleAnswers: boolean({
      message: "Missing Multiple Answers Option",
    }),
  });
};

export const newQuestionSchema = (options: {
  isDescriptionEnabled: boolean;
  isImageUploadEnabled: boolean;
  allowMultipleAnswers: boolean;
}) => {
  return object({
    label: string()
      .min(1, { message: "Label is required" })
      .max(100, { message: "Label is too long" }),

    description: string()
      .max(300, { message: "Description is too long" })
      .optional()
      .refine(
        (val) =>
          !options.isDescriptionEnabled || (val && val.trim().length > 0),
        {
          message: "Description is required when it is enabled",
        }
      ),

    imageUrl: string()
      .optional()
      .refine(
        (val) => {
          if (!options.isImageUploadEnabled) {
            return true;
          }
          return (
            val &&
            val.match(
              /^data:image\/(jpeg|png|gif|bmp|webp);base64,[A-Za-z0-9+/=]+$/
            )
          );
        },
        {
          message:
            "Invalid image format. Only jpg, png, gif, bmp, and webp are allowed",
        }
      ),
    points: number()
      .min(1, { message: "Minimum number of points is 1" })
      .max(100, { message: "Maximum points exceeded" }),

    answers: array(string())
      .nonempty({ message: "Answers can't be empty" })
      .min(2, { message: "Minimum number of answers is 2" })
      .max(6, { message: "Maximum answers exceeded" })
      .refine(
        (answers) => answers.every((answer) => answer.trim().length > 0),
        { message: "Empty answers are not allowed" }
      )
      .refine((answers) => new Set(answers).size === answers.length, {
        message: "Duplicate answers are not allowed",
      }),

    correctAnswers: array(string())
      .nonempty({
        message: "The question must have at least one correct answer",
      })
      .max(2, { message: "Maximum correct answers exceeded" })
      .refine(
        (correctAnswers) =>
          correctAnswers.every((answer) => answer.trim().length > 0),
        { message: "A correct answer can't be empty" }
      )
      .refine(
        (correctAnswers) =>
          options.allowMultipleAnswers || correctAnswers.length === 1,
        {
          message:
            "Correct answers must be 1 if multiple answers are not allowed",
        }
      ),
  }).superRefine((data, ctx) => {
    const { correctAnswers, answers } = data;

    // Vvlidate that all correct answers exist in the answers list
    const invalidAnswers = correctAnswers.filter(
      (correctAnswer) => !answers.includes(correctAnswer)
    );

    if (invalidAnswers.length > 0) {
      ctx.addIssue({
        code: "custom",
        path: ["correctAnswers"],
        message: "All correct answers must exist in the answers list.",
      });
    }
    if (
      options.allowMultipleAnswers &&
      answers.length === 2 &&
      correctAnswers.length === 1
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["correctAnswers"],
        message: "Number correct answers must be equal 2",
      });
    }
    if (
      options.allowMultipleAnswers &&
      answers.length === 2 &&
      correctAnswers.length === 2
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["answers"],
        message: "Number of answers must be grater than two",
      });
    }
  });
};

export const editQuestionSchema = (options: {
  isDescriptionEnabled: boolean;
  isImageUploadEnabled: boolean;
  allowMultipleAnswers: boolean;
}) => {
  return object({
    id: string({ message: "Question ID is required" }),
    label: string()
      .min(1, { message: "Label is required" })
      .max(100, { message: "Label is too long" })
      .optional(),

    description: string()
      .max(300, { message: "Description is too long" })
      .optional()
      .nullable(),
    imageUrl: string().optional().nullable(),
    points: number()
      .min(1, { message: "Minimum number of points is 1" })
      .max(100, { message: "Maximum points exceeded" })
      .optional(),

    questionAnswers: array(
      object({
        id: string(),
        answer: string(),
        questionId: string(),
        createdAt: string().optional(),
        updatedAt: string().optional(),
      })
    ),

    correctAnswers: array(
      object({
        id: string(),
        questionId: string(),
        answerId: string(),
        value: string(),
        createdAt: string().optional(),
        updatedAt: string().optional(),
      })
    ),

    deletedAnswers: array(
      object({
        id: string(),
        answer: string(),
        questionId: string(),
        createdAt: string().optional(),
        updatedAt: string().optional(),
      })
    ),

    deletedCorrectAnswers: array(
      object({
        id: string(),
        questionId: string(),
        answerId: string(),
        value: string(),
        createdAt: string().optional(),
        updatedAt: string().optional(),
      })
    ),
    addedAnswers: array(string()),
    addedCorrectAnswers: array(string()),
    allowMultipleAnswers: boolean().optional(),
  })
    .refine(
      (data) => {
        const noChangesMade =
          data.deletedAnswers.length === 0 &&
          data.deletedCorrectAnswers.length === 0 &&
          equalArraysQuestionAnswers(data.addedAnswers, data.questionAnswers) &&
          equalArraysQuestionCorrectAnswers(
            data.addedCorrectAnswers,
            data.correctAnswers
          ) &&
          data.label === undefined &&
          data.description === undefined &&
          data.points === undefined &&
          data.imageUrl === undefined &&
          data.allowMultipleAnswers === undefined;

        return !noChangesMade;
      },
      {
        message: "No changes were made",
        path: ["noChange"],
      }
    )
    .superRefine((data, ctx) => {
      const issues = validateQuestionsForEdit(
        data.questionAnswers,
        data.correctAnswers,
        data.deletedAnswers,
        data.deletedCorrectAnswers,
        data.addedAnswers,
        data.addedCorrectAnswers,
        options.allowMultipleAnswers
      );

      for (const issue of issues) {
        ctx.addIssue({
          code: "custom",
          path: issue.path,
          message: issue.message,
        });
      }

      if (
        options.isDescriptionEnabled &&
        typeof data.description == "string" &&
        data.description.trim().length === 0
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["description"],
          message: "Description is enabled but missing or empty.",
        });
      }
      if (
        options.isImageUploadEnabled &&
        typeof data.imageUrl === "string" &&
        data.imageUrl.trim().length < 1
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["imageUrl"],
          message: "Image upload is enabled but no image URL is provided.",
        });
      }
      if (
        options.isImageUploadEnabled &&
        typeof data.imageUrl === "string" &&
        data.imageUrl.trim().length > 0 &&
        !data.imageUrl.match(
          /^data:image\/(jpeg|png|gif|bmp|webp);base64,[A-Za-z0-9+/=]+$/
        )
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["imageUrl"],
          message:
            "Image type is invalid only jpeg, png, gif, bmp, webp are allowed.",
        });
      }
    });
};

/**
 * this method validates the edits to the question
 * it covers the following cases:
 * 1. deleted answers exist in the questionAnswers list
 * 2. deleted correct answers exist in the correctAnswers list
 * 3. added answers are unique
 * 4. added correct answers are unique
 * 5. added correct answers are not in the added answers
 * 6. added answers are not in the added correct answers
 * 7. added correct answers are not in the deleted correct answers
 * 8. added answers are not in the deleted answers
 * 9. added answers are not in the original answers
 * 10. added correct answers are not in the original correct answers
 * 11. if multiple answers are allowed, there are more than 2 answers
 * 12. if multiple answers are allowed, there are more than 2 correct answers
 * 13. if multiple answers are allowed, there are more than 2 answers and more than 2 correct answers
 *
 * #### this method is mainly created to used in backend validation, so paths won't be able to be seen in the frontend
 * #### this method is intended to called inside zod's refine method
 *
 * @param questionAnswers
 * @param correctAnswers
 * @param deletedAnswers
 * @param deletedCorrectAnswers
 * @param addedAnswers
 * @param addedCorrectAnswers
 * @param allowMultipleAnswers
 * @returns {[{path: string[], message: string}]}
 */
const validateQuestionsForEdit = (
  questionAnswers: AnswersModel[],
  correctAnswers: CorrectAnswerModel[],
  deletedAnswers: AnswersModel[],
  deletedCorrectAnswers: CorrectAnswerModel[],
  addedAnswers: string[],
  addedCorrectAnswers: string[],
  allowMultipleAnswers: boolean
): { path: string[]; message: string }[] => {
  try {
    const issues: { path: string[]; message: string }[] = [];

    // making sure that deleted answers exist in the questionAnswers list
    if (deletedAnswers.length > 0) {
      const deletedAnswerIds = deletedAnswers.map((answer) => answer.id);
      const invalidDeletedAnswers = deletedAnswerIds.filter(
        (id) => !questionAnswers.some((answer) => answer.id === id)
      );
      if (invalidDeletedAnswers.length > 0) {
        issues.push({
          path: ["deletedAnswers"],
          message: `Invalid deleted answers. These IDs are not in the original answers: ${invalidDeletedAnswers.join(
            ", "
          )}`,
        });
      }
    }

    // naking sure that deleted correct answers exist in the correctAnswers list
    if (deletedCorrectAnswers.length > 0) {
      const deletedCorrectAnswerIds = deletedCorrectAnswers.map((ca) => ca.id);
      const invalidDeletedCorrectAnswers = deletedCorrectAnswerIds.filter(
        (id) => !correctAnswers.some((ca) => ca.id === id)
      );
      if (invalidDeletedCorrectAnswers.length > 0) {
        issues.push({
          path: ["deletedCorrectAnswers"],
          message: `Invalid deleted correct answers. These IDs are not in the original correct answers: ${invalidDeletedCorrectAnswers.join(
            ", "
          )}`,
        });
      }
    }

    // using sets to check for duplicates

    if (new Set(addedAnswers).size !== addedAnswers.length) {
      issues.push({
        path: ["addedCorrectAnswers"],
        message: "Duplicate values found in added correct answers.",
      });
    }

    if (new Set(addedCorrectAnswers).size !== addedCorrectAnswers.length) {
      issues.push({
        path: ["addedCorrectAnswers"],
        message: "Duplicate values found in added correct answers.",
      });
    }

    const missingCorrectAnswers = addedCorrectAnswers.filter(
      (ca) => !addedAnswers.includes(ca)
    );
    if (missingCorrectAnswers.length > 0) {
      issues.push({
        path: ["addedCorrectAnswers"],
        message: `The following correct answers are not present in the added answers: ${missingCorrectAnswers.join(
          ", "
        )}`,
      });
    }

    // 3 - 0 + 3
    const remainingAnswers =
      questionAnswers.length -
      deletedAnswers.length +
      addedAnswers.filter(
        (answer) => !questionAnswers.some((a) => a.answer === answer)
      ).length;
    if (remainingAnswers > 6) {
      issues.push({
        path: ["answers"],
        message:
          "Too many answers. The total number of answers cannot exceed 6.",
      });
    }
    if (remainingAnswers < 2) {
      issues.push({
        path: ["answers"],
        message:
          "Not enough answers. There must be at least 2 answers remaining after edits.",
      });
    }

    // make sure that  at least one correct answer remains after changes

    const remainingCorrectAnswers =
      correctAnswers.length -
      deletedCorrectAnswers.length +
      addedCorrectAnswers.filter(
        (answer) => !correctAnswers.some((ca) => ca.value === answer)
      ).length;
    if (remainingCorrectAnswers < 1) {
      issues.push({
        path: ["correctAnswers"],
        message:
          "The question must have at least one correct answer after edits.",
      });
    }
    if (remainingCorrectAnswers > 6) {
      issues.push({
        path: ["correctAnswers"],
        message:
          "Too many correct answers. The total number of correct answers cannot exceed 6.",
      });
    }

    // check for constraints if the the toggle is on
    if (!allowMultipleAnswers && remainingCorrectAnswers > 1) {
      issues.push({
        path: ["correctAnswers"],
        message:
          "Only one correct answer is allowed if multiple answers are not permitted.",
      });
    }
    if (
      allowMultipleAnswers &&
      remainingAnswers === 2 &&
      remainingCorrectAnswers < 2
    ) {
      issues.push({
        path: ["correctAnswers"],
        message:
          "If multiple answers are allowed and only 2 answers are present, both must be correct.",
      });
    }
    if (
      allowMultipleAnswers &&
      remainingAnswers === 2 &&
      remainingCorrectAnswers === 2
    ) {
      issues.push({
        path: ["answers"],
        message:
          "If multiple answers are allowed, there must be more than 2 total answers.",
      });
    }
    if (allowMultipleAnswers && remainingCorrectAnswers < 2) {
      issues.push({
        path: ["correctAnswers"],
        message:
          "If multiple answers are allowed, there must be two correct answers.",
      });
    }
    if (allowMultipleAnswers && remainingCorrectAnswers > 2) {
      issues.push({
        path: ["correctAnswers"],
        message:
          "If multiple answers are allowed, there must be two correct answers.",
      });
    }
    return issues;
  } catch (error) {
    throw error;
  }
};

const equalArraysQuestionAnswers = (arr1: string[], arr2: AnswersModel[]) => {
  return (
    arr1.length === arr2.length &&
    arr1.every((val) => arr2.some((obj) => obj.answer === val))
  );
};

const equalArraysQuestionCorrectAnswers = (
  arr1: string[],
  arr2: CorrectAnswerModel[]
) => {
  return (
    arr1.length === arr2.length &&
    arr1.every((val) => arr2.some((obj) => obj.value === val))
  );
};
