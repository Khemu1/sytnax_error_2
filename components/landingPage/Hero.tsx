import { Analytics } from "@vercel/analytics/react";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { courses } from "@/constants";

export const Hero = () => {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <div className="relative w-full h-[70vh] overflow-hidden">
        <Image
          className="rounded-lg shadow-lg object-cover"
          src="https://i.imgur.com/cfKyIGv.png"
          alt="Cover"
          priority={true}
          fill
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>

        <div className="absolute inset-0 flex flex-col justify-center items-center z-[10] text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
            Welcome to Syntax Error
          </h1>
          <p className="text-xl md:text-2xl font-light mb-6 animate-fade-in delay-500">
            Master your coding skills with expert-led courses.
          </p>
          <Link
            href="#"
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 hover:scale-105 transition-all duration-300 animate-fade-in delay-1000"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Team Introduction Section */}
      <div className="px-4 py-16 bg-base-200">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center gap-8">
          <div className="relative rounded-full overflow-hidden h-[150px] w-[150px] md:w-[200px] md:h-[200px] animate-fade-in border-4 border-blue-500">
            <Image src="/assets/imgs/logo.png" alt="logo" fill />
          </div>
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <h1 className="text-4xl font-bold text-white mb-4 animate-fade-in">
              Who Are We
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl animate-fade-in delay-500">
              Syntax Error is a team of passionate developers and educators
              committed to helping individuals master the world of coding
              through expertly designed courses.
            </p>
          </div>
        </div>
      </div>

      {/* Team Mission Section */}
      <div className="px-4 py-16 bg-base-100">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <h2 className="text-4xl font-bold mb-6 text-blue-500 animate-fade-in">
            Our Mission
          </h2>
          <p className="text-lg text-gray-300 animate-fade-in delay-500">
            Our mission is to make learning to code accessible, engaging, and
            practical for everyone. We believe that hands-on, project-based
            learning is key to mastering any skill. Whether you&apos;re just
            starting your tech journey or you&apos;re a seasoned developer,
            Syntax Error is here to support your learning path and career
            growth.
          </p>
        </div>
      </div>

      {/* Team Expertise Section */}
      <div className="px-4 py-16 bg-base-200">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
          </div>
          <h2 className="text-4xl font-bold mb-6 text-green-500 animate-fade-in">
            Our Expertise
          </h2>
          <p className="text-lg text-gray-300 animate-fade-in delay-500">
            With a team of instructors who have years of experience in the tech
            industry, we offer courses that are not only comprehensive but also
            up-to-date with the latest trends and technologies. Our goal is to
            equip you with practical coding skills that you can immediately
            apply in real-world scenarios.
          </p>
        </div>
      </div>

      {/* Team Values Section */}
      <div className="px-4 py-16 bg-base-100">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-[#FFD700]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h2 className="text-4xl font-bold mb-6 text-[#FFD700] animate-fade-in">
            Our Values
          </h2>
          <p className="text-lg text-gray-300 animate-fade-in delay-500">
            At Syntax Error, we value collaboration, continuous learning, and
            innovation. We are constantly evolving to ensure that our learners
            have access to the best resources and support. By focusing on
            real-world applications, we aim to create a learning experience that
            not only teaches but also inspires.
          </p>
        </div>
      </div>

      {/* Courses Section */}
      <div className="px-4 py-16 bg-base-200">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-8">
          <h2 className="text-4xl font-bold text-[#FFD700] animate-fade-in">
            Courses We Specialize In
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {courses.map((course) => (
              <div
                key={course.title}
                className="hover:scale-[105%] transition-all duration-300 bg-base-100 p-6 rounded-lg shadow-lg hover:shadow-xl  "
              >
                <h3 className="text-xl font-semibold text-white mb-2">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-300">{course.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Analytics />
    </div>
  );
};
