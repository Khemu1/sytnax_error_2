import { QuizParticipantFormProps } from "@/types/quiz";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { calcTotalScore, calcUserScore } from "./helpers";
import { CustomError } from "@/middleware/CustomError";

const prisma = new PrismaClient().$extends(withAccelerate());

export const addQuizParticipant = async (data: QuizParticipantFormProps) => {
  console.log("Chosen Answers Ids:", data.userQuizAnswers);

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

  // Initialize totalGivenPoints to accumulate points
  let totalGivenPoints = 0;

  // Use calcUserScore to calculate the total given points
  totalGivenPoints = calcUserScore(
    data.userQuizAnswers,
    survey.questions,
    (givenPoints) => {
      totalGivenPoints += givenPoints;
    }
  );

  console.log("Total Given Points:", totalGivenPoints);

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
            userAnswer.choosenAnswersIds.forEach((id) => {
              const correctAnswer = correctAnswers.find(
                (correct) => correct.answerId.trim() === id.trim()
              );

              if (correctAnswer) {
                givenPoints = points;
              }
            });
          }

          return {
            questionId: userAnswer.questionId,
            QuestionPoints: points,
            givenPoints,
            selectedAnswers: userAnswer.choosenAnswersIds,
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
    clean: data.clean,
  };

  return submissionData;
};

export const getQuizSubmission = async (quizId: string) => {
  try {
    const submission = await prisma.surveySubmission.findUnique({
      where: { id: quizId },
      select: {
        totalPoints: true,
        givenPoints: true,
        cleanSubmission: true,
        survey: {
          select: {
            name: true,
            startTime: true,
            endTime: true,
            gradesVisibility: true,
          },
        },
      },
    });
    console.log("survey", submission?.survey);
    if (!submission) {
      throw new CustomError("Quiz not found", 404);
    }

    const { cleanSubmission, survey, totalPoints, givenPoints } = submission;

    const data: {
      totalPoints: number | null;
      givenPoints: number | null;
      cleanSubmission: boolean | null;
      gradesVisibility: "hidden" | "visibleAfterSurveyCloses" | "visible";
      isOpen: boolean;
      endTime: string | null;
    } = {
      totalPoints: null,
      givenPoints: null,
      cleanSubmission: submission.cleanSubmission,
      gradesVisibility: survey.gradesVisibility,
      isOpen: false,
      endTime: null,
    };

    const currentTime = new Date();
    const surveyEndTime = survey.endTime ? new Date(survey.endTime) : null;

    if (!cleanSubmission) {
      return data;
    }

    switch (survey.gradesVisibility) {
      case "hidden":
        return data;

      case "visibleAfterSurveyCloses":
        if (!survey.startTime || !surveyEndTime) {
          // the survey is cloed , show grades
          data.isOpen = false;
          data.totalPoints = totalPoints;
          data.givenPoints = givenPoints;
          return data;
        }
        data.isOpen = currentTime < surveyEndTime;
        // closed show grades
        if (!data.isOpen) {
          data.isOpen = false;
          data.totalPoints = totalPoints;
          data.givenPoints = givenPoints;
          return data;
        }
        data.isOpen = true;
        data.endTime = surveyEndTime.toUTCString();
        return data;

      case "visible":
        data.totalPoints = totalPoints;
        data.givenPoints = givenPoints;
        break;
    }

    data.cleanSubmission = cleanSubmission;

    return data;
  } catch (error) {
    throw error;
  }
};
