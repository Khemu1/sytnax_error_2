"use client";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { usePathname } from "next/navigation";
import Footer from "./Footer";
import CustomProvider from "./CustomProvider";
import Nav from "./Nav";

const Holder: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathName = usePathname();
  const noNavPaths = ["/signin", "/preview", "/build", "/quiz"];
  const noFooterPaths = [
    "/admin",
    "/signin",
    "/dashboard",
    "/preview",
    "/quiz",
  ];

  const shouldHideNav = noNavPaths.some((path) => pathName.includes(path));
  const shouldHideFooter = noFooterPaths.some((path) =>
    pathName.startsWith(path)
  );

  return (
    <CustomProvider>
      {!shouldHideNav && <Nav />}
      {children}
      {!shouldHideFooter && <Footer />}
      <SpeedInsights />
    </CustomProvider>
  );
};

export default Holder;
