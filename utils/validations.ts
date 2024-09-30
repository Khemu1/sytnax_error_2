import { CustomError } from "@/middleware/CustomError";
import { object, string, ZodError, number, ZodIssueCode } from "zod";
import { PhoneNumberUtil, PhoneNumber } from "google-libphonenumber";

export const validateWithSchema = (error: CustomError | ZodError | unknown) => {
  console.log("got error schema", error instanceof CustomError);

  if (error instanceof ZodError) {
    const errors = error.errors.reduce((acc: Record<string, string>, curr) => {
      const fieldName = curr.path.join(".");
      acc[fieldName] = curr.message;
      return acc;
    }, {});
    return errors; // Return the errors in the desired format
  } else if (error instanceof CustomError) {
    return {
      message: error.message,
      details: error.details, // Optionally include details
    };
  }

  return {
    message: "An unknown error occurred",
  };
};

const phoneUtil = PhoneNumberUtil.getInstance();

const errorMessages = {
  email: {
    invalid: "Please enter a valid email address.",
    required: "Email is required.",
  },
  password: {
    min: "Password must be at least 8 characters long.",
    max: "Password cannot exceed 20 characters.",
    required: "Password is required.",
  },
  courseTitle: {
    required: "Course title is required.",
    min: "Course title must be at least 3 characters long.",
  },
  instructorAndMentorInfo: {
    required: "Instructor/Mentor info is required.",
    min: "Instructor/Mentor info must be at least 10 characters long.",
  },
  courseInfo: {
    required: "Course info is required.",
    min: "Course info must be at least 10 characters long.",
  },
  username: {
    min: "Username must be at least 3 characters long.",
    required: "Username is required.",
  },
  courseImage: {
    required: "Course image is required.",
    invalidType: "Only image files are allowed for the course image.",
  },
  mindmapImage: {
    required: "Mindmap image is required.",
    invalidType: "Only image files are allowed for the mindmap image.",
  },
  file: {
    nameRequired: "File name is required.",
    nameMin: "File name cannot be empty.",
    sizeMin: "File size must be greater than 0.",
    invalidType: "Only image files are allowed.",
  },
  usernameOrEmail: {
    required: "Username or email must be provided.",
  },
  totalSessions: {
    required: "Total sessions are required.",
    min: "Total sessions must be at least 3.",
  },
  totalTasks: {
    required: "Total tasks are required.",
    min: "Total tasks must be at least 1.",
  },
  totalSessionPerWeek: {
    required: "Total sessions per week are required.",
    min: "Total sessions per week must be at least 1.",
  },
  price: {
    required: "Price is required.",
    min: "Price must be a positive value.",
  },
  resetPasswordToken: {
    required: "Reset password token is required.",
    invalid: "Invalid reset password token.",
  },
};

export const fileSchema = object({
  name: string({
    required_error: errorMessages.file.nameRequired,
  }).min(1, { message: errorMessages.file.nameMin }),
  size: number().positive({ message: errorMessages.file.sizeMin }),
  type: string().refine((val) => val.startsWith("image/"), {
    message: errorMessages.file.invalidType,
  }),
});

export const newCourseSchema = object({
  title: string({
    required_error: errorMessages.courseTitle.required,
  }).min(3, { message: errorMessages.courseTitle.min }),

  courseImage: fileSchema,

  mindmapImage: fileSchema,

  instructorAndMentorInfo: string({
    required_error: errorMessages.instructorAndMentorInfo.required,
  }).min(10, { message: errorMessages.instructorAndMentorInfo.min }),

  courseInfo: string({
    required_error: errorMessages.courseInfo.required,
  }).min(10, { message: errorMessages.courseInfo.min }),

  totalSessions: number({
    required_error: errorMessages.totalSessions.required,
  }).min(3, { message: errorMessages.totalSessions.min }),

  totalSessionPerWeek: number({
    required_error: errorMessages.totalSessionPerWeek.required,
  }).min(1, { message: errorMessages.totalSessionPerWeek.min }),

  totalTasks: number({ required_error: errorMessages.totalTasks.required }).min(
    1,
    { message: errorMessages.totalTasks.min }
  ),
  price: number({ required_error: errorMessages.price.required }).min(0, {
    message: errorMessages.price.min,
  }),
});

export const signInSchema = object({
  usernameOrEmail: string({
    required_error: errorMessages.usernameOrEmail.required,
  }).min(1, { message: errorMessages.usernameOrEmail.required }),

  password: string({
    required_error: errorMessages.password.required,
  }).min(1, { message: errorMessages.password.required }),
});

export const signUpSchema = object({
  username: string({
    required_error: errorMessages.username.required,
  }).min(3, { message: errorMessages.username.min }),

  email: string({
    required_error: errorMessages.email.required,
  }).email({ message: errorMessages.email.invalid }),

  password: string({
    required_error: errorMessages.password.required,
  }).min(8, { message: errorMessages.password.min }),
});

