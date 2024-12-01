export interface QuestionModel {
  id: string;
  surveyId: string;
  label: string;
  description?: string;
  questionImage?: {
    id: string;
    imgurId: string;
    url: string;
    deleteHash: boolean;
  };
  createdAt?: string;
  updatedAt?: string;
  points: number;
  correctAnswers: CorrectAnswerModel[];
  questionAnswers: AnswersModel[];
  allowMultipleAnswers: boolean;
}

export interface EditQuestionModel extends QuestionModel {
  previewImageUrl: string;
  deletedAnswers: AnswersModel[];
  deletedCorrectAnswers: Partial<CorrectAnswerModel>[];
  addedAnswers: string[];
  addedCorrectAnswers: string[];
  isDescriptionEnabled: boolean;
  isImageUploadEnabled: boolean;
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

export interface SubmissionModel {
  id: string;
  surveyId: string;
  name: string;
  phoneNumber: string;
  answers: SubmittedAnswerModel[];
  totalPoints: number;
  submittedAt: Date;
}

interface SubmittedAnswerModel {
  questionId: string;
  selectedAnswer: string;
  points: number;
}

export interface InputSwitchFieldProps {
  editorId?: string;
  label: string;
  value: string | number;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
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
