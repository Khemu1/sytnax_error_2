import { CustomError } from "@/middleware/CustomError";
import { joinCourseFieldsschema } from "@/utils/validations";
import { z } from "zod";

export interface SignInProps {
  usernameOrEmail: string;
  password: string;
}
export interface SignUpProps {
  username: string;
  email: string;
  password: string;
}

export interface FileUploaderProps {
  file: File | null | undefined;
  setFile: (file: File | null) => void;
  title: string;
  initialImage?: string;
}

export interface imageDataResponse {
  status: number;
  success: boolean;
  data: {
    id: string;
    deletehash: string;
    account_id: number;
    account_url: string;
    ad_type: null;
    ad_url: null;
    title: string;
    description: string;
    name: string;
    type: string;
    width: number;
    height: number;
    size: number;
    views: null;
    section: null;
    vote: null;
    bandwidth: number;
    animated: boolean;
    favorite: boolean;
    in_gallery: boolean;
    in_most_viral: boolean;
    has_sound: boolean;
    is_ad: boolean;
    nsfw: null;
    link: string;
    tags: string[];
    datetime: number;
    mp4: string;
    hls: string;
  };
}
export interface ImageDeleteResponse {
  status: number;
  success: boolean;
  data: boolean;
}
export interface ImgurErrorResponse {
  success: boolean;
  status: number;
  message: string;
}

export type NewCourseProps = {
  title: string;
  courseImage: File;
  mindmapImage: File;
  instructorAndMentorInfo: string;
  courseInfo: string;
  price: number;
  totalSessions: number;
  totalSessionPerWeek: number;
  totalTasks: number;
};

export interface CustomErrorResponse extends CustomError {}

export interface SignInResponseProps {
  message: string;
  userId: number;
  role: number;
  username: string;
  token: string;
}

export interface PublicCardCourseProps {
  id: number;
  title: string;
  price: number;
  courseImage: string;
}

export interface PublicCourseProps {
  id: number;
  title: string;
  price: number;
  totalSessions: number;
  totalSessionPerWeek: number;
  totalTasks: number;
  courseInfo: string;
  instructorAndMentorInfo: string;
  mindmapImage: string;
}

export interface GetCourseForEditResponse {
  id: number;
  title: string;
  price: number;
  totalSessions: number;
  courseImage: string;
  totalSessionPerWeek: number;
  totalTasks: number;
  courseInfo: string;
  instructorAndMentorInfo: string;
  mindmapImage: string;
}

export type MyDataDashboard = {
  username: string;
  email: string;
};

export type OwnerDashboard = {
  id: number;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AdminDashboard = {
  id: number;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export interface EditMyAccountProps {
  username?: string;
  email?: string;
  password?: string;
}

export type CourseDashboard = {
  id: number;
  title: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
};

export interface EditCourseResponse {
  id: number;
  title: string;
  price: number;
  createdAt: Date;
  updatedAt: Date | null;
  image: boolean;
}
export interface ToastProps {
  message: string;
  type: "success" | "error";
  duration?: number;
  onClose: () => void;
}

export interface EditAdminProps {
  username: string | null;
  email: string | null;
  password: string | null;
}

export type EditCourseProps = {
  title?: string;
  courseImage?: File | null;
  mindmapImage?: File | null;
  instructorAndMentorInfo?: string;
  courseInfo?: string;
  price?: number;
  totalSessions?: number;
  totalSessionPerWeek?: number;
  totalTasks?: number;
};

export interface UrlDataModel {
  id: number;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
  courseId: number;
  url: string;
  imgurId: string;
  deleteHash: string;
  type: string;
}
export interface CourseModel {
  id: number;
  userId: number;
  title: string;
  instructorAndMentorInfo: string;
  courseInfo: string;
  price: number;
  totalSessions: number;
  totalSessionPerWeek: number;
  totalTasks: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  urlData: UrlDataModel[];
}

export type RegisterCourseFormProps = z.infer<typeof joinCourseFieldsschema>;

export type Errors = Partial<Record<keyof RegisterCourseFormProps, string>>;


export interface CountryProps {
  countryCode: string;
  dialCode: string;
  format: string;
  name: string;
}