import Survey from "./Survey";
import Image from "next/image";
const Surveys = () => {
  return (
    <>
      <div className="flex w-full flex-wrap gap-5 overflow-scroll">
        <div className="flex items-center justify-center gap-5 w-[292px] h-[212px] bg-[#1e2a3869] rounded-lg">
          <button className="w-max h-max p-1 bg-[#859fd1] rounded-md">
            <Image
              src="/assets/icons/plus.svg"
              alt="plus"
              width={32}
              height={32}
              className="w-[20px] h-[20px]"
            />
          </button>
        </div>
      </div>
    </>
  );
};

export default Surveys;
