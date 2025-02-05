import React from "react";

const VisibleGrades: React.FC<{
  totalUserScore: number | null;
  QuizTotalScore: number | null;
}> = ({ totalUserScore, QuizTotalScore }) => {
  return (
    <div className="border-l-8 border-green-400 bg-green-700 text-white p-4 rounded-md flex flex-col items-center space-y-2">
      <div className="text-xl font-semibold text-white">
        You scored {totalUserScore} out of {QuizTotalScore}.
      </div>
      <div className="text-sm text-gray-600 mt-2">
        If you wish to view your grades later, save the following link:
      </div>
    </div>
  );
};

export default VisibleGrades;
