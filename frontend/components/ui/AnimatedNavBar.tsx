// components/ui/AnimatedNavBar.tsx
"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import NavBar from "./NavBar";
import useAuth from "@/hooks/useAuth";

export default function AnimatedNavBar() {
  const { user } = useAuth();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (user) {
      setLoaded(true);
    }
  }, [user]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={loaded ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 700,
        type: "spring",
        stiffness: 100, // Controls the "bounce" effect
        damping: 10, // Controls the "recoil" or overshoot
      }}
    >
      <NavBar />
    </motion.div>
  );
}
