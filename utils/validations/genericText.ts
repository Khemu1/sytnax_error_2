import { object, string, number, boolean, ZodIssueCode } from "zod";


export const genericTextSchema = (
  isFormatText: boolean,
  isFormatRegex: boolean,
  hasPlaceHolder: boolean,
  hasRegexErrorMessage: boolean,
  hideQuestionNumber: boolean,
  isDescriptionEnabled: boolean,
  isImageUploadEnabled: boolean,
  isRequired: boolean
) => {
  return object({
    label: string()
      .min(1, { message: "Label is requried" })
      .max(100, { message: "Label is too long" }),

    description: string()
      .max(300, { message: "descriptionTooLong" })
      .optional()
      .refine((val) => !isDescriptionEnabled || (val && val.length > 0), {
        message: "description is requried",
      }),

    imageUrl: string()
      .optional()
      .refine(
        (val) => {
          if (!isImageUploadEnabled) {
            return true;
          } else {
            console.log(val);
          }
          return (
            val &&
            val.match(
              /^data:image\/(jpeg|png|gif|bmp|webp);base64,[A-Za-z0-9+/=]+$/
            )
          );
        },
        {
          message: "InvalidImageFormat",
        }
      ),

    minLength: number()
      .optional()
      .refine((val) => !isFormatText || (val !== undefined && val >= 0), {
        message: "minRequired",
      }),

    maxLength: number()
      .optional()
      .refine((val) => !isFormatText || (val !== undefined && val > 0), {
        message: "maxRequired",
      }),

    isRequired: boolean()
      .optional()
      .refine((val) => !isRequired || val, {
        message: "isRequired",
      }),

    regex: string()
      .optional()
      .refine((val) => !isFormatRegex || (val && val.length > 0), {
        message: "regexAnswerFormat",
      }),

    regexPlaceHolder: string()
      .optional()
      .refine((val) => !hasPlaceHolder || (val && val.length >= 0), {
        message: "hasPlaceHolder",
      }),

    regexErrorMessage: string()
      .optional()
      .refine(
        (val) =>
          !isFormatRegex || !hasRegexErrorMessage || (val && val.length > 0),
        {
          message: "regexErrorMessageRequired",
        }
      ),

    hideQuestionNumber: boolean()
      .optional()
      .refine((val) => !hideQuestionNumber || val, {
        message: "hideQuestionNumber",
      }),
  }).superRefine((val, ctx) => {
    if (val.minLength === undefined || val.maxLength === undefined) {
      return;
    }

    if (val.minLength > val.maxLength) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: "minGreaterThanMax",
        path: ["minLength"],
      });
    }
    if (val.maxLength < val.minLength) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: "MaxLesserThanMin",
        path: ["maxLength"],
      });
    }
  });
};

export const editGenericTextSchema = (
  isFormatText: boolean,
  isFormatRegex: boolean,
  hasPlaceHolder: boolean,
  hasRegexErrorMessage: boolean,
  hideQuestionNumber: boolean,
  isDescriptionEnabled: boolean,
  isImageUploadEnabled: boolean,
  isRequired: boolean
) => {
  return object({
    label: string()
      .min(1, { message: "labelRequired" })
      .max(100, { message: "labelIsTooLong" }),

    description: string()
      .max(300, { message: "descriptionTooLong" })
      .optional()
      .nullable()
      .refine((val) => !isDescriptionEnabled || (val && val.length > 0), {
        message: "descriptionRequired",
      }),

    imageUrl: string()
      .optional()
      .nullable()
      .refine(
        (val) => {
          if (!isImageUploadEnabled || val === null || val === undefined) {
            return true;
          }

          const isValidBase64 = val.match(
            /^data:image\/(jpeg|png|gif|bmp|webp);base64,[A-Za-z0-9+/=]+$/
          );
          const isValidExternalImage = val.includes("\\uploads\\");

          return isValidBase64 || isValidExternalImage;
        },
        {
          message: "InvalidImageFormat",
        }
      ),

    minLength: number()
      .optional()
      .nullable()
      .refine(
        (val) =>
          !isFormatText || (val !== undefined && val !== null && val >= 0),
        {
          message: "minRequired",
        }
      ),

    maxLength: number()
      .optional()
      .nullable()
      .refine(
        (val) =>
          !isFormatText || (val !== undefined && val !== null && val > 0),
        {
          message: "maxRequired",
        }
      ),

    isRequired: boolean()
      .optional()
      .nullable()

      .refine((val) => !isRequired || val, {
        message: "isRequired",
      }),

    regex: string()
      .optional()
      .nullable()
      .refine(
        (val) =>
          !isFormatRegex ||
          (val !== undefined && val !== null && val.length > 0),
        {
          message: "regexAnswerFormat",
        }
      ),

    regexPlaceHolder: string()
      .optional()
      .nullable()
      .refine((val) => !hasPlaceHolder || (val && val.length >= 0), {
        message: "hasPlaceHolder",
      }),

    regexErrorMessage: string()
      .optional()
      .nullable()
      .refine(
        (val) =>
          !isFormatRegex || !hasRegexErrorMessage || (val && val.length > 0),
        {
          message: "regexErrorMessageRequired",
        }
      ),

    hideQuestionNumber: boolean()
      .optional()
      .nullable()
      .refine((val) => !hideQuestionNumber || val, {
        message: "hideQuestionNumber",
      }),
  }).superRefine((val, ctx) => {
    if (val.minLength === undefined || val.maxLength === undefined) {
      return;
    }

    if (val.maxLength && val.minLength && val.minLength > val.maxLength) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: "minGreaterThanMax",
        path: ["minLength"],
      });
    }
    if (val.maxLength && val.minLength && val.maxLength < val.minLength) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: "MaxLesserThanMin",
        path: ["maxLength"],
      });
    }
  });
};
