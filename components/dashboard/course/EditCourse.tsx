import { useEffect, useRef, useState } from "react";
import { validateWithSchema, editCourseSchema } from "@/utils/validations";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useEditDashboardCourse, useGetCourseForEdit } from "@/hooks/admin";
import { CourseDashboard, EditCourseProps } from "@/types";
import formStyle from "@/styles/formStyle.module.css";
import { setCourses } from "@/store/slices/dashboardSlice";
import { closeDialog } from "@/store/slices/dialogSlice";
import EditorComponent from "@/components/libsComponents/EditorComponent";
import FileUploader from "@/components/libsComponents/FileUploader";
import Toast from "@/components/skeletons/Toast";

type EditorInstance = {
  getContent: () => string;
  setContent: (content: string) => void;
};

const EditCourse = () => {
  const dialogState = useSelector((state: RootState) => state.dialog);
  const dashboardState = useSelector((state: RootState) => state.dashboard);
  const dispatch = useDispatch();
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const totalSessionsRef = useRef<HTMLInputElement>(null);
  const totalSessionPerWeekRef = useRef<HTMLInputElement>(null);
  const totalTasksRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const emptyFieldsRef = useRef<HTMLParagraphElement>(null);
  // const instructorInfoRef = useRef<HTMLDivElement>(null);
  // const courseInfoRef = useRef<HTMLDivElement>(null);

  const scrollToErrorField = () => {
    if (validationErrors?.title || editApiErros?.title) {
      titleRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (validationErrors?.totalSessions || editApiErros?.totalSessions) {
      totalSessionsRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (
      validationErrors?.totalSessionPerWeek ||
      editApiErros?.totalSessionPerWeek
    ) {
      totalSessionPerWeekRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (validationErrors?.totalTasks || editApiErros?.totalTasks) {
      totalTasksRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (validationErrors?.price || editApiErros?.price) {
      priceRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (validationErrors?.emptyFields || editApiErros?.emptyFields) {
      emptyFieldsRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const closeToast = () => {
    setToast(null);
  };

  const {
    handleGetCourse,
    loading: getCourseLoading,
    error: getCourseError,
    data,
  } = useGetCourseForEdit();

  const {
    handleEditCourse,
    loading: editLoading,
    error: editApiErros,
    data: editData,
    success: editSuccess,
  } = useEditDashboardCourse();

  const instructorAndMentorRef = useRef<EditorInstance | null>(null);
  const courseInfoRef = useRef<EditorInstance | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    totalSessions: 0,
    totalSessionPerWeek: 0,
    totalTasks: 0,
    price: 0,
    courseImage: null as File | null | undefined,
    mindmapImage: null as File | null | undefined,
  });

  const [validationErrors, setValidationErrors] = useState<Record<
    string,
    string
  > | null>(null);

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
    setValidationErrors(null);
    e.preventDefault();
    if (!data) {
      setValidationErrors({
        message: "couldn't fetch data.",
      });
      return;
    }

    const instructorContent =
      instructorAndMentorRef.current?.getContent() || "";
    const courseContent = courseInfoRef.current?.getContent() || "";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const prepData: any = {};
    for (const [key, value] of Object.entries(formData)) {
      if (value) {
        if (typeof value === "string" && value.trim().length > 0) {
          prepData[key] = value.trim();
        }
        if (typeof value === "number" && value >= 0 && key !== "price") {
          prepData[key] = value;
        }
        if (value instanceof File) {
          prepData[key] = value;
        }
        // price case
        else {
          prepData[key] = value;
        }
      }
    }
    if (
      instructorContent.toLowerCase() !==
      data.instructorAndMentorInfo.toLowerCase()
    ) {
      prepData.instructorAndMentorInfo = instructorContent;
    }
    if (courseContent.toLowerCase() !== data.courseInfo.toLowerCase()) {
      prepData.courseInfo = courseContent;
    }
    const submitData: EditCourseProps = {
      ...prepData,
    };

    try {
      const schema = editCourseSchema(
        data.title,
        data.totalSessions,
        data.totalSessionPerWeek,
        data.totalTasks,
        data.price
      );
      await schema.parseAsync(submitData);

      setValidationErrors(null);
      const form = new FormData();
      Object.entries(submitData).forEach(([key, value]) => {
        if (value instanceof File) {
          form.append(key, value);
        } else {
          form.append(key, String(value));
        }
      });
      console.log(form);
      handleEditCourse(data.id, form);
    } catch (err) {
      setValidationErrors(validateWithSchema(err));
    }
  };

  useEffect(() => {
    if (dialogState.courseId) {
      handleGetCourse(dialogState.courseId);
    }
  }, [dialogState.courseId]);

  useEffect(() => {
    scrollToErrorField();
  }, [validationErrors, editApiErros]);

  useEffect(() => {
    if (editSuccess && editData) {
      if (!editData.image) {
        // Now you are sure `editData.data` has an `id` property
        const newArrray = dashboardState.courses.filter(
          (course) => course.id !== editData.id
        );
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { image, ...editedCourse } = editData;
        dispatch(setCourses([...newArrray, editedCourse as CourseDashboard]));
      }
      setToast({
        message: "Course updated successfully.",
        type: "success",
      });
      setTimeout(() => {
        dispatch(closeDialog());
      }, 2000);
    }
  }, [editSuccess, editData]);

  if (getCourseLoading) {
    return (
      <div className="flex w-full h-full items-center justify-center gap-2 flex-wrap">
        <span className="font-semibold text-2xl">Fetching Data</span>{" "}
        <span className="loading loading-bars w-[75px]"></span>
      </div>
    );
  }
  if (getCourseError || !data) {
    return (
      <div className="flex flex-col w-full h-full items-center justify-center gap-2 flex-wrap font-semibold text-2xl text-red-600">
        <span>{getCourseError?.message}</span>
        <span>Try Again Later.</span>
      </div>
    );
  }

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
              editApiErros?.title ||
              editApiErros?.emptyFields
                ? formStyle.input_error
                : ""
            } border-blue-400`}
            placeholder={data.title}
          />
          <p className="text-red-500 font-semibold w-[250px] h-[10px]">
            {validationErrors?.title ?? editApiErros?.title ?? ""}
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
              editApiErros?.totalSessions ||
              editApiErros?.emptyFields
                ? formStyle.input_error
                : ""
            } `}
            placeholder={data.totalSessions.toString()}
          />
          <p className="text-red-500 font-semibold w-[250px] h-[10px]">
            {validationErrors?.totalSessions ??
              editApiErros?.totalSessions ??
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
              editApiErros?.totalSessionPerWeek ||
              editApiErros?.emptyFields
                ? formStyle.input_error
                : ""
            } `}
            placeholder={data.totalSessionPerWeek.toString()}
          />
          <p className="text-red-500 font-semibold w-[250px] h-[10px]">
            {validationErrors?.totalSessionPerWeek ??
              editApiErros?.totalSessionPerWeek ??
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
              editApiErros?.totalTasks ||
              editApiErros?.emptyFields
                ? formStyle.input_error
                : ""
            } `}
            placeholder={data.totalTasks.toString()}
          />
          <p className="text-red-500 font-semibold w-[250px] h-[10px]">
            {validationErrors?.totalTasks ?? editApiErros?.totalTasks ?? ""}
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
            className={`${formStyle.edit_course_input} ${
              validationErrors?.price ||
              validationErrors?.emptyFields ||
              editApiErros?.price ||
              editApiErros?.emptyFields
                ? formStyle.input_error
                : ""
            } `}
            placeholder={data.price.toString()}
          />
          <p className="text-red-500 font-semibold w-[250px] h-[10px]">
            {validationErrors?.price ?? editApiErros?.price ?? ""}
          </p>
        </div>
      </div>

      <FileUploader
        file={formData.courseImage}
        setFile={(file: File | null) =>
          setFormData((prevData) => ({ ...prevData, courseImage: file }))
        }
        title="Course Image"
        initialImage={data.courseImage}
      />
      {validationErrors?.courseImage ||
        (editApiErros?.courseImage && (
          <p className="text-red-500 font-semibold">
            {validationErrors?.courseImage ?? editApiErros?.courseImage}
          </p>
        ))}

      <EditorComponent
        editorRef={instructorAndMentorRef}
        id="instructorAndMentorEditor"
        title="About Instructor & Mentor"
        initialValue={data.instructorAndMentorInfo}
      />
      {validationErrors?.instructorAndMentorInfo ||
        (editApiErros?.instructorAndMentorInfo && (
          <p className="text-red-500 font-semibold">
            {validationErrors?.instructorAndMentorInfo ??
              editApiErros?.instructorAndMentorInfo}
          </p>
        ))}

      <EditorComponent
        editorRef={courseInfoRef}
        id="courseEditor"
        title="About Course"
        initialValue={data.courseInfo}
      />
      {validationErrors?.courseInfo ||
        (editApiErros?.courseInfo && (
          <p className="text-red-500 font-semibold">
            {validationErrors?.courseInfo ?? editApiErros?.courseInfo}
          </p>
        ))}

      <FileUploader
        file={formData.mindmapImage}
        setFile={(file: File | null) =>
          setFormData((prevData) => ({ ...prevData, mindmapImage: file }))
        }
        title="Update Mindmap Image"
        initialImage={data.mindmapImage}
      />
      {validationErrors?.mindmapImage ||
        (editApiErros?.mindmapImage && (
          <p className="text-red-500 font-semibold">
            {validationErrors?.mindmapImage ?? editApiErros?.mindmapImage}
          </p>
        ))}

      {editApiErros?.message ||
        (validationErrors?.emptyFields && (
          <p
            className="text-red-500 font-semibold text-xl mx-auto"
            ref={emptyFieldsRef}
          >
            {editApiErros?.message ??
              validationErrors?.emptyFields ??
              editApiErros?.emptyFields}
          </p>
        ))}

      <div className="flex justify-center">
        <button
          type="submit"
          className={`${
            editLoading ? "bg-base-100" : "bg-blue-600"
          } font-semibold text-white py-2 w-[200px] text-xl rounded-lg shadow-2xl`}
        >
          {editLoading ? (
            <span className="loading loading-spinner loading-md"></span>
          ) : (
            "Update"
          )}
        </button>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={closeToast}
          />
        )}
      </div>
    </form>
  );
};

export default EditCourse;