export const updatedAdminSchema = (email?: string, username?: string) => {
  return object({
    username: string({
      required_error: errorMessages.username.required,
    }).optional(),

    email: string({
      required_error: errorMessages.email.required,
    })
      .email({ message: errorMessages.email.invalid })
      .optional(),

    password: string()
      .min(8, { message: errorMessages.password.min })
      .optional(),
  })
    .refine((val) => val.username !== username, {
      message: "Duplicate username. Please enter a valid one.",
      path: ["username"],
    })
    .refine((val) => val.email !== email, {
      message: "Duplicate email. Please enter a valid one.",
      path: ["email"],
    })
    .refine((val) => val.password !== email, {
      message: "Password cannot be the same as the email.",
      path: ["password"],
    })
    .superRefine((val, ctx) => {
      const emptyFields = [];
      if (!val.username && !val.password && !val.email) {
        emptyFields.push("allFields");
      }
      if (emptyFields.length > 0) {
        ctx.addIssue({
          code: "custom",
          message: "Please fill in at least one field.",
          path: ["emptyFields"],
        });
      }
    });
};

export const updateMyAccount = (email?: string, username?: string) => {
  return object({
    username: string({
      required_error: errorMessages.username.required,
    }).optional(),

    email: string({
      required_error: errorMessages.email.required,
    })
      .email({ message: errorMessages.email.invalid })
      .optional(),

    password: string()
      .min(8, { message: errorMessages.password.min })
      .optional(),
  })
    .refine((val) => val.username !== username, {
      message: "Duplicate username. Please enter a valid one.",
      path: ["username"],
    })
    .refine((val) => val.email !== email, {
      message: "Duplicate email. Please enter a valid one.",
      path: ["email"],
    })
    .refine((val) => val.password !== email, {
      message: "Password cannot be the same as the email.",
      path: ["password"],
    })
    .superRefine((val, ctx) => {
      const emptyFields = [];
      if (!val.username && !val.password && !val.email) {
        emptyFields.push("allFields");
      }
      if (emptyFields.length > 0) {
        ctx.addIssue({
          code: "custom",
          message: "Please fill in at least one field.",
          path: ["emptyFields"],
        });
      }
    });
};

export const updateMyAccountBackend = () => {
  return object({
    username: string({
      required_error: errorMessages.username.required,
    }).optional(),

    email: string({
      required_error: errorMessages.email.required,
    })
      .email({ message: errorMessages.email.invalid })
      .optional(),

    password: string()
      .min(8, { message: errorMessages.password.min })
      .optional(),
  }).superRefine((val, ctx) => {
    const emptyFields = [];
    if (!val.username && !val.password && !val.email) {
      emptyFields.push("allFields");
    }
    if (emptyFields.length > 0) {
      ctx.addIssue({
        code: "custom",
        message: "Please fill in at least one field.",
        path: ["emptyFields"],
      });
    }
  });
};

export const updatedAdminSchemaBackend = () => {
  return object({
    username: string({
      required_error: errorMessages.username.required,
    }).optional(),

    email: string({
      required_error: errorMessages.email.required,
    })
      .email({ message: errorMessages.email.invalid })
      .optional(),

    password: string()
      .min(8, { message: errorMessages.password.min })
      .optional(),
  }).superRefine((val, ctx) => {
    const emptyFields = [];
    if (!val.username && !val.password && !val.email) {
      emptyFields.push("allFields");
    }
    if (emptyFields.length > 0) {
      ctx.addIssue({
        code: "custom",
        message: "Please fill in at least one field.",
        path: ["emptyFields"],
      });
    }
  });
};

export const editCourseSchema = (
  existingTitle?: string,
  existingTotalSessions?: number,
  existingTotalSessionPerWeek?: number,
  existingTotalTasks?: number,
  existingPrice?: number
) => {
  return object({
    title: string({
      required_error: errorMessages.courseTitle.required,
    })
      .min(3, { message: errorMessages.courseTitle.min })
      .optional(),

    courseImage: fileSchema.optional(),

    mindmapImage: fileSchema.optional(),

    instructorAndMentorInfo: string({
      required_error: errorMessages.instructorAndMentorInfo.required,
    })
      .min(10, { message: errorMessages.instructorAndMentorInfo.min })
      .optional(),

    courseInfo: string({
      required_error: errorMessages.courseInfo.required,
    })
      .min(10, { message: errorMessages.courseInfo.min })
      .optional(),

    totalSessions: number({
      required_error: errorMessages.totalSessions.required,
    })
      .min(3, { message: errorMessages.totalSessions.min })
      .optional(),

    totalSessionPerWeek: number({
      required_error: errorMessages.totalSessionPerWeek.required,
    })
      .min(1, { message: errorMessages.totalSessionPerWeek.min })
      .optional(),

    totalTasks: number({
      required_error: errorMessages.totalTasks.required,
    })
      .min(1, { message: errorMessages.totalTasks.min })
      .optional(),

    price: number({
      required_error: errorMessages.price.required,
    })
      .min(0, { message: errorMessages.price.min })
      .optional(),
  })
    .refine((val) => val.title !== existingTitle, {
      message: "Duplicate title. Please enter a valid one.",
      path: ["title"],
    })
    .refine((val) => val.totalSessions !== existingTotalSessions, {
      message: "Duplicate total sessions. Please enter a valid one.",
      path: ["totalSessions"],
    })
    .refine((val) => val.totalSessionPerWeek !== existingTotalSessionPerWeek, {
      message: "Duplicate total sessions per week. Please enter a valid one.",
      path: ["totalSessionPerWeek"],
    })
    .refine((val) => val.totalTasks !== existingTotalTasks, {
      message: "Duplicate total tasks. Please enter a valid one.",
      path: ["totalTasks"],
    })
    .refine((val) => val.price !== existingPrice, {
      message: "Duplicate price. Please enter a valid one.",
      path: ["price"],
    })
    .superRefine((val, ctx) => {
      const emptyFields = [];
      if (
        !val.title &&
        !val.instructorAndMentorInfo &&
        !val.courseInfo &&
        !val.mindmapImage &&
        !val.courseImage &&
        !val.price &&
        !val.totalSessionPerWeek &&
        !val.totalSessions &&
        !val.totalTasks
      ) {
        emptyFields.push("allFields");
      }
      if (emptyFields.length > 0) {
        ctx.addIssue({
          code: "custom",
          message: "Please fill in at least one field.",
          path: ["emptyFields"],
        });
      }
    });
};

