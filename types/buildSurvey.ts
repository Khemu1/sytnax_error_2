import { Decimal } from "@prisma/client/runtime/library";
import { SurveyParticipantModel } from "./survey";

export interface PrismaQuestion {
  id: string;
  surveyId: string;
  label: string;
  description?: string | null;
  allowMultipleAnswers: boolean;
  points: Decimal;
  correctAnswers: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    questionId: string;
    answerId: string;
    value: string;
  }[];
  questionAnswers: {
    id: string;
    createdAt: Date | null;
    updatedAt: Date | null;
    questionId: string;
    answer: string;
  }[];
}
export interface QuestionModel {
  id: string;
  surveyId: string;
  label: string;
  description?: string | null;
  questionImage?: {
    id: string;
    questionId: string;
    url: string;
  };
  createdAt?: string;
  updatedAt?: string;
  points: number;
  correctAnswers: CorrectAnswerModel[];
  questionAnswers: AnswersModel[];
  allowMultipleAnswers: boolean;
}

export interface SubmissionModelForBuilder {
  id: string;
  surveyId: string;
  participantId: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: Date;
  totalPoints: number;
  givenPoints: number;
  submittedAt: Date;
  cleanSubmission: boolean;
  answers: AnsweredQuestion[];
  surveyParticipant: SurveyParticipantModel;
}

export interface AnsweredQuestion {
  id: string;
  selectedAnswers: string[];
  questionId: string;
  submissionId: string;
  QuestionPoints: number;
  givenPoints: number;
  createdAt: Date;
  updatedAt: Date;
  question: QuestionModel;
}

export interface editedQuestionModel {
  id: string;
  surveyId: string;
  label?: string;
  description?: string | null;
  allowMultipleAnswers?: boolean;
  createdAt?: string;
  updatedAt?: string;
  points?: number;
  questionImage?: {
    id: string;
    questionId: string;
    url: string;
  };
  correctAnswers: CorrectAnswerModel[];
  questionAnswers: AnswersModel[];
}

export interface updatedQuestionModel {
  id: string;
  surveyId: string;
  label?: string;
  description?: string;
  questionImage?: {
    id: string;
    questionId: string;
    url: string;
  };
  createdAt?: string;
  updatedAt?: string;
  points?: number;
  correctAnswers: CorrectAnswerModel[];
  questionAnswers: AnswersModel[];

  allowMultipleAnswers?: boolean;
}

export interface EditQuestionSlice {
  labelEdit: string;
  descriptionEdit: string;
  isImageUploadEnabled: boolean;
  isDescriptionEnabled: boolean;
  previewImageUrlEdit: string;
  deletedAnswers: AnswersModel[];
  deletedCorrectAnswers: Partial<CorrectAnswerModel>[];
  addedAnswers: string[];
  addedCorrectAnswers: string[];
  questionAnswers: AnswersModel[];
  correctAnswers: CorrectAnswerModel[];
  pointsEdit: number;
  allowMultipleAnswers: boolean;
}

export interface EditQuestionModel extends QuestionModel {
  description?: string | null;
  imageUrl: string | null;
  previewImageUrl: string | null;
  deletedAnswers: AnswersModel[];
  deletedCorrectAnswers: CorrectAnswerModel[];
  addedAnswers: string[];
  allowMultipleAnswers: boolean;
  addedCorrectAnswers: string[];
  isDescriptionEnabled: boolean;
  isImageUploadEnabled: boolean;
}
export interface EditQuestionModelBackend {
  question: EditQuestionModel;
  options: QuestionOptions;
  workspaceId: string;
  surveyId: string;
}
export interface NewQuestionModel {
  label: string;
  description?: string;
  points: number;
  correctAnswers: string[];
  answers: string[];
  allowMultipleAnswers: boolean;
  isImageUploadEnabled: boolean;
  isDescriptionEnabled: boolean;
  previewImageUrl: string;
}
export interface QuestionOptions {
  isDescriptionEnabled: boolean;
  isImageUploadEnabled: boolean;
  allowMultipleAnswers: boolean;
}

export interface NewQuestionModelBackend {
  question: {
    label: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
    points: number;
    correctAnswers: string[];
    answers: string[];
    imageUrl?: string;
  };
  options: {
    allowMultipleAnswers: boolean;
    isImageUploadEnabled: boolean;
    isDescriptionEnabled: boolean;
  };
  workspaceId: string;
  surveyId: string;
}

export interface CorrectAnswerModel {
  id: string;
  questionId: string;
  answerId: string;
  value: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AnswersModel {
  id: string;
  questionId: string;
  answer: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface InputSwitchFieldProps {
  editorId?: string;
  label: string;
  value: string | number;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onChangeEditor: (() => void) | ((e: string) => void);
  switchChecked?: boolean;
  onSwitchChange?: (checked: boolean) => void;
  placeholder?: string;
  disabled?: boolean;
  isSubmitting?: boolean;
  hasSwitch: boolean;
  required: boolean;
  errorMessage?: string;
  type: string;
  border: boolean;
}

export interface FileUploaderProps {
  filePath?: string;
  file: File | null | undefined;
  setFile: (file: File | null) => void;
  title: string;
  initialImage?: string;
}
