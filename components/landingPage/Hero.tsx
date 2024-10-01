import React from "react";
import Image from "next/image";
import Link from "next/link";
import { courses } from "@/constants";

export const Hero = () => {
  return (
    <div className="flex flex-col w-full">
      <div className="relative w-full overflow-hidden">
        <Image
          className="rounded-lg shadow-lg object-cover"
          src="/assets/imgs/cover.png"
          alt="Cover"
          priority={true}
          width={1920}
          height={1080}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>

        <div className="absolute inset-0 flex flex-col justify-center items-center z-[10] text-center text-white px-14">
          <h1 className="text-[1.3rem] md:text-5xl font-bold mb-4 fade-in">
            Welcome to Syntax Error
          </h1>
          <div>
            <p
              className="text-xl font-light mb-3 sm:mb-6 fade-in w-full"
              style={{ animationDelay: "0.5s" }}
            >
              Master your coding skills with expert-led courses.
            </p>
          </div>
          <Link
            href={"/courses"}
            className="CTA"
            style={{ animationDelay: "1s" }}
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Team Introduction Section */}
      <div className="flex justify-center items-center py-10 bg-base-200">
        <div className="flex flex-col sm:flex-row items-center gap-8 my-8">
          {/* Team Logo */}
          <div className="relative rounded-full overflow-hidden h-[100px] w-[100px] md:w-[150px] md:h-[150px] hero_logo">
            <Image src={"/assets/imgs/logo.png"} alt={"logo"} fill={true} />
          </div>

          {/* Team Information */}
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl font-bold text-white">Who Are We</h1>
            <p className="text-lg mt-2 px-4 max-w-2xl text-white">
              Syntax Error is a team of passionate developers and educators
              committed to helping individuals master the world of coding
              through expertly designed courses.
            </p>
          </div>
        </div>
      </div>

      {/* Team Mission Section */}
      <div className="flex justify-center items-center py-10 bg-base-100">
        <div className="max-w-4xl text-center">
          <h2 className="text-3xl font-semibold mb-4 text-blue-500">
            Our Mission
          </h2>
          <p className="text-lg px-4 text-white">
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
      <div className="flex justify-center items-center py-10 bg-base-200">
        <div className="max-w-4xl text-center">
          <h2 className="text-3xl font-semibold mb-4 text-green-500">
            Our Expertise
          </h2>
          <p className="text-lg px-4 text-white">
            With a team of instructors who have years of experience in the tech
            industry, we offer courses that are not only comprehensive but also
            up-to-date with the latest trends and technologies. Our goal is to
            equip you with practical coding skills that you can immediately
            apply in real-world scenarios.
          </p>
        </div>
      </div>

      {/* Team Values Section */}
      <div className="flex justify-center items-center py-10 bg-base-100">
        <div className="max-w-4xl text-center">
          <h2 className="text-3xl font-semibold mb-4 text-[#FFD700]">
            Our Values
          </h2>
          <p className="text-lg px-4 text-white">
            At Syntax Error, we value collaboration, continuous learning, and
            innovation. We are constantly evolving to ensure that our learners
            have access to the best resources and support. By focusing on
            real-world applications, we aim to create a learning experience that
            not only teaches but also inspires.
          </p>
        </div>
      </div>
      <div className="flex flex-col w-full items-center gap-8 py-8 bg-base-200">
        <h2 className="text-3xl font-semibold text-[#FFD700]">
          Courses We Specializes At
        </h2>
        <div className="flex flex-col gap-4">
          {courses.map((course) => (
            <div key={course.title} className="feat">
              <span className="font-semibold text-xl whitespace-nowrap">
                {course.title}
              </span>
              <span className="flex text-sm md:text-base">
                {course.description}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
