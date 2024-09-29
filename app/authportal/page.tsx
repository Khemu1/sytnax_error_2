"use client";
import React, { useState } from "react";
import SendToEmail from "@/components/signin/SendToEmail";
import SignInForm from "@/components/signin/SignInForm";

const AuthPortal = () => {
  const [tab, setTab] = useState<"signin" | "sendemail">("signin");

  const handleTabChange = (newTab: "signin" | "sendemail") => {
    setTab(newTab);
  };

  return (
    <div className="flex flex-grow items-center my-10">
      {tab === "signin" && <SignInForm changeTabTo={handleTabChange} />}
      {tab === "sendemail" && <SendToEmail changeTabTo={handleTabChange} />}
    </div>
  );
};

export default AuthPortal;
