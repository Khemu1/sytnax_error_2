"use client";

import { PublicCardCourseProps } from "@/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  course: PublicCardCourseProps;
};

const CourseCard: React.FC<Props> = ({ course }) => {
  return (
    <Link href={`/courses/${course.id}`} className="flex justify-center w-max">
      <div className="rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 cursor-pointer hover:shadow-2xl bg-base-100 w-[270px] flex flex-col">
        <div className="flex justify-center w-full h-[280px] relative">
          <Image
            priority={true}
            alt="card"
            src={course.courseImage}
            fill={true}
            className="object-cover"
            style={{ objectPosition: "center" }}
          />
        </div>

        <div className="flex flex-col justify-between flex-grow w-full">
          <h3 className="m-[0] py-2 text-lg font-semibold text-white text-center  relative">
            <span className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-500 opacity-60 transition-opacity duration-300 hover:opacity-80"></span>{" "}
            <span className="relative z-10 text-shadow">{course.title}</span>
          </h3>

          <div
            className={`flex justify-center py-2 w-full text-center font-semibold text-[17px] ${
              course.price === 0
                ? "bg-gradient-to-r from-teal-500 to-cyan-600 text-white"
                : "bg-gradient-to-r from-blue-600 to-blue-800 text-white"
            }`}
          >
            {course.price !== 0 && (
              <span className="text-sm font-light">E£</span>
            )}
            {course.price === 0 ? "Free" : course.price}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
