"use client";
import CourseCards from "@/components/coursePage/CourseCards";
import Filter from "@/components/coursePage/Filter";
import SearchBar from "@/components/coursePage/SearchBar";
import { useGetAllCourses } from "@/hooks/course";
import { PublicCardCourseProps } from "@/types";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { filterBy, filterBySearch } from "@/utils";


const Courses = () => {
  const {
    loading,
    error,
    data: courses,
    handleGetAllCourses,
  } = useGetAllCourses();

  const [filteredData, setFilteredData] = useState<PublicCardCourseProps[]>([]);
  const searchParams = useSearchParams();

  useEffect(() => {
    handleGetAllCourses();
  }, [handleGetAllCourses]);

  useEffect(() => {
    if (courses.length > 0) {
      const searchQuery = searchParams.get("q") || ""; 
      const sortBy = searchParams.get("sortBy") || "name-asc"; 

      const searchedData = filterBySearch(courses, searchQuery); 
      const finalFilteredData = filterBy(searchedData, sortBy);
      setFilteredData(finalFilteredData);
    }
  }, [courses, searchParams]);

  return (
    <div className="flex flex-1 flex-col w-full h-full my-10 px-8">
      <div className="mx-auto mb-10"></div>
      <div className="flex flex-col sm:flex-row items-center gap-3 w-[90dvw] p-6 bg-base-300 mx-auto mb-10 shadow-md rounded-xl">

        <SearchBar />
        <Filter />
      </div>

      {error ? (
        <div className="text-red-500 font-semibold text-xl text-center">
          <p>Error loading courses: {error.message}</p>
        </div>
      ) : (
        <CourseCards loading={loading} courses={filteredData} />
      )}
    </div>
  );
};

export default Courses;
