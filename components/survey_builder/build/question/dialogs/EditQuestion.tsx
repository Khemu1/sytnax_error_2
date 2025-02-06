import { Dialog, DialogPanel } from "@headlessui/react";
import React, { useState, useEffect } from "react";
import InputSwitchField from "../InputSwitchField";
import {
  resetCurrentEditQuestion,
  updateCurrentEditQuestion,
  addAnswerForEdit,
  removeAnswerForEdit,
  addCorrectAnswerForEdit,
  removeCorrectAnswerForEdit,
  reduceCorrectAnswersTo1ForEdit,
  setCurrentEditQuestion,
} from "@/store/slices/survey/editQuestionSlice";
import Image from "next/image";
import ImageUploadField from "../ImageUploadField";
import {
  returnFileAndUrl,
  transformDataIntoFormData,
} from "@/utils/survey_builder/build/questions";
import PreviewGenericTextArea from "../../edit/question/PreviewGenericTextArea";
import {
  editQuestionSchema,
  questionOptionsSchema,
} from "@/utils/validations/question";

import "@/styles/surveyBuilder.css";
import SwitchContainer from "../SwitchContainer";
import QuestionAnswers from "../QuestionAnswers";
import { validateWithSchema } from "@/utils/validations/validations";
import { useEditQuestion } from "@/hooks/survey_builder/question";
import Toast from "@/components/skeletons/Toast";
import { EditQuestionModel, QuestionModel } from "@/types/buildSurvey";
import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";

interface NewQuestionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  question: QuestionModel;
  workspaceId: string;
}

