"use client";
import { useAuthUser } from "@/hooks/auth";
import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { logout } from "@/store/slices/authSlice";
import { signoutUser } from "@/frontendServices/auth";

const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const dispatch = useDispatch();
  const authState = useSelector((state: RootState) => state.auth);
  const handleSignOut = async () => {
    try {
      await signoutUser();
      dispatch(logout());
    } catch (error) {
      console.log(error);
    }
  };
  useAuthUser();

  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current && menuRef.current) {
        if (window.scrollY > 100) {
          navRef.current.classList.add("nav_scrolled");
          menuRef.current.classList.add("nav_menu_scrolled");
        } else {
          navRef.current.classList.remove("nav_scrolled");
          menuRef.current.classList.remove("nav_menu_scrolled");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        navRef.current &&
        !navRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (menuRef.current && window.scrollY > 100) {
      menuRef.current.classList.add("nav_menu_scrolled");
    } else {
      menuRef.current!.classList.remove("nav_menu_scrolled");
    }
  }, [isMenuOpen]);

  return (
    <nav ref={navRef} className="bg-base-300 sticky top-0 z-[15] p-3">
      <Link
        href="/"
        className="flex items-center sm:hover:bg-gray-800 py-1 px-3 rounded-lg gap-2 active:scale-95 transition-all"
        aria-label="Home"
      >
        <Image src="/assets/imgs/logo.png" alt="Logo" width={45} height={10} />
        <span className="font-extrabold text-xl  md:text-2xl text-white whitespace-nowrap">
          Syntax Error
        </span>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden sm:flex gap-6">
        <ul className="flex items-center text-lg font-semibold space-x-5">
          <li className="nav_buttons">
            <Link href="/">Home</Link>
          </li>
          <li className="nav_buttons">
            <Link href="/courses">Courses</Link>
          </li>
          {authState.isAuthenticated &&
            (authState.role === 1 || authState.role === 2) && (
              <li className="nav_buttons">
                <Link href="/dashboard">Dashboard</Link>
              </li>
            )}
          {!authState.isAuthenticated ? (
            <li className="nav_buttons">
              <Link href="/authportal">Sign In</Link>
            </li>
          ) : (
            <li className="nav_buttons">
              <button onClick={handleSignOut} type="button">
                Sign Out
              </button>
            </li>
          )}
        </ul>
      </div>

      {/* Mobile Navigation Menu */}
      <div className="sm:hidden relative">
        <button
          className="w-10 h-10"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          <Image
            src="/assets/icons/menu.svg"
            alt="Menu"
            width={40}
            height={40}
          />
        </button>

        {/* Mobile Menu */}
        <ul
          ref={menuRef}
          className={`absolute top-12 right-0 w-40 bg-base-300 shadow-md rounded-lg p-3 space-y-3 text-lg transition-all ${
            isMenuOpen
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <li>
            <Link href="/" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/courses" onClick={() => setIsMenuOpen(false)}>
              Courses
            </Link>
          </li>
          {authState.isAuthenticated &&
            (authState.role === 1 || authState.role === 2) && (
              <li>
                <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                  Dashboard
                </Link>
              </li>
            )}
          {!authState.isAuthenticated ? (
            <li>
              <Link href="/authportal" onClick={() => setIsMenuOpen(false)}>
                Sign In
              </Link>
            </li>
          ) : (
            <li>
              <button onClick={handleSignOut} type="button">
                Sign Out
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Nav;
