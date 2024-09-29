import React from "react";

const SkeletonCard = () => {
  return (
    <div className="flex justify-center w-max">
      <div className="rounded-xl overflow-hidden shadow-lg bg-base-200 w-[250px] skeleton">
        <div className="h-[200px] bg-gray-800"></div>{" "}
        {/* Placeholder for image */}
        <div className="p-4">
          <div className="h-6 bg-gray-800 rounded mb-2 w-3/4"></div>{" "}
          <div className="h-4 bg-gray-800 rounded w-5/6"></div>{" "}
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
