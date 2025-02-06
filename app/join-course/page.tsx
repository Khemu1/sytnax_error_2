"use client";
import React, { useEffect, useState } from "react";
import { joinCourseFields } from "@/constants";
import Image from "next/image";
import formStyle from "@/styles/formStyle.module.css";
import { CountryProps, Errors, RegisterCourseFormProps } from "@/types";
import { useRegisterCourse } from "@/hooks/course";
import ReactPhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useGetAllCourses } from "@/hooks/course";
import {
  joinCourseFieldsschema,
  validateWithSchema,
} from "@/utils/validations/validations";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const JoinCourse: React.FC = () => {
  const initialState: RegisterCourseFormProps = {
    name: "",
    gpa: "",
    university: "",
    branch: "",
    course: "",
    whatsapp: "",
    email: "",
    promoCode: "",
    questions: "",
    countryCode: "EG",
  };

  const {
    loading: isLoadingCourses,
    error: errorCourses,
    data: courses,
    handleGetAllCourses,
  } = useGetAllCourses();

  const [formData, setFormData] =
    useState<RegisterCourseFormProps>(initialState);
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { loading, error, success, handleRegisterCourse } = useRegisterCourse();
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    try {
      const scehma = joinCourseFieldsschema();
      scehma.parse(formData);
      handleRegisterCourse(formData);
      setIsSubmitting(false);
    } catch (err) {
      setErrors(validateWithSchema(err));
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (error) {
      setErrors(error);
    }
  }, [error]);
  useEffect(() => {
    handleGetAllCourses();
  }, [handleGetAllCourses]);

  if (isLoadingCourses) {
    return (
      <div className="flex w-full h-full flex-1 justify-center items-center">
        <span className="loading loading-infinity w-[150px]" />
      </div>
    );
  }

  if (errorCourses) {
    console.error(errorCourses);
    notFound();
  }

  return (
    <div className="my-8 flex flex-1 flex-col w-full h-full bg-base-200 justify-center items-center gap-6">
      {courses.length === 0 ? (
        <div className="flex w-full h-full flex-1 justify-center items-center">
          <span className="text-xl font-semibold">
            No Courses Available At the Moment
          </span>
        </div>
      ) : (
        <div className="flex flex-col items-center bg-base-100 shadow-xl rounded-lg p-6 w-[85dvw] sm:w-full sm:max-w-screen-sm">
          <div className="flex flex-col items-center text-center mb-5">
            <Image
              alt="logo"
              src={"/assets/imgs/logo.png"}
              width={75}
              height={50}
            />
            <div className="text-lg font-light mt-2 text-white">
              <p>Course Registration Form</p>
              <p className="text-yellow-500 font-semibold">
                Your Information is safe with us
              </p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className={formStyle.form}>
            {joinCourseFields.map((field) => (
              <div key={field.name} className="form-group">
                <label htmlFor={field.name}>{field.label}</label>
                {field.type === "select" ? (
                  <select
                    name={field.name}
                    value={
                      formData[field.name as keyof RegisterCourseFormProps]
                    }
                    onChange={handleChange}
                  >
                    <option value="">Select...</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title} - {course.price} EGP
                      </option>
                    ))}
                  </select>
                ) : field.type === "phone" ? (
                  <ReactPhoneInput
                    autoFormat={false}
                    inputProps={{
                      name: field.name,
                      required: true,
                      className: "phone-input", // Apply the input class here
                    }}
                    onlyCountries={["eg"]}
                    country={"eg"}
                    value={formData.whatsapp}
                    countryCodeEditable={false}
                    onChange={(phoneValue, countryData: CountryProps) => {
                      setFormData({
                        ...formData,
                        whatsapp: phoneValue,
                        countryCode: countryData.countryCode.toUpperCase(),
                      });
                    }}
                    containerClass="phone-input-container"
                    buttonClass="phone-input-button"
                    inputClass="phone-input"
                    disableDropdown={true}
                    disableSearchIcon={true}
                  />
                ) : field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    value={
                      formData[field.name as keyof RegisterCourseFormProps]
                    }
                    onChange={handleChange}
                  />
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={
                      formData[field.name as keyof RegisterCourseFormProps]
                    }
                    onChange={handleChange}
                  />
                )}
                {errors[field.name as keyof RegisterCourseFormProps] && (
                  <div className="text-red-600 font-semibold">
                    {errors[field.name as keyof RegisterCourseFormProps]}
                  </div>
                )}
              </div>
            ))}

            <button
              type={isSubmitting ? "button" : "submit"}
              className={`flex items-center justify-center ${
                isSubmitting || loading ? formStyle.button_success : ""
              }`}
              disabled={isSubmitting || success}
            >
              {loading ? (
                <span className="loading loading-spinner loading-md"></span>
              ) : (
                "Submit"
              )}
            </button>

            {success && (
              <p className="text-green-600 font-semibold mx-auto text-center">
                Your data has been registered; we will contact you soon.{" "}
              </p>
            )}
          </form>
        </div>
      )}
      <Analytics />
      <SpeedInsights />
    </div>
  );
};

export default JoinCourse;
