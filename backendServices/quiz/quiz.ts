import { QuizParticipantFormProps } from "@/types/quiz";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { calcTotalScore, calcUserScore } from "./helpers";
import { CustomError } from "@/middleware/CustomError";

const prisma = new PrismaClient().$extends(withAccelerate());

export const addQuizParticipant = async (data: QuizParticipantFormProps) => {
  console.log("addQuizParticipant", data.clean);
  const survey = await prisma.survey.findUnique({
    where: {
      id: data.surveyId,
    },
    include: {
      questions: {
        include: {
          questionAnswers: true,
          correctAnswers: true,
        },
      },
    },
  });

  if (!survey || survey.questions.length === 0) {
    throw new CustomError("Survey not found", 404);
  }

  // Calculate the total score of the survey
  const totalScore = calcTotalScore(data.questions);

  // Calculate the user's score and accumulate total given points in the same step
  let totalGivenPoints = 0;
  calcUserScore(data.userQuizAnswers, survey.questions, (givenPoints) => {
    totalGivenPoints += givenPoints;
  });
  console.log("totalGivenPoints", totalGivenPoints);

  // Create a SurveySubmission entry with the total score and given points
  const submission = await prisma.surveySubmission.create({
    data: {
      email: data.userInfo.email,
      phoneNumber: data.userInfo.phoneNumber,
      studentId: data.userInfo.studentId,
      surveyId: data.surveyId,
      totalPoints: totalScore,
      givenPoints: totalGivenPoints,
      submittedAt: new Date(),
      cleanSubmission: data.clean,
      answers: {
        create: data.userQuizAnswers.map((userAnswer) => {
          const question = survey.questions.find(
            (q) => q.id === userAnswer.questionId
          );

          if (!question) {
            throw new CustomError(
              `Question with ID ${userAnswer.questionId} not found`,
              404
            );
          }

          const { points, correctAnswers } = question;
          let givenPoints = 0;

          // Determine the points based on the chosen answers
          if (question.allowMultipleAnswers) {
            let totalCorrect = 0;
            userAnswer.choosenAnswersIds.every((id) => {
              if (correctAnswers.some((correct) => correct.answerId === id)) {
                totalCorrect++;
              }
            });
            if (totalCorrect === correctAnswers.length) {
              givenPoints = points;
            } else if (totalCorrect > 0) {
              givenPoints = points / 2;
            }
          } else {
            const anyCorrect = userAnswer.choosenAnswersIds.some((id) =>
              correctAnswers.some((correct) => correct.id === id)
            );
            if (anyCorrect) {
              givenPoints = points;
            }
          }

          // Use the calculated `givenPoints` directly here
          return {
            questionId: userAnswer.questionId,
            QuestionPoints: points,
            givenPoints,
          };
        }),
      },
    },
  });
  const submissionData = {
    id: submission.id,
    QuizTotalScore:
      survey.gradesVisibility === "hidden" ||
      survey.gradesVisibility === "visibleAfterSurveyCloses"
        ? null
        : data.clean
        ? totalScore
        : null,
    totalUserScore:
      survey.gradesVisibility === "hidden" ||
      survey.gradesVisibility === "visibleAfterSurveyCloses"
        ? null
        : data.clean
        ? totalGivenPoints
        : null,
  };
  return submissionData;
};
