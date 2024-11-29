import { Dialog, DialogPanel } from "@headlessui/react";
import React, { useState, useEffect } from "react";
import InputSwitchField from "./InputSwitchField";
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
import ImageUploadField from "./ImageUploadField";
import { returnFileAndUrl } from "@/utils/survey_builder/build/questions";
import PreviewGenericTextArea from "../edit/question/PreviewGenericTextArea";
import { newQuestionSchema } from "@/utils/validations/question";

import "@/styles/surveyBuilder.css";
import SwitchContainer from "./SwitchContainer";
import QuestionAnswers from "./QuestionAnswers";
import { validateWithSchema } from "@/utils/validations/validations";

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
  }));

  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<
    string,
    string
  > | null>(null);
  const isFormInvalid =
    isSubmitting ||
    label?.trim().length === 0 ||
    (isImageUploadEnabled && file === null) ||
    (isDescriptionEnabled && description?.trim().length === 0) ||
    answers.length < 2 ||
    correctAnswers.length === 0;

  const [isPreview, setIsPreview] = useState(false);
  const handleSwitchChange = (
    field: "description" | "imageUpload" | "allowMultipleChoice"
  ) => {
    if (field === "description") {
      dispatch(
        updateCurrentQuestion({ isDescriptionEnabled: !isDescriptionEnabled })
      );
    } else if (field === "imageUpload") {
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

  const handleFileChange = async (file: File | null) => {
    const { file: _file, url } = await returnFileAndUrl(file);
    console.log("File:", _file);
    console.log("Url:", url);
    setFile(_file);
    dispatch(updateCurrentQuestion({ previewImageUrl: url }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationErrors(null);
    try {
      setIsSubmitting(true);
      const options = {
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
      };

      const question = newQuestionSchema(options).parse(data);
      console.log("Question:", question);
    } catch (error) {
      setValidationErrors(validateWithSchema(error));
      console.error("Error:", error);
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
  return (
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
                    editorId="label"
                    label="Label"
                    value={label}
                    onChange={(e) =>
                      dispatch(updateCurrentQuestion({ label: e.target.value }))
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
                    editorId="description"
                    label="Description"
                    value={description ?? ""}
                    onChange={(e) =>
                      dispatch(
                        updateCurrentQuestion({ description: e.target.value })
                      )
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
                    isRequired={allowMultipleAnswers}
                    setIsRequired={() =>
                      handleSwitchChange("allowMultipleChoice")
                    }
                    label="Allow Multiple Choice"
                  />
                  {allowMultipleAnswers && (
                    <span className="text-sm">
                      Only <strong>2</strong> correct answers are allowed
                    </span>
                  )}
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
                    disabled={isFormInvalid}
                    type="submit"
                    className={`${
                      isFormInvalid
                        ? "bg-gray-600"
                        : "bg-blue-600 hover:bg-blue-700"
                    } py-2 px-6 rounded-md text-lg transition duration-300`}
                  >
                    Save
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
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default NewQuestion;
