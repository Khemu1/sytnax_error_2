import { CustomError } from "@/middleware/CustomError";
import { QuestionModel } from "@/types/buildSurvey";
import { PrismaQuestion } from "@/types/buildSurvey";
import { participantAnswers } from "@/types/quiz";

export const calcTotalScore = (
  questions: Omit<QuestionModel, "correctAnswers">[]
) => {
  try {
    let totalScore = 0;
    questions.forEach((question) => {
      totalScore += question.points;
    });
    return totalScore;
  } catch (error) {
    throw error;
  }
};

export const calcUserScore = (
  userAnswers: participantAnswers[],
  questions: PrismaQuestion[],
  accumulatePointsCallback?: (givenPoints: number) => void
): number => {
  try {
    let userScore = 0;

    userAnswers.forEach((userAnswer) => {
      const question = questions.find((q) => q.id === userAnswer.questionId);
      if (!question) {
        throw new CustomError(
          `Question with ID ${userAnswer.questionId} not found`,
          404
        );
      }

      const { allowMultipleAnswers, points, correctAnswers } = question;

      let givenPoints = 0;

      if (allowMultipleAnswers) {
        console.log("this question has multiple answers");
        let totalCorrect = 0;
        userAnswer.choosenAnswersIds.every((id) => {
          if (correctAnswers.some((correct) => correct.answerId === id)) {
            totalCorrect++;
          }
        });

        if (totalCorrect === correctAnswers.length) {
          givenPoints = points.toNumber();
        } else if (totalCorrect > 0) {
          givenPoints = points.toNumber() / 2;
        }
      } else {
        console.log("this question has only one answer");
        userAnswer.choosenAnswersIds.forEach((id) => {
          const correctAnswer = correctAnswers.find(
            (correct) => correct.answerId.trim() === id.trim()
          );

          if (correctAnswer) {
            givenPoints = points.toNumber();
          }
        });
      }

      if (accumulatePointsCallback) {
        accumulatePointsCallback(givenPoints);
      }

      userScore += givenPoints;
    });
    console.log("userScore", userScore);
    return userScore;
  } catch (error) {
    console.error("Error calculating user score:", error);
    throw error;
  }
};
