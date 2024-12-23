import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CreateSurveyDialog from "../Dialog/survey/CreateSurveyDialog";
import { RootState } from "@/store/store";
import { SurveyModel } from "@/types/survey";
import Image from "next/image";
import Survey from "./Survey";
import { setCurrentSurvey } from "@/store/slices/survey/surveySlice";

const Surveys = () => {
  const dispatch = useDispatch();

  const { surveys } = useSelector((state: RootState) => ({
    currentWorkspace: state.workspace.currentWorkspace,
    surveys: state.survey.surveys,
    currentSurvey: state.survey.currentSurvey,
  }));
  const [selectedSurvey, setSelectedSurvey] = useState<SurveyModel | null>(
    null
  );
  const [isCreateSurveyOpen, setIsCreateSurveyOpen] = useState(false);

  const handleSurveySelect = (survey: SurveyModel) => {
    try {
      setSelectedSurvey(survey);
      dispatch(setCurrentSurvey(survey));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="flex w-full flex-wrap gap-5 overflow-scroll">
        <div
          className="survey h-[291px]"
          onClick={() => setIsCreateSurveyOpen(true)}
        >
          <div className="w-max h-max p-1 bg-[#859fd1] rounded-md">
            <Image
              src="/assets/icons/plus.svg"
              alt="plus"
              width={20}
              height={20}
            />
          </div>
          <p className="text-[#859fd1] font-semibold">Create Survey</p>
        </div>

        {surveys.map((survey) => (
          <Survey
            key={survey.id}
            selected={selectedSurvey?.id === survey.id}
            survey={survey}
            onSelect={handleSurveySelect}
          />
        ))}
      </div>

      <CreateSurveyDialog
        isOpen={isCreateSurveyOpen}
        onClose={() => setIsCreateSurveyOpen(false)}
      />
    </>
  );
};

export default Surveys;
