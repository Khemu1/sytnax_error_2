import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Course from "./Course";
import { CourseDashboard } from "@/types";
import { useDeleteCourse } from "@/hooks/course";
import { useGetCourses } from "@/hooks/admin";
import { RootState } from "@/store/store";
import { setCourses } from "@/store/slices/dashboardSlice";
import SkeletonTable from "@/components/skeletons/SkeletonTable";
import DashboardDialog from "../DashboardDialog";
import Toast from "@/components/skeletons/Toast";

const Courses: React.FC = () => {
  const [allCourses, setAllCourses] = useState<CourseDashboard[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const {
    handleDeleteCourse,
    loading: deleteLoading,
    error: deleteError,
    success: deleteSuccess,
  } = useDeleteCourse();

  const {
    loading: fetchLoading,
    error: fetchError,
    data,
    handleGetCourses,
  } = useGetCourses();

  const dispatch = useDispatch();
  const dashboardState = useSelector((state: RootState) => state.dashboard);
  const dialogState = useSelector((state: RootState) => state.dialog);

  useEffect(() => {
    if (dashboardState.courses.length === 0) {
      handleGetCourses();
    } else {
      setAllCourses(dashboardState.courses);
    }
  }, [dashboardState.courses, handleGetCourses]);

  useEffect(() => {
    if (data && data.length > 0) {
      setAllCourses(data);
      dispatch(setCourses(data));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (deleteSuccess) {
      const updatedCourses = allCourses.filter(
        (course) => !selectedCourses.includes(course.id)
      );
      setAllCourses(updatedCourses);
      dispatch(setCourses(updatedCourses));
      setSelectedCourses([]);
    }
  }, [deleteSuccess]);

  const handleCourseClick = (id: number) => {
    setSelectedCourses((prev) =>
      prev.includes(id)
        ? prev.filter((courseId) => courseId !== id)
        : [...prev, id]
    );
  };

  const handleDelete = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to delete selected courses?"
    );
    if (!confirmation) return;

    try {
      await handleDeleteCourse(selectedCourses);
      setToast({ message: "Courses deleted successfully.", type: "success" });
    } catch (error) {
      console.error("Error deleting courses:", error);
      setToast({
        message: "Failed to delete courses. Please try again.",
        type: "error",
      });
    }
  };

  const closeToast = () => {
    setToast(null);
  };

  if (fetchLoading) {
    return <SkeletonTable />;
  }

  return (
    <div className="flex flex-col gap-4">
      <h1>Courses Table</h1>

      <div className="flex justify-end mb-4">
        <button
          className={`mx text-white ${
            selectedCourses.length === 0 ? "bg-gray-950" : "bg-red-600"
          } font-semibold px-4 py-2 rounded-lg`}
          onClick={handleDelete}
          disabled={selectedCourses.length === 0 || deleteLoading}
        >
          {deleteLoading ? "Deleting..." : "Delete"}
        </button>
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                ID
              </th>
              <th scope="col" className="px-6 py-3">
                Title
              </th>
              <th scope="col" className="px-6 py-3">
                Price
              </th>
              <th scope="col" className="px-6 py-3">
                Created At
              </th>
              <th scope="col" className="px-6 py-3">
                Updated At
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {allCourses.length > 0 ? (
              allCourses.map((course) => (
                <tr
                  key={course.id}
                  onClick={() => handleCourseClick(course.id)}
                  className={`cursor-pointer border-b dark:border-gray-700 ${
                    selectedCourses.includes(course.id)
                      ? "bg-blue-200 dark:bg-gray-900 text-white"
                      : "bg-white dark:bg-gray-800 hover:bg-gray-600"
                  }`}
                >
                  <Course course={course} />
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-4 font-semibold text-xl"
                >
                  No courses available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {fetchLoading && (
          <div className="absolute inset-0 z-10 bg-black opacity-50 rounded-lg flex justify-center items-center">
            <span className="loading loading-bars w-[2rem]"></span>
          </div>
        )}
      </div>
      {(deleteError || fetchError) && (
        <div className="text-red-500 mt-2">
          {deleteError
            ? "Failed to delete courses. Please try again."
            : "Failed to fetch courses. Please try again."}
        </div>
      )}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      )}
      {dialogState.dialogType && <DashboardDialog />}
    </div>
  );
};

export default Courses;
