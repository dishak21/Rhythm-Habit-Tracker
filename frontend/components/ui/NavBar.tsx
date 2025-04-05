"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import NavBarAvatar from "./NavBarAvatar";
import { useState } from "react";
import { useGlobalContext } from "@/contexts/GlobalContext";

type ThemeColor = "emerald" | "amber" | "purple" | "slate";

const NavBar = () => {
  const { globalTheme } = useGlobalContext();
  const { user } = useAuth();
  const current_url = usePathname();
  const [themecolor, setThemeColor] = useState<ThemeColor>("purple");

  return (
    <nav
      className={`sm:mx-5 sm:rounded-[35px]  sm:mt-10 bg-${globalTheme}-600 px-5 shadow-sm justify-between flex py-2 items-center`}
    >
      <Link href="/dashboard" prefetch={false}>
      <img
          src="/img/rhythm_logo2.png"
          className="w-[120px]"
          alt="Habitify logo"
        />
        </Link>
      <ul
        className={`bg-${globalTheme}-700 p-[2px] rounded-full gap-7 shadow-[inset_0_0_4px_rgba(0,0,0,0.3)] text-white items-center hidden sm:flex`}
      >
        {/* Check if current URL is actual page */}
        {current_url == "/dashboard" ? (
          <li
            className={`bg-white rounded-full text-${globalTheme}-600 font-bold px-4 py-2`}
          >
            Dashboard
          </li>
        ) : (
          <Link href="/dashboard" prefetch={false}>
            <li
              className={`hover:bg-white hover:text-${globalTheme}-600 rounded-full text-white  px-4 py-2 transition-all duration-200`}
            >
              Dashboard
            </li>
          </Link>
        )}
        {/* Check if current URL is actual page */}
        {current_url == "/habits" ? (
          <li
            className={`bg-white rounded-full text-${globalTheme}-600 font-bold px-4 py-2`}
          >
            Create Habits
          </li>
        ) : (
          <Link href="/habits" prefetch={false}>
            <li
              className={`hover:bg-white  hover:text-${globalTheme}-600 rounded-full text-white  px-4 py-2 transition-all duration-200`}
            >
              Create Habits
            </li>
          </Link>
        )}
        {/* Check if current URL is actual page */}
        {current_url == "/about" ? (
          <li
            className={`bg-white rounded-full text-${globalTheme}-600 font-bold px-4 py-2`}
          >
            About Us
          </li>
        ) : (
          <Link href="/about" prefetch={false}>
            <li
              className={`hover:bg-white  hover:text-${globalTheme}-600 rounded-full text-white  px-4 py-2 transition-all duration-200`}
            >
              About Us
            </li>
          </Link>
        )}{" "}
        
      </ul>
      <NavBarAvatar user={user} setMenuColor={setThemeColor} />
    </nav>
  );
};

export default NavBar;
