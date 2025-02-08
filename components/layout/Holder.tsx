"use client";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { usePathname, useRouter } from "next/navigation";
import Footer from "./Footer";
import CustomProvider from "./CustomProvider";
import Nav from "./Nav";
import { useEffect } from "react";

const Holder: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
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

  useEffect(() => {
    if (
      process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true" &&
      pathName !== "/maintenance"
    ) {
      router.replace("/maintenance");
    }
  }, [router, pathName]);

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
