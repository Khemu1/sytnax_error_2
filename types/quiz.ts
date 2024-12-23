import { QuestionModel } from "./buildSurvey";

export interface QuizUserFormProps {

  phoneNumber: string;
  countryCode: string;
}

export interface participantAnswers {
  questionId: string;
  choosenAnswersIds: string[];
  values: string[];
  submissionDate: Date;
}

export type QuizFormErrors = Partial<Record<keyof QuizUserFormProps, string>>;

export interface QuizParticipantFormProps {
  userInfo: QuizUserFormProps;
  userQuizAnswers: participantAnswers[];
  questions: Omit<QuestionModel, "correctAnswers">[];
  participantId: string;
  surveyId: string;
  clean: boolean;
}
