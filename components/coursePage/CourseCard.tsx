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
      <div className="rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 cursor-pointer hover:shadow-2xl bg-base-100 w-[200px] flex flex-col">
        <div className="flex justify-center w-full h-[200px] relative">
          <Image
            priority={true}
            alt="card"
            src={course.courseImage}
            fill={true}
            className="object-cover"
            style={{ objectPosition: "center" }} // Center the image
          />
        </div>

        <div className="flex flex-col justify-between flex-grow">
          {/* <h3 className="mx-auto my-0 p-2 text-lg font-semibold text-center whitespace-nowrap overflow-hidden text-ellipsis">
            {course.title}
          </h3> */}

          <div
            className={`flex justify-center   py-2 w-full text-center font-semibold text-[17px] ${
              course.price === 0
                ? "bg-gradient-to-r from-green-400 to-blue-500 text-white"
                : "bg-blue-600 text-white"
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
