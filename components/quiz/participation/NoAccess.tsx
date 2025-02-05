import { Analytics } from "@vercel/analytics/react";
import Link from "next/link";

const NoAccess:React.FC<{resetParticipant: () => void}> = ({resetParticipant}) => {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="flex flex-col bg-base-300 justify-center p-6 rounded-md min-h-[300px] w-[300px] shadow-lg gap-4">
        <Link className="font-semibold  underline" href={"/"}>
          Go Home
        </Link>
        <button
          className="font-semibold text-left mb-5"
          onClick={resetParticipant}
        >
          Go Back
        </button>
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-red-700 text-white p-4 rounded-md flex items-center space-x-2">
            <div className="flex-1">
              <p className="text-xl text-center font-semibold">
                You don{"'"}t have access to this Quizz
              </p>
            </div>
          </div>
        </div>
      </div>
      <Analytics />
    </div>
  );
};

export default NoAccess;
