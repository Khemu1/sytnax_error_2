"use client";
import React from "react";

const NotFound = () => {
  return (
    <div className="flex flex-1 flex-col gap-5 justify-center items-center h-full text-2xl font-extrabold">
      Course Not Found
      <button
        onClick={() => window.location.reload()}
        className="bg-blue-600 px-3 py-1 hover:bg-blue-800 hover:text-white transition-all rounded-lg text-2xl"
      >
        Retry
      </button>
    </div>
  );
};

export default NotFound;
