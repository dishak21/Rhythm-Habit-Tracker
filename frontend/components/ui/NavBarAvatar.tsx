import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { User } from "firebase/auth";
import { AnimatePresence, motion } from "framer-motion";
import { signOutUser } from "@/lib/authController";
import { useRouter } from "next/navigation";
import { BiSolidExit } from "react-icons/bi";
import { IoIosSettings } from "react-icons/io";
import { RiDashboard3Fill } from "react-icons/ri";

import { useGlobalContext } from "@/contexts/GlobalContext";

type ThemeColor = "emerald" | "amber" | "purple" | "slate";

interface NavBarAvatarProps {
  user: User | null;
  setMenuColor: React.Dispatch<React.SetStateAction<ThemeColor>>; // Match the parent type
}

const colors = [
  { name: "emerald", value: "bg-emerald-700", hex: "#047857" },
  { name: "purple", value: "bg-purple-800", hex: "#6b21a8" },
  { name: "amber", value: "bg-amber-500", hex: "#b45309" },
  { name: "slate", value: "bg-slate-700", hex: "#334155" },
];

const NavBarAvatar = ({ user, setMenuColor }: NavBarAvatarProps) => {
  const [menu, setMenu] = useState<boolean>(false);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const { globalTheme, setGlobalTheme } = useGlobalContext();

  const [bgColor, setBgColor] = useState("emerald"); // Initial background color
  const [submenucolor, setSubMenuColor] = useState(globalTheme); // Initial background color

  useEffect(() => {
    setSubMenuColor(globalTheme);

    const colorBox = document.getElementById("bg_color_container");
    if (colorBox) {
      // Find the color object
      const bg_update = colors.find((color) => color.name === globalTheme);

      // Safely access the hex value or use a fallback
      colorBox.style.backgroundColor = bg_update?.hex || "#333333"; // Fallback to white if undefined
    }
  }, [globalTheme]); // Dependency array includes globalTheme

  const toggleMenu = () => {
    setMenu(!menu);
  };

  // Logout and Redirect to sign-in page after logout
  const handleLogout = async () => {
    try {
      await signOutUser();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Close the menu if clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenu(false);
      }
    };

    // Add event listener when menu is open
    if (menu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menu]);

  return (
    <div className="relative flex" ref={menuRef}>
      {" "}
      {user && user.photoURL && (
        <motion.div
          whileHover={{
            scale: 1.1,
          }}
          whileTap={{
            scale: 0.9,
            transition: { type: "spring", stiffness: 200 },
          }}
          onClick={toggleMenu}
          className="inline-block rounded-full hover:border-purple-200 hover:border-2 border-2 border-purple-800  shadow-sm cursor-pointer"
        >
          <Image
            src={user.photoURL}
            width={50}
            height={50}
            alt="User profile"
            className="rounded-full"
          />
        </motion.div>
      )}
      <AnimatePresence>
        {menu && (
          <motion.div
            initial={{ y: 80 }}
            animate={{ y: 60 }}
            transition={{
              type: "spring",
              stiffness: 200, // Lower stiffness for more elasticity
              damping: 10, // Lower damping for more bounce
              bounce: 0.8, // Bounce factor (0 to 1)
            }}
            exit={{ opacity: 0, y: 80, transition: { type: "linear" } }}
            className={`absolute right-0 mt-2 w-56 rounded-2xl shadow-lg bg-${submenucolor}-600 p-2 ring-1 ring-black ring-opacity-5 focus:outline-none z-10`}
          >
            <div className="flex gap-2 mb-3 py-4 border-b border-white/50 justify-center text-white/70 items-center">
              Theme:
              {colors.map((color, index) => (
                <button
                  onClick={() => {
                    setBgColor(globalTheme);
                    setMenuColor(color.name as ThemeColor);
                    setSubMenuColor(color.name);
                    setGlobalTheme(color.name);
                  }}
                  className={`${color.value} ${
                    color.name == globalTheme ? "border-white/50 border-2" : ""
                  } w-6 h-6 rounded-full hover:border-white/30 hover:border-2 `}
                  key={index}
                ></button>
              ))}
            </div>
            <ul className="text-white">
              <li
                onClick={() => {
                  toggleMenu(); // Call your additional function here
                  router.push("/dashboard"); // Navigate to "/tests"
                }}
                className="hover:bg-white flex gap-1 rounded-full py-2 pl-4 items-center hover:text-purple-800 cursor-pointer "
              >
                <RiDashboard3Fill />
                User Dashboard
              </li>
              <li
                onClick={() => {
                  toggleMenu(); // Call your additional function here
                  router.push("/habits  "); // Navigate to "/tests"
                }}
                className="hover:bg-white flex gap-1 rounded-full py-2 pl-4 items-center hover:text-purple-800 cursor-pointer "
              >
                <IoIosSettings />
                Create Habits
              </li>
              <li
                onClick={handleLogout}
                className="hover:bg-red-700 rounded-full py-2 pl-4 hover:text-white cursor-pointer  flex gap-1 items-center"
              >
                <BiSolidExit /> Logout
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavBarAvatar;
