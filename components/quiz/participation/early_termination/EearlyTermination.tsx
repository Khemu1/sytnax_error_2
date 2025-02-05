
const EearlyTermination = () => {
  return (
    <>
      <div className="bg-red-700 text-white p-4 rounded-md flex items-center space-x-2">
        <div className="flex-1">
          <p className="text-xl font-semibold">
            Your quiz has been submitted early due to one of the following
            conditions (e.g., tapping out or unfocusing the window). Your data
            has already been submitted.
          </p>
        </div>
      </div>
    </>
  );
};

export default EearlyTermination;
