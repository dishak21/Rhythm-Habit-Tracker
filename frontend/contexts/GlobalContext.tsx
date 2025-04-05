// contexts/GlobalContext.js
"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

interface GlobalProviderProps {
  children: ReactNode; // Type the children prop
}

interface GlobalContextType {
  globalTheme: string;
  setGlobalTheme: Dispatch<SetStateAction<string>>; // Correctly type setGlobalTheme
}

const GlobalContext = createContext<GlobalContextType>({
  globalTheme: "",
  setGlobalTheme: () => {}, // Temporary no-op function as a default
});

export const GlobalProvider = ({ children }: GlobalProviderProps) => {
  const [globalTheme, setGlobalTheme] = useState("purple");

  // Load the theme from local storage on component mount
  useEffect(() => {
    const storedTheme = localStorage.getItem("globalTheme");
    if (storedTheme) {
      console.log("Restored theme from local storage:", storedTheme);
      setGlobalTheme(storedTheme);
    } else {
      console.log("No stored theme found. Setting default theme to 'purple'.");
      localStorage.setItem("globalTheme", "purple"); // Store the default theme
    }
  }, []);

  // Update local storage whenever the theme changes
  useEffect(() => {
    localStorage.setItem("globalTheme", globalTheme);
  }, [globalTheme]);

  return (
    <GlobalContext.Provider value={{ globalTheme, setGlobalTheme }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