const EditQuestion: React.FC<NewQuestionDialogProps> = ({
  isOpen,
  onClose,
  workspaceId,
  question: currentQuestion,
}) => {
  const dispatch = useDispatch();
  const label = useSelector((state: RootState) => state.editQuestion.label);
  const description = useSelector(
    (state: RootState) => state.editQuestion.description
  );
  const isImageUploadEnabled = useSelector(
    (state: RootState) => state.editQuestion.isImageUploadEnabled
  );
  const isDescriptionEnabled = useSelector(
    (state: RootState) => state.editQuestion.isDescriptionEnabled
  );
  const previewImageUrl = useSelector(
    (state: RootState) => state.editQuestion.previewImageUrl ?? ""
  );
  const allowMultipleAnswers = useSelector(
    (state: RootState) => state.editQuestion.allowMultipleAnswers
  );
  const points = useSelector((state: RootState) => state.editQuestion.points);
  const addedAnswers = useSelector(
    (state: RootState) => state.editQuestion.addedAnswers
  );
  const addedCorrectAnswers = useSelector(
    (state: RootState) => state.editQuestion.addedCorrectAnswers
  );
  const deletedAnswers = useSelector(
    (state: RootState) => state.editQuestion.deletedAnswers
  );
  const deletedCorrectAnswers = useSelector(
    (state: RootState) => state.editQuestion.deletedCorrectAnswers
  );
  const questionAnswers = useSelector(
    (state: RootState) => state.editQuestion.questionAnswers
  );
  const correctAnswers = useSelector(
    (state: RootState) => state.editQuestion.correctAnswers
  );
  const questions = useSelector((state: RootState) => state.questions.items);

  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<
    string,
    string
  > | null>(null);

  const [isPreview, setIsPreview] = useState(false);

  const { isPending, handleEditQuestion, isSuccess } = useEditQuestion();

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleSwitchChange = (
    field: "description" | "imageUpload" | "allowMultipleChoice"
  ) => {
    if (field === "description") {
      dispatch(
        updateCurrentEditQuestion({
          isDescriptionEnabled: !isDescriptionEnabled,
        })
      );
    } else if (field === "imageUpload") {
      if (isImageUploadEnabled) {
        setFile(null);
        dispatch(updateCurrentEditQuestion({ previewImageUrl: "" }));
      }
      dispatch(
        updateCurrentEditQuestion({
          isImageUploadEnabled: !isImageUploadEnabled,
        })
      );
    } else if (field === "allowMultipleChoice") {
      if (allowMultipleAnswers) {
        if (correctAnswers.length > 1) {
          dispatch(removeCorrectAnswerForEdit(addedCorrectAnswers[1]));
          dispatch(reduceCorrectAnswersTo1ForEdit());
        }
      }
      dispatch(
        updateCurrentEditQuestion({
          allowMultipleAnswers: !allowMultipleAnswers,
        })
      );
    }
  };
  const isFormInvalid =
    label?.trim().length === 0 ||
    (isDescriptionEnabled && description && description.trim().length === 0) ||
    +points < 1;
  const handleFileChange = async (file: File | null) => {
    if (file) {
      // Handle the file upload, generate URL and set it
      const { file: _file, url } = await returnFileAndUrl(file);
      setFile(_file);
      dispatch(updateCurrentEditQuestion({ previewImageUrl: url }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setValidationErrors(null);
    if (!currentQuestion.surveyId || !workspaceId) {
      alert("Please create a survey first");
      return;
    }

    try {
      const preopOptions = {
        isDescriptionEnabled,
        isImageUploadEnabled,
        allowMultipleAnswers,
      };
      const regex = /([^/]+\.[a-zA-Z0-9]+)$/;
      const match = currentQuestion.questionImage?.url.match(regex);
      const orignalFileName = match ? match[0] : "";
      console.log(orignalFileName);
      console.log(file?.name);
      const data = {
        id: currentQuestion.id,
        description: isDescriptionEnabled
          ? description &&
            description.trim() !== currentQuestion.description?.trim()
            ? description
            : !currentQuestion.description && description
            ? description
            : undefined
          : currentQuestion.description
          ? null
          : undefined,

        imageUrl: isImageUploadEnabled
          ? file?.name !== orignalFileName
            ? previewImageUrl
            : undefined
          : currentQuestion.questionImage
          ? null
          : undefined,

        label:
          label.trim() !== currentQuestion.label.trim() ? label : undefined,

        questionAnswers,
        correctAnswers,
        deletedAnswers,
        deletedCorrectAnswers,
        addedAnswers,
        addedCorrectAnswers: allowMultipleAnswers
          ? addedCorrectAnswers.filter(
              (answer) => !correctAnswers.some((ca) => ca.value === answer)
            )
          : addedCorrectAnswers,
        points: points !== currentQuestion.points ? points : undefined,
        allowMultipleAnswers:
          allowMultipleAnswers === currentQuestion.allowMultipleAnswers
            ? undefined
            : allowMultipleAnswers,
      };
      console.log(allowMultipleAnswers);
      console.log("orignal correact answers", correctAnswers);
      console.log(
        "added correct answers",
        allowMultipleAnswers
          ? addedCorrectAnswers.filter(
              (answer) => !correctAnswers.some((ca) => ca.value === answer)
            )
          : addedCorrectAnswers
      );
      console.log("deleted correct answers outside", deletedCorrectAnswers);
      const options = questionOptionsSchema().parse({ ...preopOptions });
      const question = editQuestionSchema({ ...options }).parse({ ...data });
      const completeQuestion = {
        question,
        options,
        workspaceId: workspaceId,
        surveyId: currentQuestion.surveyId,
        questionId: currentQuestion.id,
      };
      const formData = new FormData();
      transformDataIntoFormData(completeQuestion, formData);

      handleEditQuestion({
        question: formData,
      });
    } catch (error) {
      setValidationErrors(validateWithSchema(error));
      console.error("Error:", validationErrors);
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
      console.log("isSuccess", isSuccess);
      setToast({
        message: "Question has been updated.",
        type: "success",
      });
      setTimeout(() => {
        onClose();
        dispatch(resetCurrentEditQuestion());
      }, 2000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  useEffect(() => {
    if (!currentQuestion) {
      onClose();
    }

    dispatch(setCurrentEditQuestion(currentQuestion as EditQuestionModel));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Dialog
        open={isOpen}
        as="div"
        className="relative z-50 focus:outline-0"
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
                      isImageUploadEnabled
                        ? previewImageUrl ?? currentQuestion.questionImage?.url
                        : undefined
                    }
                    label={label || ""}
                    description={
                      isDescriptionEnabled ? description ?? "" : undefined
                    }
                    index={questions.length + 1}
                    answers={addedAnswers}
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
                        dispatch(resetCurrentEditQuestion());
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
                    <span className="font-semibold">Edit Question</span>
                  </div>
                  <div className="flex flex-col gap-6 px-4">
                    <InputSwitchField
                      editorId="label-edit"
                      label="Label"
                      value={label}
                      onChangeEditor={(e: string) =>
                        dispatch(updateCurrentEditQuestion({ label: e }))
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
                      editorId="description-edit"
                      label="Description"
                      value={description ?? ""}
                      switchChecked={isDescriptionEnabled}
                      onSwitchChange={() => handleSwitchChange("description")}
                      placeholder="Description"
                      required={false}
                      hasSwitch={true}
                      type="editor"
                      border={false}
                      errorMessage={validationErrors?.description}
                      onChangeEditor={(e: string) =>
                        dispatch(updateCurrentEditQuestion({ description: e }))
                      }
                    />
                    <ImageUploadField
                      file={file}
                      filePath={previewImageUrl}
                      setFile={handleFileChange}
                      title=""
                      label="Image"
                      switchChecked={isImageUploadEnabled}
                      onSwitchChange={() => handleSwitchChange("imageUpload")}
                      errorMessage={validationErrors?.imageUrl}
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
                      label="Points"
                      value={!isNaN(Number(points)) ? Number(points) : 1}
                      onChange={(e) =>
                        dispatch(
                          updateCurrentEditQuestion({
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
                      onChangeEditor={() => console.log("changed")}
                    />
                    <QuestionAnswers
                      answers={addedAnswers}
                      correctAnswers={addedCorrectAnswers}
                      addAnswer={(answer) => dispatch(addAnswerForEdit(answer))}
                      removeAnswer={(answer) =>
                        dispatch(removeAnswerForEdit(answer))
                      }
                      addCorrectAnswer={(answer) =>
                        dispatch(addCorrectAnswerForEdit(answer))
                      }
                      removeCorrectAnswer={(answer) =>
                        dispatch(removeCorrectAnswerForEdit(answer))
                      }
                      zodError={validationErrors}
                    />
                  </div>
                  {validationErrors?.noChange && (
                    <p className="error_message text-center">
                      {validationErrors.noChange}
                    </p>
                  )}
                  <div className="flex justify-end gap-5 items-center p-4 text-white font-semibold">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        dispatch(resetCurrentEditQuestion());
                      }}
                      className="bg-red-600 py-2 px-6 rounded-md text-lg hover:bg-red-700 transition duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      disabled={isFormInvalid || isSubmitting || isSuccess}
                      type="submit"
                      className={`flex justify-center items-center w-[82px] ${
                        isFormInvalid
                          ? "bg-gray-600"
                          : "bg-blue-600 hover:bg-blue-700"
                      } py-2 px-6 rounded-md text-lg transition duration-300`}
                    >
                      {isPending ? (
                        <span className="loading loading-spinner loading-sm"></span>
                      ) : (
                        "Edit"
                      )}
                    </button>
                  </div>
                </form>
              )}
              <div className="hidden sm:flex w-full  ">
                <PreviewGenericTextArea
                  imageUrl={
                    isImageUploadEnabled
                      ? previewImageUrl ?? currentQuestion.questionImage?.url
                      : undefined
                  }
                  label={label || ""}
                  description={
                    isDescriptionEnabled ? description ?? "" : undefined
                  }
                  index={questions.length + 1}
                  answers={addedAnswers}
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

export default EditQuestion;
