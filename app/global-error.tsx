"use client";
import React from "react";

const GlobalError = () => {
  return (
    <div className="flex flex-col items-center justify-center flex-1 font-semibold">
      <h1 className="text-2xl">Something went wrong, please try again later</h1>
      <p className="">
        If the problem persists, please contact the Development Team.
      </p>
    </div>
  );
};

export default GlobalError;
