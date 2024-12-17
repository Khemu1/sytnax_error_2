export const footerLinks = [
  {
    name: "Socials",
    links: [
      { title: "Discord", url: "https://discord.gg/mMG2xqb24q" },
      {
        title: "Instagram",
        url: "https://www.instagram.com/syntax_error176?igsh=Ynp6YjhqOGdyaTU2",
      },
      {
        title: "Youtube",
        url: "https://youtube.com/@syntaxerrorteam-pp5rm?si=WWVKG_cMDf_3Gy_x",
      },
      {
        title: "Facebook",
        url: "https://www.facebook.com/profile.php?id=61550968236226",
      },
    ],
  },
];

export const filters = [
  { name: "Name ASC", value: "name-asc" },
  { name: "Name DSC", value: "name-desc" },
  { name: "Price ASC", value: "price-asc" },
  { name: "Price DSC", value: "price-desc" },
];

export const courses = [
  {
    title: "Programming Basics",
    description:
      "An introduction to programming languages, covering the fundamentals of object-oriented programming (OOP), data structures, and algorithms.",
  },
  {
    title: "Network",
    description:
      "Understand the basics of networking, including protocols, models, and practical applications in a modern IT environment.",
  },
  {
    title: "Problem Solving",
    description:
      "Sharpen your problem-solving skills by learning how to approach complex challenges with structured techniques.",
  },
  {
    title: "Flutter",
    description:
      "Learn Flutter to build cross-platform mobile applications with a single codebase, making app development faster and easier.",
  },
];

export const joinCourseFields = [
  { name: "name", label: "Name *", type: "text" },
  { name: "gpa", label: "GPA *", type: "text" },
  { name: "university", label: "University *", type: "text" },
  { name: "branch", label: "Branch *", type: "text" },
  {
    name: "course",
    label: "Course you prefer to purchase *",
    type: "select",
    options: [
      { value: "Networking CCNA (300 LE)", label: "Networking CCNA (300 LE)" },
      { value: "OOP (200 LE)", label: "OOP (200 LE)" },
      { value: "Database (250 LE)", label: "Database (250 LE)" },
      { value: "All Courses (500 LE)", label: "All Courses (500 LE)" },
      { value: "OOP Final Revision (100)", label: "OOP Final Revision (100)" },
      {
        value: "Database Final Revision (100)",
        label: "Database Final Revision (100)",
      },
      {
        value: "Network Final Revision (100)",
        label: "Network Final Revision (100)",
      },
    ],
  },
  { name: "whatsapp", label: "WhatsApp number *", type: "phone" },
  { name: "email", label: "Email *", type: "email" },
  { name: "promoCode", label: "Promo Code (if found)", type: "text" },
  { name: "questions", label: "Any questions", type: "textarea" },
];

export const quizUserForm = [
  { name: "email", label: "Email *", type: "email", onChangeType: "email" },
  {
    name: "studentId",
    label: "Student ID *",
    type: "text",
    onChangeType: "studentId",
  },
  {
    name: "phoneNumber",
    label: "WhatsApp number *",
    type: "phone",
    onChangeType: "phone",
  },
];
