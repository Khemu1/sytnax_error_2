"use client";
import React, { useEffect } from "react";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { useCheckResetToken } from "@/hooks/auth";

const Page: React.FC = () => {
  const searchParams = useSearchParams();
  const routeTo = useRouter();
  const { success, error, handleCheckResetToken } = useCheckResetToken();

  useEffect(() => {
    if (success) {
      routeTo.push("/reset-password");
    }
  }, [success]);


  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      return notFound();
    } else {
      handleCheckResetToken(token);
    }
  }, [searchParams, error]);

  if (error) {
    console.log(error);
    return notFound();
  }
  return (
    <div className="flex flex-grow justify-center items-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );
};

export default Page;
