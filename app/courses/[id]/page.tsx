"use client";

import { Analytics } from "@vercel/analytics/react";
import { useGetCourse } from "@/hooks/course";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Props {
  params: Promise<{ id: number }>;
}

const Course: React.FC<Props> = ({ params }) => {
  const router = useRouter();
  const [id, setId] = useState<number | null>(null);
  const { loading, data, error, handleGetCourse } = useGetCourse();
  useEffect(() => {
    const fetchParams = async () => {
      try {
        const resolvedParams = await params;
        const courseId = resolvedParams.id;

        if (isNaN(courseId) || courseId <= 0) {
          router.push("/404");
          return;
        }
        setId(courseId);
      } catch (err) {
        console.error("Failed to resolve params:", err);
        router.push("/404");
      }
    };

    fetchParams();
  }, [params, router]);

  useEffect(() => {
    if (id !== null) {
      handleGetCourse(id);
    }
  }, [id, handleGetCourse]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#0C1425]">
        <span className="loading loading-infinity w-[80px] h-[80px]"></span>
      </div>
    );
  }

  if (error) {
    setTimeout(() => {
      router.push("/404");
    }, 3000);
    return (
      <div className="flex flex-1 text-center text-red-500 my-10 font-semibold justify-center items-center">
        Unexpected Error Occurred
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-10 py-10 px-6 md:px-20 lg:px-40 bg-[#0C1425] text-white">
      {data && (
        <>
          <h1 className="text-5xl font-bold text-white text-center">
            {data?.title || "Course Title"}
          </h1>

          {/* Course Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <CourseDetail
              iconSrc="/assets/icons/sessionIcon.svg"
              label={`${data?.totalSessions || "0"} Sessions`}
            />
            <CourseDetail
              iconSrc="/assets/icons/calendar-mark.svg"
              label={`${data?.totalSessionPerWeek || "0"} Sessions/Week`}
            />
            <CourseDetail
              iconSrc="/assets/icons/quiz.svg"
              label={`${data?.totalTasks || "0"} Quizzes`}
            />
            <CourseDetail
              iconSrc="/assets/icons/price-tag.svg"
              label={data?.price === 0 ? "Free" : `E£${data?.price}`}
              customStyle="bg-green-500 text-white"
            />
          </div>

          {/* Instructor Info */}
          <CourseInfo
            title="Instructor & Mentor"
            content={
              data?.instructorAndMentorInfo ||
              "No instructor information available."
            }
          />

          {/* Course Info */}
          <CourseInfo
            title="About the Course"
            content={data?.courseInfo || "No additional course information."}
          />

          {/* Mindmap Section */}
          {data?.mindmapImage && (
            <div className="bg-[#1E2A38] rounded-lg shadow-lg p-6 text-white">
              <h2 className="text-3xl font-semibold mb-4">Course Mind Map</h2>
              <div className="flex justify-center">
                <Image
                  src={data.mindmapImage}
                  alt="Mindmap"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg"
                  priority={true}
                />
              </div>
            </div>
          )}

          {/* Join Now Button */}
          <div className="flex justify-center mt-12">
            <Link
              href={"/join-course"}
              className="bg-gradient-to-r from-blue-700 via-teal-600 to-purple-800 hover:from-purple-800 hover:via-teal-600 hover:to-blue-700 text-white text-xl font-medium py-3 px-10 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
            >
              Join Now
            </Link>
          </div>
          <Analytics />
        </>
      )}
    </div>
  );
};

const CourseDetail: React.FC<{
  iconSrc: string;
  label: string;
  customStyle?: string;
}> = ({ iconSrc, label, customStyle = "" }) => {
  return (
    <div
      className={`flex items-center gap-4 bg-[#1E2A38] text-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 ${customStyle}`}
    >
      <Image src={iconSrc} width={40} height={40} alt="icon" />
      <span className="font-semibold text-lg">{label}</span>
    </div>
  );
};

const CourseInfo: React.FC<{ title: string; content: string }> = ({
  title,
  content,
}) => {
  return (
    <div className="bg-[#1E2A38] p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <h2 className="text-3xl font-semibold mb-4">{title}</h2>
      <p
        className="text-gray-300 text-lg leading-relaxed"
        dangerouslySetInnerHTML={{
          __html: content || "<p>No course information available.</p>",
        }}
      ></p>
    </div>
  );
};

export default Course;
