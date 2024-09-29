import CourseCard from "./CourseCard";
import { PublicCardCourseProps } from "@/types";
import SkeletonCard from "../skeletons/SkeletonCard";

type Props = {
  loading: boolean;
  courses: [] | PublicCardCourseProps[];
};
const CourseCards: React.FC<Props> = ({ loading, courses }) => {
  return (
    <div className="courses_page">
      {loading
        ? Array.from({ length: 8 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))
        : courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
    </div>
  );
};

export default CourseCards;
