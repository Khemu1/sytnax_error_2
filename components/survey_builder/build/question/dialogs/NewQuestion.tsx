import { Dialog, DialogPanel } from "@headlessui/react";
import React, { useState, useEffect } from "react";
import InputSwitchField from "../InputSwitchField";
import {
  resetCurrentQuestion,
  updateCurrentQuestion,
  addAnswer,
  removeAnswer,
  addCorrectAnswer,
  removeCorrectAnswer,
  reduceCorrectAnswersTo1,
} from "@/store/slices/survey/questionSlice";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { RootState } from "@/store/store";
import ImageUploadField from "../ImageUploadField";
import {
  returnFileAndUrl,
  transformDataIntoFormData,
} from "@/utils/survey_builder/build/questions";
import PreviewGenericTextArea from "../../edit/question/PreviewGenericTextArea";
import {
  newQuestionSchema,
  questionOptionsSchema,
} from "@/utils/validations/question";

import "@/styles/surveyBuilder.css";
import SwitchContainer from "../SwitchContainer";
import QuestionAnswers from "../QuestionAnswers";
import { validateWithSchema } from "@/utils/validations/validations";
import { useAddQuestion } from "@/hooks/survey_builder/question";
import Toast from "@/components/skeletons/Toast";

interface NewQuestionDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewQuestion: React.FC<NewQuestionDialogProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const {
    label,
    isDescriptionEnabled,
    isImageUploadEnabled,
    previewImageUrl,
    description,
    questions,
    allowMultipleAnswers,
    answers,
    correctAnswers,
    points,
    currentSurvey,
  } = useSelector((state: RootState) => ({
    label: state.question.label,
    description: state.question.description,
    isImageUploadEnabled: state.question.isImageUploadEnabled,
    isDescriptionEnabled: state.question.isDescriptionEnabled,
    previewImageUrl: state.question.previewImageUrl,
    questions: state.questions.items,
    allowMultipleAnswers: state.question.allowMultipleAnswers,
    answers: state.question.answers,
    correctAnswers: state.question.correctAnswers,
    points: state.question.points,
    currentSurvey: state.currentSurvey.currentSurvey,
  }));

  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<
    string,
    string
  > | null>(null);

  const [isPreview, setIsPreview] = useState(false);

  const { isPending, handleAddQuestion, isSuccess } = useAddQuestion();

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const handleSwitchChange = (
    field: "description" | "imageUpload" | "allowMultipleChoice"
  ) => {
    if (field === "description") {
      dispatch(
        updateCurrentQuestion({ isDescriptionEnabled: !isDescriptionEnabled })
      );
    } else if (field === "imageUpload") {
      if (isImageUploadEnabled) {
        setFile(null);
        dispatch(updateCurrentQuestion({ previewImageUrl: "" }));
      }
      dispatch(
        updateCurrentQuestion({ isImageUploadEnabled: !isImageUploadEnabled })
      );
    } else if (field === "allowMultipleChoice") {
      if (allowMultipleAnswers) {
        dispatch(reduceCorrectAnswersTo1());
      }
      dispatch(
        updateCurrentQuestion({ allowMultipleAnswers: !allowMultipleAnswers })
      );
    }
  };
  const isFormInvalid =
    label?.trim().length === 0 ||
    (isImageUploadEnabled && !file) ||
    (isDescriptionEnabled && description?.trim().length === 0) ||
    answers.length < 2 ||
    correctAnswers.length === 0 ||
    points < 1 ||
    (allowMultipleAnswers && correctAnswers.length < 2);

  const handleFileChange = async (file: File | null) => {
    const { file: _file, url } = await returnFileAndUrl(file);

    setFile(_file);
    dispatch(updateCurrentQuestion({ previewImageUrl: url }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationErrors(null);
    if (!currentSurvey?.id || !currentSurvey?.workspaceId) {
      alert("Please create a survey first");
      return;
    }
    try {
      setIsSubmitting(true);
      const preopOptions = {
        isDescriptionEnabled,
        isImageUploadEnabled,
        allowMultipleAnswers,
      };

      const data = {
        description,
        imageUrl: previewImageUrl,
        label,
        answers,
        correctAnswers,
        points,
      };
      const options = questionOptionsSchema().parse(preopOptions);

      const question = newQuestionSchema(options).parse(data);

      const completeQuestion = {
        question,
        options,
        workspaceId: currentSurvey!.workspaceId,
        surveyId: currentSurvey!.id,
      };
      const formData = new FormData();
      transformDataIntoFormData(completeQuestion, formData);
      handleAddQuestion({
        question: formData,
      });
    } catch (error) {
      setValidationErrors(validateWithSchema(error));
      console.error("Error:", error);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const isAboveSm = window.innerWidth >= 640;

      if (isAboveSm) {
        setIsPreview(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [isPreview]);

  useEffect(() => {
    if (isSuccess) {
      setToast({
        message: "Question added successfully.",
        type: "success",
      });
      setTimeout(() => {
        dispatch(resetCurrentQuestion());
        onClose();
      }, 2000);
    }
  }, [isSuccess]);

  useEffect(() => {
    console.log("ememememem", label);
  }, [label]);
  console.log("in new questions");
  return (
    <>
      <Dialog
        open={isOpen}
        as="div"
        className="relative z-50 focus:outline-none"
        onClose={onClose}
      >
        <div className="fixed inset-0 z-[100000] w-screen overflow-y-auto">
          <DialogPanel
            transition
            className="w-full h-full rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
          >
            <div className="flex flex-col gap-4 sm:flex-row allow_scroll min-h-full">
              <div className="flex gap-4 mb-4 sm:hidden font-semibold">
                <button
                  className={`py-2 px-4 text-sm  rounded-md ${
                    !isPreview
                      ? "bg-blue-600 text-white"
                      : "bg-gray-300 text-black"
                  }`}
                  onClick={() => setIsPreview(false)}
                >
                  Create
                </button>
                <button
                  className={`py-2 px-4 text-sm  rounded-md ${
                    isPreview
                      ? "bg-green-600 text-white"
                      : "bg-gray-300 text-black"
                  }`}
                  onClick={() => setIsPreview(true)}
                >
                  Preview
                </button>
              </div>

              {/* Conditionally render form or preview */}
              {isPreview ? (
                <div className="flex h-[100dvh]">
                  <PreviewGenericTextArea
                    imageUrl={
                      isImageUploadEnabled && previewImageUrl
                        ? previewImageUrl
                        : undefined
                    }
                    label={label ? label : ""}
                    description={isDescriptionEnabled ? description : undefined}
                    index={questions.length + 1}
                    answers={answers}
                  />
                </div>
              ) : (
                <form
                  className="flex overflow-y-scroll flex-col space-y-6 w-full sm:w-2/3 md:w-1/2 lg:w-1/3  sm:border-r-2 border-r-gray-600 pb-4 pt-2 px-6"
                  method="POST"
                  onSubmit={handleSubmit}
                >
                  <div className="flex gap-5 items-center text-xl text-white font-semibold border-b border-b-[#85808025] py-4">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        dispatch(resetCurrentQuestion());
                      }}
                      className="hover:bg-gray-700 p-2 rounded-full"
                    >
                      <Image
                        src="/assets/icons/close.svg"
                        alt="Close"
                        width={30}
                        height={30}
                      />
                    </button>
                    <span className="font-semibold">New Question</span>
                  </div>
                  <div className="flex flex-col gap-6 px-4">
                    <InputSwitchField
                      editorId="label-new"
                      label="Label"
                      value={label}
                      onChangeEditor={(e: string) =>
                        dispatch(updateCurrentQuestion({ label: e }))
                      }
                      switchChecked={true}
                      placeholder="Label"
                      required={false}
                      hasSwitch={false}
                      type="editor"
                      border={false}
                      errorMessage={validationErrors?.label}
                    />
                    <InputSwitchField
                      editorId="description-new"
                      label="Description"
                      value={description ?? ""}
                      onChangeEditor={(e: string) =>
                        dispatch(updateCurrentQuestion({ description: e }))
                      }
                      switchChecked={isDescriptionEnabled}
                      onSwitchChange={() => handleSwitchChange("description")}
                      placeholder="Description"
                      required={false}
                      hasSwitch={true}
                      type="editor"
                      border={false}
                      errorMessage={validationErrors?.description}
                    />
                    <ImageUploadField
                      file={file}
                      setFile={handleFileChange}
                      title=""
                      label="Image"
                      switchChecked={isImageUploadEnabled}
                      onSwitchChange={() => handleSwitchChange("imageUpload")}
                      errorMessage={validationErrors?.imageFile}
                    />
                    <SwitchContainer
                      id="multipleAnswers"
                      isRequired={allowMultipleAnswers}
                      setIsRequired={() =>
                        handleSwitchChange("allowMultipleChoice")
                      }
                      label="Allow Multiple Choice"
                    />

                    <InputSwitchField
                      onChangeEditor={() => console.log("changed")}
                      label="Points"
                      value={!isNaN(Number(points)) ? Number(points) : 1}
                      onChange={(e) =>
                        dispatch(
                          updateCurrentQuestion({
                            points: Number(e.target.value),
                          })
                        )
                      }
                      placeholder="Points"
                      required={false}
                      hasSwitch={false}
                      switchChecked={true}
                      type="number"
                      border={true}
                      errorMessage={validationErrors?.points}
                    />
                    <QuestionAnswers
                      answers={answers}
                      correctAnswers={correctAnswers}
                      addAnswer={(answer) => dispatch(addAnswer(answer))}
                      removeAnswer={(answer) => dispatch(removeAnswer(answer))}
                      addCorrectAnswer={(answer) =>
                        dispatch(addCorrectAnswer(answer))
                      }
                      removeCorrectAnswer={(answer) =>
                        dispatch(removeCorrectAnswer(answer))
                      }
                      zodError={validationErrors}
                    />
                  </div>
                  <div className="flex justify-end gap-5 items-center p-4 text-white font-semibold">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        dispatch(resetCurrentQuestion());
                      }}
                      className="bg-red-600 py-2 px-6 rounded-md text-lg hover:bg-red-700 transition duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      disabled={isFormInvalid || isSubmitting || isSuccess}
                      type="submit"
                      className={`flex justify-center items-center w-[82px] ${
                        isFormInvalid || isSubmitting || isSuccess
                          ? "bg-gray-600"
                          : "bg-blue-600 hover:bg-blue-700"
                      } py-2 px-6 rounded-md text-lg transition duration-300`}
                    >
                      {isPending ? (
                        <span className="loading loading-spinner loading-sm"></span>
                      ) : (
                        "Add"
                      )}
                    </button>
                  </div>
                </form>
              )}
              <div className="hidden sm:flex w-full  ">
                <PreviewGenericTextArea
                  imageUrl={
                    isImageUploadEnabled && previewImageUrl
                      ? previewImageUrl
                      : undefined
                  }
                  label={label ? label : ""}
                  description={isDescriptionEnabled ? description : undefined}
                  index={questions.length + 1}
                  answers={answers}
                />
              </div>
            </div>
            {toast && (
              <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(null)}
                duration={1500}
              />
            )}
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default NewQuestion;
