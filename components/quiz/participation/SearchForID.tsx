import { Analytics } from "@vercel/analytics/react";
import React from "react";
import Image from "next/image";


const SearchForID: React.FC<{
  text: string;
  handleStudentIdSearch: (text: string) => void;
  handleStudentIdSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isParticipantFetching: boolean;
  validationError: Record<string, string> | null;
}> = ({
  text,
  handleStudentIdSearch,
  handleStudentIdSearchChange,
  isParticipantFetching,
  validationError,
}) => {
  return (
    <div className={`flex-1 flex items-center justify-center`}>
      <div className="flex flex-col bg-base-300 justify-center p-6 rounded-md min-h-[300px] w-[300px] shadow-lg gap-4">
        <div className="flex justify-center animate-bounce">
          {" "}
          <Image
            alt="logo"
            src={"/assets/imgs/logo.png"}
            width={75}
            height={50}
          />
        </div>
        <label
          htmlFor="studentId"
          className="text-lg  text-center mb-2 font-semibold"
        >
          Enter Your Student ID
        </label>
        <input
          type="text"
          name="studentId"
          id="studentId"
          placeholder="Student ID"
          onChange={handleStudentIdSearchChange}
          value={text}
        />
        <div className="flex justify-center">
          <button
            className="w-[125px] text-xl flex justify-center pr-2 bg-blue-600 font-semibold  p-2 rounded-md shadow-md hover:bg-blue-700 hover:text-white transition duration-300 h-[44px]"
            disabled={isParticipantFetching}
            onClick={() => handleStudentIdSearch(text)}
          >
            {isParticipantFetching ? (
              <span className="flex items-center justify-center mx-auto loading loading-spinner loading-md"></span>
            ) : (
              "Check"
            )}
          </button>
        </div>
        {validationError && validationError.studentId && (
          <p className="text-red-600 text-center font-semibold">
            {validationError.studentId}
          </p>
        )}
      </div>
      <Analytics />
    </div>
  );
};

export default SearchForID;
