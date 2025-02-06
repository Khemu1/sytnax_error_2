import { QuestionModel, SubmissionModelForBuilder } from "@/types/buildSurvey";

export interface AuthSliceProps {
  id: number | null;
  username: string | null;
  groups: UserGroupModel[];
}

export interface SurveyModel {
  id: string;
  workspaceId: string;
  name: string;
  startTime: string | null;
  endTime: string | null;
  gradesVisibility: "hidden" | "visible" | "visibleAfterSurveyCloses";
  duration: number;
  questionsPerPage: number;
  updatedAt?: Date;
  questions: QuestionModel[];
  participants: SurveyParticipantModel[];
}

export interface SurveyStatusResponse {
  id: string;
  workspaceId: string;
  name: string;
  startTime: string | null;
  endTime: string | null;
  gradesVisibility: "hidden" | "visible" | "visibleAfterSurveyCloses";
  duration: number;
  questionsPerPage: number;
  updatedAt?: Date;
  questions: QuestionModel[];
  participants: SurveyParticipantModel[];
  closed: boolean;
  startDate?: string | null;
}

export interface SurveyParticipantModel {
  id: string;
  surveyId: string;
  submissionId: string;
  studentId: string;
  attempts: number;
  hadBeenSearched: boolean;
  createdAt: Date;
  updatedAt: Date;
  submittedAt: Date;
  survey: SurveyModel;
  submission?: SubmissionModelForBuilder;
  hasAccess: boolean;
}

export interface SurveyPreviewModel {
  id: string;
  title: string;
  isActive: boolean;
  url: string;
  workspace: number;
  createdAt?: Date;
  updatedAt?: Date;
  questions: QuestionModel[];
}

export interface GroupModel {
  id: string;
  ownerId: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  groupMembers: UserGroupModel[];
}

export interface UserModel {
  id: number;
  username: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  groupId: string;
  workspaces?: WorkSpaceModel[];
  createdGroup: GroupModel;
}

export interface UserGroupModel {
  userId: number;
  groupId: string;
  createdAt?: string;
  user: {
    username: string;
  };
}
export interface WorkSpaceModel {
  id: string;
  userId: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  surveys: SurveyModel[];
}

export interface SignInResponseProps {
  id: number;
  username: string;
  groups: UserGroupModel[];
}
export interface SignInProps {
  username: string;
  password: string;
}

export interface WorkspaceProps {
  workspace: WorkSpaceModel;
  selected: boolean;
  length: number;
  onSelect: (workspace: WorkSpaceModel) => void;
}
export interface SurveyProps {
  survey: SurveyModel;
  selected: boolean;
  onSelect: (survey: SurveyModel) => void;
}

export interface UpdateSurveyStatusResponse {
  updatedAt: Date;
  isActive: boolean;
}

export interface UpdateSurveyTitleProps {
  name: string;
  workspaceId: string;
  surveyId: string;
}

export interface UpdateSurveyTitleResponse {
  name: string;
  updatedAt: Date;
}

export interface UpdateWorkspaceTitleResponse {
  name: string;
  updatedAt: Date;
}

export interface UpdateWorkspaceDescriptionResponse {
  description: string;
  updatedAt: Date;
}

export interface UpdateWorkspaceOwnerResponse {
  ownerId: number;
  updatedAt: Date;
}

export interface SurveySettings {
  questionsPerPage: number | null;
  duration: number | null;
  startTime: string | null;
  endTime: string | null;
  gradesVisibility: "hidden" | "visible" | "visibleAfterSurveyCloses" | null;
}
