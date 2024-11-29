import React, { useState } from "react";
import Image from "next/image";
import DescriptionPreivew from "../../question/preview/DescriptionPreivew";
import LabelPreivew from "../../question/preview/LabelPreivew";

interface PreviewProps {
  imageUrl?: string;
  label: string;
  description?: string;
  index: number;
  answers: string[];
}

const Preview: React.FC<PreviewProps> = ({
  imageUrl,
  label,
  description,
  answers,
}) => {
  const [res, setRes] = useState<"pc" | "mobile">("pc");

  return (
    <div className="flex flex-col w-full min-h-full gap-5 items-start relative main_text bg-gray-900 p-6 rounded-lg">
      <div className="hidden sm:flex absolute left-1/2 top-5 transform -translate-x-1/2 gap-4 z-10">
        <button
          className={`flex items-center justify-center w-10 h-10 rounded-full ${
            res === "pc"
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-gray-400"
          } transition-all hover:bg-blue-500 focus:outline-none`}
          onClick={() => setRes("pc")}
          aria-label="PC View"
          title="PC View"
        >
          <Image
            src="/assets/icons/pc.svg"
            alt="PC"
            className="mx-auto"
            width={20}
            height={20}
          />
        </button>
        <button
          className={`flex items-center justify-center w-10 h-10 rounded-full ${
            res === "mobile"
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-gray-400"
          } transition-all hover:bg-blue-500 focus:outline-none`}
          onClick={() => setRes("mobile")}
          aria-label="Mobile View"
          title="Mobile View"
        >
          <Image
            src="/assets/icons/mobile.svg"
            alt="Mobile"
            className="mx-auto"
            width={20}
            height={20}
          />
        </button>
      </div>

      {/* Preview Area */}
      <div
        className={`flex flex-col min-h-full transition-all mx-auto overflow-y-auto relative items-center justify-center px-8 py-6 bg-gray-800 text-xl rounded-md shadow-md ${
          res === "pc" ? "w-full h-auto" : "w-[375px] h-auto"
        }`}
      >
        {imageUrl && (
          <div
            className={`mt-6 mb-4 ${
              res === "pc"
                ? "max-w-[500px] max-h-[500px]"
                : "max-w-[300px] max-h-[300px]"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="Preview"
              className="w-full h-auto rounded-lg shadow-xl"
            />
          </div>
        )}
        <div className="w-full mt-4">
          {label && <LabelPreivew label={label} />}
        </div>

        <div className="w-full mt-4">
          {description && <DescriptionPreivew description={description} />}
        </div>

        {answers.length > 0 && (
          <div className="flex flex-col flex-wrap gap-2 w-full justify-around">
            {answers.map((answer, index) => (
              <div
                key={index}
                className="flex items-center justify-start gap-2 w-[300px]"
              >
                <div className="rounded-lg w-full bg-blue-500 p-3 text-white shadow-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 cursor-pointer">
                  <span className="font-semibold">
                    {String.fromCharCode(65 + index)}.
                  </span>{" "}
                  {answer}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Preview;
