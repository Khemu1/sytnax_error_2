import { Analytics } from "@vercel/analytics/react";
import Link from "next/link";

const MaxAttemptsReached = () => {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="flex flex-col bg-base-300 justify-center p-6 rounded-md min-h-[300px] w-[300px] shadow-lg gap-4">
        <Link className="font-semibold mb-5 underline" href={"/"}>
          Go Home
        </Link>
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-red-700 text-white p-4 rounded-md flex items-center space-x-2">
            <div className="flex-1">
              <p className="text-xl text-center font-semibold">
                You have reached the max attempts
              </p>
            </div>
          </div>
        </div>
      </div>
      <Analytics />
    </div>
  );
};

export default MaxAttemptsReached;
