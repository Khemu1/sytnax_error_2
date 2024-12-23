/* eslint-disable @typescript-eslint/no-explicit-any */
import { NewCourseProps, RegisterCourseFormProps } from "@/types";
import { PrismaClient } from "@prisma/client/edge";

import { withAccelerate } from "@prisma/extension-accelerate";
import { CustomError } from "@/middleware/CustomError";
import { uploadToImgur } from "./imgurServices";
import { google } from "googleapis";
import { formatDateToCustomString } from "@/utils";
import { sendRegistrationNotification } from "./emailService";
const prisma = new PrismaClient().$extends(withAccelerate());
// const prisma = new PrismaClient();

export const addCourseService = async (
  data: NewCourseProps,
  userId: number
) => {
  try {
    const {
      title,
      courseImage,
      mindmapImage,
      courseInfo,
      instructorAndMentorInfo,
      price,
      totalSessions,
      totalSessionPerWeek,
      totalTasks,
    } = data;
    const courseImageResponse = await uploadToImgur(courseImage!);
    const mindmapImageResponse = await uploadToImgur(mindmapImage!);

    const course = await prisma.course.create({
      data: {
        title,
        instructorAndMentorInfo,
        courseInfo,
        price,
        totalSessions,
        totalSessionPerWeek,
        totalTasks,
        user: {
          connect: { id: userId },
        },
        urlData: {
          create: [
            {
              url: courseImageResponse.data.link,
              imgurId: courseImageResponse.data.id,
              deleteHash: courseImageResponse.data.deletehash,
              type: "course",
            },
            {
              url: mindmapImageResponse.data.link,
              imgurId: mindmapImageResponse.data.id,
              deleteHash: mindmapImageResponse.data.deletehash,
              type: "mindmap",
            },
          ],
        },
      },
    });
    return {
      id: course.id,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
      title: course.title,
      price: course.price,
    };
  } catch (error) {
    console.error("Error creating course:", error);
    throw new CustomError(
      "An error occured while adding course",
      500,
      "course fetch",
      true
    );
  }
};

export const getAllCoursesService = async () => {
  try {
    const courses = await prisma.course.findMany({
      where: { deletedAt: null },
      include: { urlData: true },
      relationLoadStrategy: "join",
      cacheStrategy: { ttl: 60 },
    });

    const modifiedCourses = courses.map((course) => {
      const courseImages =
        course.urlData?.filter((url) => url.type === "course") || [];

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { urlData, ...Mcourse } = course;

      return {
        id: Mcourse.id,
        title: Mcourse.title,
        price: Mcourse.price,
        courseImage: courseImages.length > 0 ? courseImages[0].url : null,
      };
    });

    return modifiedCourses;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw new CustomError(
      "An error occured while fetching courses",
      500,
      "courses fetch",
      true
    );
  }
};

export const getCourseService = async (id: number) => {
  try {
    if (isNaN(id) || id === 0) {
      throw new CustomError("invalid course id", 404, "", true);
    }
    const course = await prisma.course.findFirst({
      where: { id: +id, deletedAt: null },
      relationLoadStrategy: "join",
      include: { urlData: true },
      cacheStrategy: { ttl: 60 },
    });

    if (!course?.urlData) {
      throw new CustomError(
        "course not images",
        404,
        "",
        true,
        "image object is missing"
      );
    }
    const courseImage = course.urlData.find((url) => url.type === "course");
    const mindmapImage = course.urlData.find((url) => url.type === "mindmap");
    if (!courseImage || !mindmapImage) {
      throw new CustomError(
        "course not images",
        404,
        "",
        true,
        "one of the images is missing"
      );
    }
    return {
      id: course.id,
      title: course.title,
      price: course.price,
      totalSessions: course.totalSessions,
      totalSessionPerWeek: course.totalSessionPerWeek,
      totalTasks: course.totalTasks,
      courseInfo: course.courseInfo,
      instructorAndMentorInfo: course.instructorAndMentorInfo,
      courseImage: courseImage.url,
      mindmapImage: mindmapImage.url,
    };
  } catch (error) {
    console.error("Error fetching course:", error);
    throw error;
  }
};

export const deleteCourseService = async (ids: number[]) => {
  try {
    const deletionPromises = ids.map(async (id) => {
      const findCourse = await prisma.course.findFirst({
        where: { id },
        include: {
          urlData: true, // Fetch associated urlData
        },
      });

      if (!findCourse) {
        throw new CustomError(`Course with ID ${id} not found`, 404, "", true);
      }

      await prisma.course.update({
        where: { id },
        data: {
          deletedAt: new Date(),
        },
      });

      await prisma.urlData.updateMany({
        where: { courseId: id },
        data: { deletedAt: new Date() },
      });
    });

    await Promise.all(deletionPromises);

    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const registerToCourseService = async (
  data: RegisterCourseFormProps
) => {
  const googleCredentials = {
    type: process.env.GOOGLE_TYPE,
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    auth_uri: process.env.GOOGLE_AUTH_URI,
    token_uri: process.env.GOOGLE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL,
  };

  try {
    const sheets = google.sheets("v4");
    const auth = new google.auth.GoogleAuth({
      credentials: googleCredentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const client = await auth.getClient();
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

    const staticData = [
      formatDateToCustomString(new Date()), // Column A: Date
      data.name, // Column B: Name
      null, // Column C: (not used)
      data.gpa, // Column D: GPA
      data.branch, // Column E: Branch
      data.course, // Column F: Course
      data.whatsapp, // Column G: WhatsApp
      data.email, // Column H: Email
      data.promoCode, // Column I: Promo Code
      null, // Column J: (not used)
      null, // Column K: (not used)
      null, // Column L: (not used)
      data.questions, // Column M: Questions
      data.university, // Column N: University
    ];

    const range = "A2";

    const request: any = {
      spreadsheetId: spreadsheetId,
      range: range,
      valueInputOption: "RAW",
      resource: {
        values: [staticData], // Wrap staticData in an array to fit the API requirement
      },
      auth: client,
    };

    // Await the append request to catch potential issues
    await sheets.spreadsheets.values.append(request);
    await sendRegistrationNotification(data);
    return true;
  } catch (error) {
    // Detailed logging for development
    if (process.env.NODE_ENV === "development") {
      console.error(error);
    } else {
      // Simple logging for production
      console.error("Error writing to Google Sheets");
    }

    // Throw a custom error
    throw new CustomError(
      "Failed to write data to Google Sheets",
      500,
      "data insertion",
      true
    );
  }
};
