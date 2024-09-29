import Link from "next/link";
import React from "react";

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center flex-col flex-grow my-10 font-semibold text-xl sm:text-3xl md:text-6xl text-center">
      <h2>Invalid Token</h2>
      <Link
        className="flex text-2xl w-max mx-auto text-white bg-blue-600 p-2 rounded-lg mt-5"
        href="/"
      >
        Return Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
