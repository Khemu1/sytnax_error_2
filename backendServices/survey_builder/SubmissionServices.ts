import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { CustomError } from "@/middleware/CustomError";
import { Decimal } from "@prisma/client/runtime/library";

const prisma = new PrismaClient().$extends(withAccelerate());

export const updateSubmissionGradesAfterAnswersUpdate = async (
  questionId: string
) => {
  try {
    // console.log(
    //   `Fetching answered questions for question ID: ${questionId} and survey ID: ${surveyId}`
    // );

    // Fetch answered questions related to this questionId and surveyId
    const answeredQuestions = await prisma.answeredQuestion.findMany({
      where: { questionId },
      include: {
        submission: true,
        question: { include: { correctAnswers: true } },
      },
    });

    const updates = answeredQuestions
      .filter((ans) => ans) // filter any null/ undefined
      .map(async (ans) => {
        const { question, selectedAnswers } = ans;
        if (!question)
          throw new CustomError("Question not found", 404, "question");
        const updateQuestionPoints = question.points.toNumber();
        let newPoints = 0;

        const choosenCorrectAnswers = question.correctAnswers.filter((ca) =>
          selectedAnswers.includes(ca.answerId)
        );

        if (
          question.allowMultipleAnswers &&
          choosenCorrectAnswers.length == 1
        ) {
          newPoints += updateQuestionPoints / 2;
        } else if (
          question.allowMultipleAnswers &&
          choosenCorrectAnswers.length == 2
        ) {
          newPoints += updateQuestionPoints;
        } else if (
          !question.allowMultipleAnswers &&
          choosenCorrectAnswers.length > 0
        ) {
          newPoints += updateQuestionPoints;
        }
        return prisma.answeredQuestion.update({
          where: { id: ans.id },
          data: { givenPoints: newPoints },
        });
      });
    await Promise.all(updates);
    const submissionIds = [
      ...new Set(answeredQuestions.map((ans) => ans.submissionId)),
    ];

    const updateTotals = await prisma.answeredQuestion.groupBy({
      by: ["submissionId"],
      where: { submissionId: { in: submissionIds } },
      _sum: { givenPoints: true },
    });
    const updateSubmissions = updateTotals.map((submission) =>
      prisma.surveySubmission.update({
        where: { id: submission.submissionId },
        data: { givenPoints: submission._sum.givenPoints || 0 },
      })
    );
    await Promise.all(updateSubmissions);
  } catch (error) {
    console.error("Error updating submission grades:", error);
    throw error;
  }
};

export const updateTotalSubmissionsScore = async (
  surveyId: string,
  deletedQuestionPoints: Decimal
) => {
  try {
    const survey = await prisma.survey.findFirst({
      where: { id: surveyId },
      include: {
        questions: true,
        submissions: true,
      },
    });
    if (!survey) {
      throw new CustomError("Survey not found", 404, "survey");
    }

    const totalPoints = survey.questions.reduce((acc, question) => {
      const questionPoints = question.points.toNumber();
      return acc + questionPoints;
    }, 0);

    console.log("new total score :", totalPoints);

    const updateSubmissions = survey.submissions.map((submission) => {
      const givenPoints = submission.givenPoints.sub(deletedQuestionPoints);
      console.log("incoming question points : ", deletedQuestionPoints);
      console.log("old given points : ", givenPoints);
      console.log("given points", givenPoints);
      return prisma.surveySubmission.update({
        where: { id: submission.id },
        data: {
          totalPoints: totalPoints,
          givenPoints,
        },
      });
    });
    await Promise.all(updateSubmissions);
  } catch (error) {
    console.error("Error updating total submissions score:", error);
    throw error;
  }
};