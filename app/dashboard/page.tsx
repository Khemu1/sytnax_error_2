"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import MyAccount from "@/components/dashboard/myAccount/MyAccount";
import { RootState } from "@/store/store";
import NewCourse from "@/components/dashboard/course/NewCourse";
import Courses from "@/components/dashboard/course/Courses";
import Admins from "@/components/dashboard/admin/Admins";
import Owners from "@/components/dashboard/owner/Owners";
import { logout } from "@/store/slices/authSlice";

const Admin = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const routeTo = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state: RootState) => state.auth);
  const [section, setSection] = useState("newCourse");
  useEffect(() => {
    const localStorageAuth = localStorage.getItem("userData");
    if (localStorageAuth) {
      const { role } = JSON.parse(localStorageAuth);

      // Check if the user is authenticated
      if (!authState.isAuthenticated) {
        dispatch(logout());
      }

      // Role-based navigation
      if (role !== 1 && role !== 2) {
        routeTo.push("/");
      } else {
        if (role === 1) {
          setSection("myaccount");
        }
      }
    } else {
      routeTo.push("/signin");
    }
  }, [authState.isAuthenticated, dispatch, routeTo]);

  if (!authState.isAuthenticated) {
    return (
      <div className="flex w-full h-full my-auto justify-center items-center">
        <span className="loading loading-infinity w-[150px]" />
      </div>
    );
  }

  return (
    <div className="admin_dashboard relative">
      <div className="mt-5 lg:hidden">
        <button
          className="flex left-4 top-3 w-[32px] h-[32px]"
          onClick={() => setIsSideBarOpen(true)}
        >
          <Image
            alt="sidebar"
            src={"/assets/icons/sidebar.svg"}
            width={32}
            height={32}
          />
        </button>
      </div>
      <aside className={`bg-base-100 `}>
        {authState.isAuthenticated && authState.role === 1 && (
          <>
            <button
              className={`${
                section === "courses"
                  ? "bg-gray-800"
                  : "transition-all hover:bg-gray-700"
              }`}
              onClick={() => setSection("courses")}
            >
              Courses
            </button>
            <button
              className={`${
                section === "admins"
                  ? "bg-gray-800"
                  : "transition-all hover:bg-gray-700"
              }`}
              onClick={() => setSection("admins")}
            >
              Admins
            </button>
            <button
              className={`${
                section === "owners"
                  ? "bg-gray-800"
                  : "transition-all hover:bg-gray-700"
              }`}
              onClick={() => setSection("owners")}
            >
              Owners
            </button>
          </>
        )}
        <button
          className={`${
            section === "newCourse"
              ? "bg-gray-800"
              : "transition-all hover:bg-gray-700"
          }`}
          onClick={() => setSection("newCourse")}
        >
          New Course
        </button>
        <button
          className={`${
            section === "myaccount"
              ? "bg-gray-800"
              : "transition-all hover:bg-gray-700"
          }`}
          onClick={() => setSection("myaccount")}
        >
          My Account
        </button>
      </aside>

      <aside
        className={`bg-base-100 aside_mobile ${
          !isSideBarOpen ? "aside_mobile_closed" : ""
        }`}
      >
        <button
          className="text-white flex justify-center bg-blue-600 mb-5 h-max"
          onClick={() => setIsSideBarOpen(false)}
        >
          Close SideBar
        </button>
        {authState.isAuthenticated && authState.role === 1 && (
          <>
            <button
              className={`${
                section === "courses"
                  ? "bg-gray-800"
                  : "transition-all hover:bg-gray-700"
              }`}
              onClick={() => setSection("courses")}
            >
              Courses
            </button>
            <button
              className={`${
                section === "admins"
                  ? "bg-gray-800"
                  : "transition-all hover:bg-gray-700"
              }`}
              onClick={() => setSection("admins")}
            >
              Admins
            </button>
            <button
              className={`${
                section === "owners"
                  ? "bg-gray-800"
                  : "transition-all hover:bg-gray-700"
              }`}
              onClick={() => setSection("owners")}
            >
              Owners
            </button>
          </>
        )}
        <button
          className={`${
            section === "newCourse"
              ? "bg-gray-800"
              : "transition-all hover:bg-gray-700"
          }`}
          onClick={() => setSection("newCourse")}
        >
          New Course
        </button>
        <button
          className={`${
            section === "myaccount"
              ? "bg-gray-800"
              : "transition-all hover:bg-gray-700"
          }`}
          onClick={() => setSection("myaccount")}
        >
          My Account
        </button>
      </aside>
      <section>
        {section === "newCourse" && <NewCourse />}
        {section === "courses" && <Courses />}
        {section === "admins" && <Admins />}
        {section === "owners" && <Owners />}
        {section === "myaccount" && <MyAccount />}
      </section>
    </div>
  );
};

export default Admin;
