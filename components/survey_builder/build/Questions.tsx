import { QuestionModel } from "@/types/buildSurvey";
import LabelPreivew from "./question/preview/LabelPreivew";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Questions = () => {
  const { questions, currentSuvey } = useSelector((state: RootState) => ({
    questions: state.questions.items,
    currentSuvey: state.currentSurvey.currentSurvey,
  }));

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const navigateTo = useRouter();

  const toggleMenu = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();

    setOpenMenuId((prevId) => (prevId === id ? null : id));
  }, []);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    const target = event.target as Element;
    if (
      target &&
      !target.closest(".question-menu") &&
      !target.closest(".menu-toggle-button")
    ) {
      setOpenMenuId(null);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div className="flex flex-col gap-4 p-4 h-[600px] overflow-y-scroll">
      {questions?.length > 0 &&
        questions.map((question: QuestionModel, index: number) => (
          <div
            key={question.id}
            className="flex justify-between p-2 bg-[#42484b5b] rounded-md hover:bg-[#42484b86] transition-all relative"
            onClick={() => {
              const currentUrl = `/dashboard/surveyBuilder/build/${
                currentSuvey!.workspaceId
              }/${currentSuvey!.id}`;
              const queryParams = `?edit=true&id=${question.id}`;
              navigateTo.push(currentUrl + queryParams, { scroll: false });
            }}
          >
            <div className="flex gap-4">
              <div className="flex gap-2">
                <Image
                  src={"/assets/icons/text.svg"}
                  alt="Question Icon"
                  width={30}
                  height={30}
                />
                <span className="font-semibold">{index + 1}</span>
              </div>
              <div className="w-[200px] text-left text-[1rem] font-semibold">
                <LabelPreivew label={question.label} />
              </div>
            </div>

            <button
              className="flex justify-center items-center border w-[50px] h-[30px] border-[#85808025] rounded-lg menu-toggle-button"
              onClick={(e) => toggleMenu(question.id, e)}
            >
              <Image
                src="/assets/icons/dots.svg"
                alt="menu"
                height={30}
                width={50}
              />
            </button>

            {openMenuId === question.id && (
              <div className="question-menu flex flex-col text-left right-0 text-sm absolute top-10 bg-[#0e0e0e] p-2 rounded-md shadow-md z-10">
                <span className="survey_card_buttons">Duplicate</span>
                <span className="survey_card_buttons text-red-600">Delete</span>
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

export default Questions;
