import { useEffect, useRef, useState } from "react";
import { useAddCourse } from "@/hooks/course";
import { validateWithSchema, newCourseSchema } from "@/utils/validations";
import { CourseDashboard } from "@/types";
import { setCourses } from "@/store/slices/dashboardSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import formStyle from "@/styles/formStyle.module.css";
import EditorComponent from "@/components/libsComponents/EditorComponent";
import FileUploader from "@/components/libsComponents/FileUploader";
import Toast from "@/components/skeletons/Toast";

type EditorInstance = {
  getContent: () => string;
  setContent: (content: string) => void;
};

const NewCourse = () => {
  const instructorAndMentorRef = useRef<EditorInstance | null>(null);
  const courseInfoRef = useRef<EditorInstance | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const dashboardState = useSelector((state: RootState) => state.dashboard);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    title: "",
    totalSessions: 0,
    totalSessionPerWeek: 0,
    totalTasks: 0,
    price: 0,
    courseImage: null as File | null | undefined,
    mindmapImage: null as File | null | undefined,
  });

  const titleRef = useRef<HTMLInputElement>(null);
  const totalSessionsRef = useRef<HTMLInputElement>(null);
  const totalSessionPerWeekRef = useRef<HTMLInputElement>(null);
  const totalTasksRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const emptyFieldsRef = useRef<HTMLParagraphElement>(null);
  // const instructorInfoRef = useRef<HTMLDivElement>(null);
  // const courseInfoRef = useRef<HTMLDivElement>(null);

  const closeToast = () => {
    setToast(null);
  };

  const scrollToErrorField = () => {
    if (validationErrors?.title || addApiErros?.title) {
      titleRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (validationErrors?.totalSessions || addApiErros?.totalSessions) {
      totalSessionsRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (
      validationErrors?.totalSessionPerWeek ||
      addApiErros?.totalSessionPerWeek
    ) {
      totalSessionPerWeekRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (validationErrors?.totalTasks || addApiErros?.totalTasks) {
      totalTasksRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (validationErrors?.price || addApiErros?.price) {
      priceRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (validationErrors?.emptyFields || addApiErros?.emptyFields) {
      emptyFieldsRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const [validationErrors, setValidationErrors] = useState<Record<
    string,
    string
  > | null>(null);
  const {
    handleAddCourse,
    loading,
    success,
    data,
    error: addApiErros,
  } = useAddCourse();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        name === "totalSessions" ||
        name === "totalSessionPerWeek" ||
        name === "totalTasks" ||
        name === "price"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const instructorContent =
      instructorAndMentorRef.current?.getContent() || "";
    const courseContent = courseInfoRef.current?.getContent() || "";

    const submitData = {
      ...formData,
      instructorAndMentorInfo: instructorContent,
      courseInfo: courseContent,
    };

    try {
      console.log(formData.courseImage instanceof File, formData.courseImage);
      await newCourseSchema.parseAsync(submitData);

      if (!formData.courseImage || !formData.mindmapImage) {
        setValidationErrors({
          courseImage: !formData.courseImage ? "Course image is required." : "",
          mindmapImage: !formData.mindmapImage
            ? "Mindmap image is required."
            : "",
        });
        return;
      }
      // Clear previous validation errors
      setValidationErrors(null);
      const form = new FormData();
      Object.entries(submitData).forEach(([key, value]) => {
        if (value instanceof File) {
          form.append(key, value);
        } else {
          form.append(key, String(value));
        }
      });
      await handleAddCourse(form);
    } catch (err) {
      setValidationErrors(validateWithSchema(err));
      console.log(validationErrors);
    }
  };

  useEffect(() => {
    scrollToErrorField();
  }, [validationErrors, addApiErros]);
  useEffect(() => {
    if (success && data) {
      const newArrray = dashboardState.courses.filter(
        (course: CourseDashboard) => course.id !== data.id
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { image, ...editedCourse } = data;
      dispatch(setCourses([...newArrray, editedCourse as CourseDashboard]));

      setToast({
        message: "Course Added successfully.",
        type: "success",
      });
    }
  }, [success, data]);

  return (
    <form
      encType="multipart/form-data"
      className="flex flex-col gap-9"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="title" className="font-semibold text-xl">
            Course Title
          </label>
          <input
            ref={titleRef}
            type="text"
            name="title"
            onChange={handleChange}
            id="title"
            className={`${formStyle.edit_course_input} ${
              validationErrors?.title ||
              validationErrors?.emptyFields ||
              addApiErros?.title ||
              addApiErros?.emptyFields
                ? formStyle.input_error
                : ""
            } border-blue-400`}
            placeholder={formData.title}
          />
          <p className="text-red-500 font-semibold w-[250px] h-[10px]">
            {validationErrors?.title ?? addApiErros?.title ?? ""}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="totalSessions" className="font-semibold text-xl">
            Total Number of Sessions
          </label>
          <input
            ref={totalSessionsRef}
            type="number"
            name="totalSessions"
            onChange={handleChange}
            id="totalSessions"
            className={`${formStyle.edit_course_input} ${
              validationErrors?.totalSessions ||
              validationErrors?.emptyFields ||
              addApiErros?.totalSessions ||
              addApiErros?.emptyFields
                ? formStyle.input_error
                : ""
            } `}
          />
          <p className="text-red-500 font-semibold w-[250px] h-[10px]">
            {validationErrors?.totalSessions ??
              addApiErros?.totalSessions ??
              ""}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="totalSessionPerWeek"
            className="font-semibold text-xl"
          >
            Total Number of Sessions Per Week
          </label>
          <input
            ref={totalSessionPerWeekRef}
            type="number"
            name="totalSessionPerWeek"
            onChange={handleChange}
            id="totalSessionPerWeek"
            className={`${formStyle.edit_course_input} ${
              validationErrors?.totalSessionPerWeek ||
              validationErrors?.emptyFields ||
              addApiErros?.totalSessionPerWeek ||
              addApiErros?.emptyFields
                ? formStyle.input_error
                : ""
            } `}
          />
          <p className="text-red-500 font-semibold w-[250px] h-[10px]">
            {validationErrors?.totalSessionPerWeek ??
              addApiErros?.totalSessionPerWeek ??
              ""}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="totalTasks" className="font-semibold text-xl">
            Total Number of Quizzes
          </label>
          <input
            ref={totalTasksRef}
            type="number"
            name="totalTasks"
            onChange={handleChange}
            id="totalTasks"
            className={`${formStyle.edit_course_input} ${
              validationErrors?.totalTasks ||
              validationErrors?.emptyFields ||
              addApiErros?.totalTasks ||
              addApiErros?.emptyFields
                ? formStyle.input_error
                : ""
            } `}
          />
          <p className="text-red-500 font-semibold w-[250px] h-[10px]">
            {validationErrors?.totalTasks ?? addApiErros?.totalTasks ?? ""}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="price" className="font-semibold text-xl">
            Price
          </label>
          <input
            ref={priceRef}
            type="number"
            name="price"
            onChange={handleChange}
            id="price"
            value={formData.price}
            className={`${formStyle.edit_course_input} ${
              validationErrors?.price ||
              validationErrors?.emptyFields ||
              addApiErros?.price ||
              addApiErros?.emptyFields
                ? formStyle.input_error
                : ""
            } `}
          />
          <p className="text-red-500 font-semibold w-[250px] h-[10px]">
            {validationErrors?.price ?? addApiErros?.price ?? ""}
          </p>
        </div>
      </div>

      <FileUploader
        file={formData.courseImage}
        setFile={(file: File | null) =>
          setFormData((prevData) => ({ ...prevData, courseImage: file }))
        }
        title="Course Image"
      />
      {validationErrors?.courseImage && (
        <p className="text-red-500 font-semibold">
          {validationErrors.courseImage}
        </p>
      )}

      <EditorComponent
        editorRef={instructorAndMentorRef}
        id="instructorAndMentorEditor"
        title="About Instructor & Mentor"
      />
      {validationErrors?.instructorAndMentorInfo && (
        <p className="text-red-500 font-semibold">
          {validationErrors.instructorAndMentorInfo}
        </p>
      )}

      <EditorComponent
        editorRef={courseInfoRef}
        id="courseEditor"
        title="About Course"
      />
      {validationErrors?.courseInfo && (
        <p className="text-red-500 font-semibold">
          {validationErrors.courseInfo}
        </p>
      )}

      <FileUploader
        file={formData.mindmapImage}
        setFile={(file: File | null) =>
          setFormData((prevData) => ({ ...prevData, mindmapImage: file }))
        }
        title="Mindmap Image"
      />
      {validationErrors?.mindmapImage && (
        <p className="text-red-500 font-semibold">
          {validationErrors.mindmapImage}
        </p>
      )}

      <div className="flex justify-center">
        <button
          type="submit"
          className={`${
            loading ? "bg-base-100" : "bg-blue-600"
          } font-semibold text-white py-2 w-[200px] text-xl rounded-lg shadow-2xl`}
        >
          {loading ? (
            <span className="loading loading-spinner loading-md"></span>
          ) : (
            "Add Course"
          )}
        </button>
      </div>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      )}
    </form>
  );
};

export default NewCourse;
