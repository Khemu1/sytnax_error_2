import React from "react";

const SkeletonRow = () => (
  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-300 rounded w-1/3"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-300 rounded w-1/4"></div>
    </td>
    <td className="px-6 py-4 text-right">
      <div className="h-4 bg-gray-300 rounded w-1/4"></div>
    </td>
  </tr>
);

const SkeletonTable = () => {
  return (
    <div className="relative overflow-hidden shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 skeleton">
        <thead className="text-xs bg-gray-50 dark:bg-gray-700">
          <tr>
            <th scope="col" className="px-6 py-3">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </th>
            <th scope="col" className="px-6 py-3">
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </th>
            <th scope="col" className="px-6 py-3">
              <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            </th>
            <th scope="col" className="px-6 py-3">
              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            </th>
            <th scope="col" className="px-6 py-3">
              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }).map((_, index) => (
            <SkeletonRow key={index} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SkeletonTable;