export const editCourseSchemaForBackend = () => {
  return object({
    title: string({
      required_error: errorMessages.courseTitle.required,
    })
      .min(3, { message: errorMessages.courseTitle.min })
      .optional(),

    courseImage: fileSchema.optional(),

    mindmapImage: fileSchema.optional(),

    instructorAndMentorInfo: string({
      required_error: errorMessages.instructorAndMentorInfo.required,
    })
      .min(10, { message: errorMessages.instructorAndMentorInfo.min })
      .optional(),

    courseInfo: string({
      required_error: errorMessages.courseInfo.required,
    })
      .min(10, { message: errorMessages.courseInfo.min })
      .optional(),

    totalSessions: number({
      required_error: errorMessages.totalSessions.required,
    })
      .min(3, { message: errorMessages.totalSessions.min })
      .optional(),

    totalSessionPerWeek: number({
      required_error: errorMessages.totalSessionPerWeek.required,
    })
      .min(1, { message: errorMessages.totalSessionPerWeek.min })
      .optional(),

    totalTasks: number({
      required_error: errorMessages.totalTasks.required,
    })
      .min(1, { message: errorMessages.totalTasks.min })
      .optional(),

    price: number({
      required_error: errorMessages.price.required,
    })
      .min(0, { message: errorMessages.price.min })
      .optional(),
  }).superRefine((val, ctx) => {
    const emptyFields = [];
    if (
      !val.title &&
      !val.instructorAndMentorInfo &&
      !val.courseInfo &&
      !val.mindmapImage &&
      !val.courseImage &&
      !val.price &&
      !val.totalSessionPerWeek &&
      !val.totalSessions &&
      !val.totalTasks
    ) {
      emptyFields.push("allFields");
    }
    if (emptyFields.length > 0) {
      ctx.addIssue({
        code: "custom",
        message: "Please fill in at least one field.",
        path: ["emptyFields"],
      });
    }
  });
};

export const validateEmailSchema = () => {
  return object({
    email: string({ message: errorMessages.email.required }).email({
      message: errorMessages.email.invalid,
    }),
  });
};

export const validateRestTokenSchema = () => {
  return object({
    restToken: string({ message: errorMessages.resetPasswordToken.required }),
  });
};

export const validatePasswordSchema = () => {
  return object({
    newPassword: string({
      required_error: errorMessages.password.required,
    }).min(8, { message: errorMessages.password.min }),
  });
};

const validatePhoneNumber = (value: string, countryCode: string): boolean => {
  try {
    const phoneNumber: PhoneNumber = phoneUtil.parseAndKeepRawInput(
      value,
      countryCode
    );
    return phoneUtil.isValidNumber(phoneNumber);
  } catch (error) {
    return false;
  }
};

export const joinCourseFieldsschema = object({
  name: string({ required_error: "Name is required" }).min(
    3,
    "Name must be at least 3 characters long"
  ),
  gpa: string({ required_error: "GPA is required" }).refine(
    (value) => {
      const gpaValue = parseFloat(value);
      return gpaValue >= 1.0 && gpaValue <= 4.0;
    },
    {
      message: "GPA must be between 1.0 and 4.0",
    }
  ),
  university: string({ required_error: "University is" }).min(
    2,
    "University must be at least 2 characters long"
  ),
  branch: string({ required_error: "Branch is required" }).min(
    3,
    "Branch must be at least 3 characters long"
  ),
  course: string().min(1, "Please select a course"),
  whatsapp: string().min(1, "WhatsApp number is required"),
  email: string().email("Invalid email address"),
  promoCode: string().optional(),
  questions: string().optional(),
  countryCode: string().min(1, "Country code is required"),
}).superRefine((val, ctx) => {
  const { whatsapp, countryCode } = val;
  if (!validatePhoneNumber(whatsapp, countryCode)) {
    ctx.addIssue({
      code: ZodIssueCode.custom,
      message: "Invalid WhatsApp number",
      path: ["whatsapp"],
    });
  }
});
