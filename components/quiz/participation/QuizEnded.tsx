import Link from "next/link";

const QuizEnded = () => {
  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-red-600 to-red-800 text-white p-8 rounded-xl shadow-2xl border border-red-700 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-red-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold mb-3">The Quiz Has Ended</h2>

        <p className="text-gray-200 mb-6">
          Thank you for participating! The quiz is now closed. If you have any
          questions or need further assistance, please contact the quiz
          administrator.
        </p>

        <Link
          href="/"
          className="inline-block bg-white text-red-600 font-semibold py-2 px-6 rounded-lg hover:bg-gray-100 hover:text-red-700 transition-all duration-300"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default QuizEnded;
