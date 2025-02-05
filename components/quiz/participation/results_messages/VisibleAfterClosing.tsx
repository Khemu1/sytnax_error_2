import { convertToEgyptTime } from "@/utils";

const VisibleAfterClosing: React.FC<{ endTime: string | null }> = ({
  endTime,
}) => {
  return (
    <>
      <div className="border-l-8 border-yellow-500 bg-yellow-700 text-white p-4 rounded-md flex flex-col items-center space-y-2 text-xl font-semibold ">
        The grades will be visible after the survey closes.{" "}
        {endTime ? (
          <>Please check again after {convertToEgyptTime(new Date(endTime))}.</>
        ) : (
          <>The closing date has not been set yet.</>
        )}
      </div>
      <div className="text-sm text-gray-600">
        For more details about your grades, please contact{" "}
        <strong>+20 1080636980</strong>.
      </div>
    </>
  );
};

export default VisibleAfterClosing;
