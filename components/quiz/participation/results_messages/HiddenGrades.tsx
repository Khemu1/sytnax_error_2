const HiddenGrades = () => {
  return (
    <div className="border-l-8 border-yellow-500 bg-yellow-700 text-white p-4 rounded-md flex flex-col items-center space-y-2">
      <div className="text-xl font-semibold text-white">
        The instructor has set the grades to be hidden. Please contact the
        instructor to see your grades.
      </div>
      <div className="text-sm text-gray-600">
        For more details about your grades, please contact{" "}
        <strong>+20 1080636980</strong>.
      </div>
    </div>
  );
};

export default HiddenGrades;
