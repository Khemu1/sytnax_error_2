import { PrismaClient } from "@prisma/client/edge";
// import { PrismaClient } from "@prisma/client";

import { CustomError } from "@/middleware/CustomError";
import { withAccelerate } from "@prisma/extension-accelerate";
import {
  CourseModel,
  EditAdminProps,
  EditMyAccountProps,
  SignUpProps,
} from "@/types";
import bcrypt from "bcrypt";
import { deleteImgur, uploadICourseImageToImgur } from "./imgurServices";

const prisma = new PrismaClient().$extends(withAccelerate());
// const prisma = new PrismaClient();

export const dashboardCoursesService = async () => {
  try {
    const courses = await prisma.course.findMany({
      relationLoadStrategy: "join",
      //cacheStrategy:{ttl:60},
      where: {
        deletedAt: null,
      },
      select: {
        id: true,
        title: true,
        user: {
          select: {
            username: true,
          },
        },
        createdAt: true,
        updatedAt: true,
        price: true,
      },
    });

    return courses;
  } catch (error) {
    throw new CustomError(
      "An error occured while fetching dashboard courses",
      500,
      "dashboard courses fetch",
      true
    );
  }
};
export const dashboardAllCourseDataService = async (id: number) => {
  try {
    if (isNaN(id) || id === 0) {
      throw new CustomError("invalid course id", 404, "", true);
    }
    const course = await prisma.course.findUniqueOrThrow({
      where: { id: +id, deletedAt: null },
      include: { urlData: true },
      relationLoadStrategy: "join",
      cacheStrategy: { ttl: 60 },
    });

    if (!course.urlData) {
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
    throw error;
  }
};

export const dashboardEditCourseService = async (
  id: number,
  courseData: Record<string, string | number | object>
) => {
  try {
    const hasFiles = ["courseImage", "mindmapImage"].filter(
      (key) => courseData[key]
    );

    const actualValues = Object.entries(courseData).reduce(
      (acc, [key, value]) => {
        // Only include values that differ from the existing course
        acc[key] = value;
        return acc;
      },
      {} as Record<string, string | number | object>
    );

    // Update course details if there are changes
    const updatedCourse = await prisma.course.update({
      where: { id },
      data: {
        ...actualValues,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        title: true,
        price: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Handle file deletions
    if (hasFiles.length > 0) {
      hasFiles.forEach((type) => {
        if (type === "courseImage") {
          deleteCourseImage(
            updatedCourse as CourseModel,
            courseData.courseImage as File
          );
        }
        if (type === "mindmapImage") {
          deleteMindmapImage(
            updatedCourse as CourseModel,
            courseData.mindmapImage as File
          );
        }
      });
    }

    return {
      ...updatedCourse,
      image: hasFiles.length > 0,
    };
  } catch (error) {
    if (error instanceof CustomError) {
      throw error; // Rethrow known custom errors
    }
    throw new CustomError(
      "An error occurred while updating the course",
      500,
      "update course",
      true
    );
  }
};

const deleteCourseImage = async (findCourse: CourseModel, file: File) => {
  try {
    for (const data of findCourse.urlData) {
      if (data.type === "course") {
        // Delete the existing image
        await deleteImgur(data.deleteHash);

        // Upload the new image
        const uploadResult = await uploadICourseImageToImgur(file);

        const newImageData = {
          deleteHash: uploadResult.data.deletehash,
          imgurId: uploadResult.data.id,
          url: uploadResult.data.link,
        };

        // Update the database record
        await prisma.urlData.update({
          where: { id: data.id },
          data: {
            ...newImageData,
            updatedAt: new Date(),
          },
        });
      }
    }
  } catch (err) {
    throw new CustomError(
      "faild to delete course image",
      500,
      "couse image deletion",
      true
    );
  }
};

const deleteMindmapImage = async (findCourse: CourseModel, file: File) => {
  try {
    for (const data of findCourse.urlData) {
      if (data.type === "mindmap") {
        await deleteImgur(data.deleteHash);

        // Upload the new image
        const uploadResult = await uploadICourseImageToImgur(file);

        const newImageData = {
          deleteHash: uploadResult.data.deletehash,
          imgurId: uploadResult.data.id,
          url: uploadResult.data.link,
        };

        // Update the database record
        await prisma.urlData.update({
          where: { id: data.id },
          data: {
            ...newImageData,
            updatedAt: new Date(),
          },
        });
      }
    }
  } catch (err) {
    throw new CustomError(
      "faild to delete mindmap image",
      500,
      "mindmap image deletion",
      true
    );
  }
};

export const dashboardAdminsService = async () => {
  try {
    const adminRole = await prisma.role.findFirst({
      where: {
        name: "admin",
      },
      select: { id: true },
      relationLoadStrategy: "join",
      cacheStrategy: { ttl: 60 },
    });
    if (!adminRole) {
      throw new CustomError("Admin role not found", 404, "role lookup", true);
    }
    const admins = await prisma.user.findMany({
      where: { userRole: { roleId: adminRole.id }, deletedAt: null },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return admins;
  } catch (error) {
    throw error;
  }
};

export const dashboardNewAdminsService = async (adminData: SignUpProps) => {
  try {
    return await prisma.$transaction(async (prisma) => {
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ username: adminData.username }, { email: adminData.email }],
        },
      });

      if (existingUser?.email === adminData.email) {
        const errors = {
          email: "Email already exists.",
        };
        throw new CustomError(
          "User already exists",
          409,
          "user creation",
          true,
          "",
          errors
        );
      } else if (existingUser?.username === adminData.username) {
        const errors = {
          username: "Username already exists.",
        };
        throw new CustomError(
          "User already exists",
          409,
          "user creation",
          true,
          "",
          errors
        );
      }

      const hashedPassword = bcrypt.hashSync(adminData.password, 10);

      const newAdmin = await prisma.user.create({
        data: {
          username: adminData.username,
          email: adminData.email,
          passwordHash: hashedPassword,
        },
      });

      console.log("admin created");

      const role = await prisma.role.findUnique({
        where: {
          name: "admin",
        },
        select: { id: true },
      });

      if (!role) {
        throw new CustomError("Admin role not found", 404, "role lookup", true);
      }

      console.log("role founded", role.id);

      await prisma.userRole.create({
        data: {
          userId: newAdmin.id,
          roleId: role.id,
        },
      });
      console.log("user role created");

      await prisma.group.create({
        data: {
          name: `${newAdmin.username}'s group`,
          ownerId: newAdmin.id,
        },
      });

      return {
        username: newAdmin.username,
        id: newAdmin.id,
        email: newAdmin.email,
        createdAt: newAdmin.createdAt,
        updatedAt: newAdmin.updatedAt,
      };
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const dashboardEditAdminsService = async (
  id: number,
  adminData: EditAdminProps
) => {
  try {
    const findAdmin = await prisma.user.findFirst({ where: { id } });
    if (!findAdmin) {
      throw new CustomError("Admin not found", 404, "admin lookup", true);
    }

    const orConditions = [];

    if (adminData.username) {
      orConditions.push({
        username: adminData.username,
        id: { not: id },
      });
    }

    if (adminData.email) {
      orConditions.push({
        email: adminData.email,
        id: { not: id },
      });
    }

    if (orConditions.length > 0) {
      const existingAdmin = await prisma.user.findFirst({
        where: {
          OR: orConditions,
        },
      });

      if (existingAdmin) {
        const conflictingField =
          existingAdmin.username === adminData.username ? "username" : "email";
        throw new CustomError(
          `${
            conflictingField.charAt(0).toUpperCase() + conflictingField.slice(1)
          } is already taken`,
          400,
          "admin update",
          true,
          "",
          {
            [conflictingField]: `${
              conflictingField.charAt(0).toUpperCase() +
              conflictingField.slice(1)
            } is already taken`,
          }
        );
      }
    }

    const actualValues: Record<string, string> = {};

    for (const [key, value] of Object.entries(adminData)) {
      if (
        key in findAdmin &&
        value !== findAdmin[key as keyof typeof findAdmin]
      ) {
        actualValues[key] = value;
      }
    }

    if (adminData.password) {
      const hashedPassword = bcrypt.hashSync(adminData.password, 10);
      actualValues.passwordHash = hashedPassword;
    }

    if (Object.keys(actualValues).length === 0) {
      throw new CustomError(
        "No changes to update",
        400,
        "admin update",
        true,
        "",
        { message: "No changes to update" }
      );
    }

    const newAdmin = await prisma.user.update({
      where: { id: findAdmin.id },
      data: {
        ...actualValues,
        updatedAt: new Date(),
      },
    });

    return {
      username: newAdmin.username,
      id: newAdmin.id,
      email: newAdmin.email,
      createdAt: newAdmin.createdAt,
      updatedAt: newAdmin.updatedAt,
    };
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    console.log(error);
    throw new CustomError(
      "An error occurred while updating the admin",
      500,
      "updating admin account",
      true
    );
  }
};

export const dashboardOwnersService = async (id: number) => {
  try {
    const ownerRole = await prisma.role.findFirst({
      where: {
        name: "owner",
      },
      select: { id: true },
    });

    if (!ownerRole) {
      throw new CustomError("Owner role not found", 404, "role lookup", true);
    }

    const owners = await prisma.user.findMany({
      where: {
        AND: [{ userRole: { roleId: ownerRole.id } }, { NOT: { id: id } }],
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return owners;
  } catch (error) {
    throw error;
  }
};

export const dashboardMyDataService = async (id: number) => {
  try {
    const ownerData = await prisma.user.findUnique({
      where: { id },
      select: {
        username: true,
        email: true,
        createdAt: true,
      },
    });
    if (!ownerData) {
      throw new CustomError("Owner data not found", 404, "Not Found", true);
    }

    return ownerData;
  } catch (error) {
    throw error;
  }
};

export const dashboardEditMyAccount = async (
  data: EditMyAccountProps,
  id: number
) => {
  try {
    const actualValues: Record<string, string> = {};

    for (const [key, value] of Object.entries(data)) {
      if (value !== null && value !== undefined && value.trim().length !== 0) {
        actualValues[key] = value;
      }
    }

    const orConditions = [];

    if (data.username) {
      orConditions.push({
        username: data.username,
        id: { not: id },
      });
    }

    if (data.email) {
      orConditions.push({
        email: data.email,
        id: { not: id },
      });
    }

    if (orConditions.length > 0) {
      const existingAdmin = await prisma.user.findFirst({
        where: {
          OR: orConditions,
        },
      });

      if (existingAdmin) {
        const conflictingField =
          existingAdmin.username === data.username ? "username" : "email";
        throw new CustomError(
          `${
            conflictingField.charAt(0).toUpperCase() + conflictingField.slice(1)
          } is already taken`,
          400,
          "admin update",
          true,
          "",
          {
            [conflictingField]: `${
              conflictingField.charAt(0).toUpperCase() +
              conflictingField.slice(1)
            } is already taken`,
          }
        );
      }
    }

    if (data.password) {
      const hashedPassword = bcrypt.hashSync(data.password, 10);
      actualValues.passwordHash = hashedPassword;
    }

    const updatedInfo = await prisma.user.update({
      where: { id },
      data: {
        ...actualValues,
        updatedAt: new Date(),
      },
    });

    return updatedInfo;
  } catch (error) {
    console.error(error);
    throw new CustomError(
      "Failed to update account",
      500,
      "updating my account",
      true
    );
  }
};

export const dashboardDeleteAdminsService = async (ids: number[]) => {
  try {
    const adminRole = await prisma.role.findFirst({
      where: {
        name: "admin",
      },
      select: { id: true },
    });
    if (!adminRole) {
      throw new CustomError("Admin role not found", 404, "role lookup", true);
    }

    const deletionPromises = ids.map(async (id) => {
      const findAdmin = await prisma.user.findUnique({
        where: { id: id, userRole: { roleId: adminRole.id } },
      });

      if (!findAdmin) {
        throw new CustomError(`Admin with ID ${id} not found`, 404, "", true);
      }
      await prisma.user.delete({
        where: { id },
      });
    });

    await Promise.all(deletionPromises);

    return true;
  } catch (error) {
    throw error;
  }
};
