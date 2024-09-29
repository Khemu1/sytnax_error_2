import { openEditCourseDialog } from "@/store/slices/dialogSlice";
import { CourseDashboard } from "@/types";
import React from "react";
import { useDispatch } from "react-redux";

const Course: React.FC<{ course: CourseDashboard }> = ({ course }) => {
  const dispatch = useDispatch();
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(openEditCourseDialog(course.id));
  };
  return (
    <>
      <th scope="row" className="px-6 py-4 font-medium text-white ">
        {course.id}
      </th>
      <td className="px-6 py-4">{course.title}</td>
      <td className="px-6 py-4">{course.price}</td>
      <td className="px-6 py-4">{new Date(course.createdAt).toDateString()}</td>
      <td className="px-6 py-4">
        {course.updatedAt ? new Date(course.updatedAt).toDateString() : null}
      </td>
      <td className="px-6 py-4 text-right">
        <button
          type="button"
          onClick={handleEditClick}
          className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
        >
          Edit
        </button>
      </td>
    </>
  );
};

export default Course;
