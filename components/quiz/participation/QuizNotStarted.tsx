import { Analytics } from "@vercel/analytics/react";
import { convertToEgyptTime } from "@/utils";
import Link from "next/link";

const QuizNotStarted: React.FC<{ startDate: string }> = ({ startDate }) => {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="flex flex-col bg-base-300 justify-center p-6 rounded-md min-h-[300px] w-[300px] shadow-lg gap-4">
        <Link className="font-semibold mb-5 underline" href={"/"}>
          Go Home
        </Link>
        <div className="flex-1 flex items-center justify-center">
          <div className=" border-l-8 border-green-500 bg-green-700 text-white p-4 rounded-md flex flex-col items-center space-y-2">
            <p className="text-xl font-semibold text-center">
              The quiz is currently closed.
            </p>
            <p className="text-lg text-center">
              It will be available on{" "}
              <span className="font-bold">
                {convertToEgyptTime(new Date(startDate))}
              </span>
              .
            </p>
          </div>
        </div>
      </div>
      <Analytics />
    </div>
  );
};

export default QuizNotStarted;
