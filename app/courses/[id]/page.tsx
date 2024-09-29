"use client"; // Ensure this is at the very top of the file
import { useGetCourse } from "@/hooks/course";
import React, { useEffect } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";

interface Props {
  params: { id: number };
}

const Course: React.FC<Props> = ({ params: { id } }) => {
  const { loading, data, error, handleGetCourse } = useGetCourse();

  useEffect(() => {
    if (!isNaN(+id) && id > 0) {
      handleGetCourse(id);
    } else {
      return notFound();
    }
  }, [id]);

  // Handle loading and errors
  if (loading) {
    return (
      <div className="flex flex-grow justify-center items-center ">
        <span className="loading loading-infinity w-[100px]"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 my-10">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-8 my-10 px-6 md:px-12 lg:px-44">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-100 bg-gradient-to-r min-w-[250px] mb-7 from-blue-800 to-blue-600 text-center mx-auto p-2 px-4 shadow-md rounded-2xl">
        {data?.title || "Course Title"}
      </h1>

      <div className="flex flex-wrap text-sm">
        {/* Total Sessions */}
        <div className="m-2 flex w-[200px] gap-2 items-center bg-blue-600 rounded-xl px-2 py-1 font-semibold text-white">
          <div>
            <Image
              priority={true}
              src={"/assets/icons/sessionIcon.svg"}
              width={32}
              height={32}
              alt="total sessions"
            />
          </div>
          <span>
            {data?.totalSessions && data.totalSessions > 1
              ? `${data?.totalSessions} Total Sessions`
              : `${data?.totalSessions || "No"} Session`}
          </span>
        </div>

        {/* Sessions Per Week */}
        <div className="m-2 flex w-[200px] gap-2 items-center bg-blue-600 rounded-xl px-2 py-1 font-semibold text-white">
          <div>
            <Image
              priority={true}
              src={"/assets/icons/calendar-mark.svg"}
              width={32}
              height={32}
              alt="sessions per week"
            />
          </div>
          <span>
            {data?.totalSessionPerWeek && data?.totalSessionPerWeek > 1
              ? `${data?.totalSessionPerWeek} Sessions Per Week`
              : `${data?.totalSessionPerWeek || "No"} Session Per Week`}
          </span>
        </div>

        {/* Total Quizzes */}
        <div className="m-2 flex w-[200px] gap-2 items-center bg-blue-600 rounded-xl px-2 py-1 font-semibold text-white">
          <div>
            <Image
              priority={true}
              src={"/assets/icons/quiz.svg"}
              width={32}
              height={32}
              alt="total tasks/quizzes"
            />
          </div>
          <span>
            {data?.totalTasks && data?.totalTasks > 1
              ? `${data?.totalTasks} Quizzes`
              : `${data?.totalTasks || "No"} Quiz`}
          </span>
        </div>

        {/* Price */}
        <div
          className={`m-2 flex gap-2 items-center w-[150px] rounded-xl px-2 py-1 text-center font-light text-sm  ${
            data?.price === 0
              ? "bg-gradient-to-r from-green-400 to-blue-500 text-white"
              : "bg-blue-600 text-white"
          }`}
        >
          <div>
            <Image
              priority={true}
              src={"/assets/icons/price-tag.svg"}
              width={32}
              height={32}
              alt="price tag"
            />
          </div>
          <span className="font-semibold">
            {data?.price === 0 ? "Free" : `E£${data?.price}`}
          </span>
        </div>
      </div>

      {/* Course Info */}
      <div className="text-white bg-base-300 p-3 rounded-lg shadow-md transition-all hover:scale-105">
        <h2 className="text-xl font-semibold mb-2">Who Will Be Teaching</h2>
        <div
          className="prose prose-lg mb-6"
          dangerouslySetInnerHTML={{
            __html:
              data?.instructorAndMentorInfo ||
              "<p>No instructor information available.</p>",
          }}
        />
      </div>

      <div className="text-white bg-base-300 p-3 rounded-lg shadow-md transition-all hover:scale-105">
        <h2 className="text-xl font-semibold mb-2">More About the Course</h2>
        <div
          className="prose prose-lg mb-6"
          dangerouslySetInnerHTML={{
            __html:
              data?.courseInfo || "<p>No course information available.</p>",
          }}
        />
      </div>

      {/* Mindmap Image */}
      {data?.mindmapImage && (
        <div className="text-white bg-base-300 rounded-lg shadow-md p-3">
          <h2 className="text-xl font-semibold mb-2">Course Mind Map</h2>
          <div className="flex mx-auto max-w-[75dvw]  justify-center mt-2 overflow-hidden relative rounded-2xl transition-all shadow-lg active:scale-105">
            <Image
              src={data.mindmapImage}
              alt="Mindmap"
              width={500}
              height={300}
              className="rounded-2xl max-w-full max-h-full object-contain"
              priority={true}
            />
          </div>
        </div>
      )}

      {/* Join Button */}
      <div className="flex w-full justify-center mt-8">
        <Link
          href={"/join-course"}
          className="bg-blue-700 text-center hover:bg-blue-800 transition duration-300 w-[250px] py-2 text-white font-semibold text-xl rounded-lg shadow-md"
        >
          Join Now
        </Link>
      </div>
    </div>
  );
};

export default Course;
