export interface QuestionModel {
  id: string;
  surveyId: string;
  label: string;
  description?: string;
  image?: {
    id: string;
    imgurId: string;
    url: string;
  };
  createdAt?: string;
  updatedAt?: string;
  points: number;
  correctAnswers: CorrectAnswerModel[];
  answers: AnswersModel[];
  allowMultipleAnswers: boolean;
}
export interface NewQuestionModel {
  id: string;
  surveyId: string;
  label: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  points: number;
  correctAnswers: string[];
  answers: string[];
  allowMultipleAnswers: boolean;
  isImageUploadEnabled: boolean;
  isDescriptionEnabled: boolean;
  previewImageUrl: string;
}

interface CorrectAnswerModel {
  id: string;
  questionId: string;
  answer: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AnswersModel {
  id: string;
  questionId: string;
  answer: string;
  isCorrect: boolean;
  point: number;
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
  value: string;
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
