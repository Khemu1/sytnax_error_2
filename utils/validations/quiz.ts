import { object, string, number, boolean, array, date } from "zod";
import { validatePhoneNumber } from "@/utils/validations/validations";
export const newQuizSchema = () => {
  return object({
    surveyId: string()
      .min(1, "Survey ID is required")
      .max(100, "Survey ID is too long"),
    questions: array(
      object({
        id: string()
          .min(1, "Question ID is required")
          .max(100, "Question ID is too long"),
        allowMultipleAnswers: boolean({
          required_error: "Allow multiple answers field is required",
        }),
        questionAnswers: array(
          object({
            id: string()
              .min(1, "Answer ID is required")
              .max(100, "Answer ID is too long"),
            answer: string().min(1, "Answer is required"),
          })
        ),
        points: number({
          required_error: "Points is required",
        }).min(1, "Points must be greater than 0"),
      })
    ),
    userQuizAnswers: array(
      object({
        questionId: string()
          .min(1, "Question ID is required")
          .max(100, "Question ID is too long"),
        choosenAnswersIds: array(string()),
        values: array(string()),
      })
    ),
    submissionDate: date({ required_error: "Submission date is required" }),
  }).superRefine((data, ctx) => {
    const { questions, userQuizAnswers } = data;
    if (questions.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["questions"],
        message: "Questions are required",
      });
    }
    userQuizAnswers.forEach((userAnswer, index) => {
      const question = questions.find((q) => q.id === userAnswer.questionId);

      if (!question) {
        ctx.addIssue({
          code: "custom",
          path: [`userQuizAnswers[${index}].questionId`],
          message: "Invalid question ID",
        });
        return;
      }

      // check of for ids of chosen answers
      const invalidAnswerId = userAnswer.choosenAnswersIds?.find(
        (answerId) => !question.questionAnswers.some((a) => a.id === answerId)
      );

      if (invalidAnswerId) {
        ctx.addIssue({
          code: "custom",
          path: [`userQuizAnswers[${index}].choosenAnswersId`],
          message: `Answer ID '${invalidAnswerId}' is invalid for the question`,
        });
      }

      if (
        (userAnswer.choosenAnswersIds.length > 2 ||
          userAnswer.values.length > 2) &&
        !question.allowMultipleAnswers
      ) {
        ctx.addIssue({
          code: "custom",
          path: [`userQuizAnswers[${index}].choosenAnswersId`],
          message: `You can only choose 2 answers for this question`,
        });
      }
      // chek for answer values
      const invalidValue = userAnswer.values?.find(
        (value) => !question.questionAnswers.some((a) => a.answer === value)
      );

      if (invalidValue) {
        ctx.addIssue({
          code: "custom",
          path: [`userQuizAnswers[${index}].values`],
          message: `Answer value '${invalidValue}' is invalid for the question`,
        });
      }
    });
  });
};

export const quizUserFormschema = () => {
  return object({
    phoneNumber: string().min(1, "WhatsApp number is required"),
    email: string({ required_error: "Email is required" }).email({
      message: "Invalid email address",
    }),
    studentId: string().min(1, "Student ID is required"),
    countryCode: string().min(1, "Country code is required"),
  }).superRefine((val, ctx) => {
    const { phoneNumber, countryCode, studentId } = val;
    if (!validatePhoneNumber(phoneNumber, countryCode)) {
      ctx.addIssue({
        code: "custom",
        message: "Invalid WhatsApp number",
        path: ["phoneNumber"],
      });
    }
    // 2201576
    if (!studentId.match(/^\d{7}$/)) {
      ctx.addIssue({
        code: "custom",
        message: "Invalid Student ID: Must be 7 digits long.",
        path: ["studentId"],
      });
    }
  });
};
