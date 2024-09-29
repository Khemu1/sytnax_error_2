import { NewCourseProps, RegisterCourseFormProps } from "@/types";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { CustomError } from "@/middleware/CustomError";
import { uploadToImgur } from "./imgurServices";
import { google } from "googleapis";
import { formatDateToCustomString } from "@/utils";
const prisma = new PrismaClient().$extends(withAccelerate());

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
        totalSessions: Mcourse.totalSessions,
        totalSessionPerWeek: Mcourse.totalSessionPerWeek,
        totalQuizez: Mcourse.totalTasks,
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
    const course = await prisma.course.findUnique({
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
      const findCourse = await prisma.course.findUnique({
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
  try {
    const sheets = google.sheets("v4");
    const auth = new google.auth.GoogleAuth({
      keyFile: new URL(
        "@/config/syntaxerror-437019-1cad177bb001.json",
        import.meta.url
      ).toString(), // Path to your service account JSON file
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const client = await auth.getClient();
    const spreadsheetId = "1GX85BYfFIb6oBByH15MPN70rIf3k9f7rgmvwkndb_3U";

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const request: any = {
      spreadsheetId: spreadsheetId,
      range: range,
      valueInputOption: "RAW",
      resource: {
        values: [staticData], // Wrap staticData in an array to fit the API requirement
      },
      auth: client,
    };

    // Use update to write the data
    sheets.spreadsheets.values.append(request);
    return true;
  } catch (error) {
    console.error("Error writing to sheet:", error);
    throw new CustomError(
      "Failed to write data to Google Sheet",
      500,
      "data insertion",
      true
    );
  }
};
