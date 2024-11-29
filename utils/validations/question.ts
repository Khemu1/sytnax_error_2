import { object, string, array } from "zod";

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

    // Validate that all correct answers exist in the answers list
    const invalidAnswers = correctAnswers.filter(
      (correctAnswer) => !answers.includes(correctAnswer)
    );

    if (invalidAnswers.length > 0) {
      ctx.addIssue({
        code: "custom",
        message: "All correct answers must exist in the answers list.",
      });
    }
  });
};
