"use client";

import ModalWindow from "@/components/ModalWindow";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, Auth } from "firebase/auth";
import { app } from "@/lib/firebase"; // Ensure the Firebase config is properly imported
import SignInButton from "@/components/SignInButton";

export default function SignIn() {
  const [modal, setModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const auth: Auth = getAuth(app);

  useEffect(() => {
    // Check if we're running on the client-side
    if (typeof window !== "undefined") {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          // Redirect to dashboard if the user is authenticated
          router.push("/dashboard");
        } else {
          // Stop loading if the user is not authenticated
          setLoading(false);
        }
      });

      // Clean up the listener on component unmount
      return () => unsubscribe();
    }
  }, [auth, router]);

  // Optionally show a loading indicator while checking auth state
  if (loading)
    return (
      <div className="w-full h-full bg-purple-700 flex items-center justify-center text-white min-h-screen">
        <p>Loading...</p>
      </div>
    );

  return (
    <>
      <ModalWindow
        onClose={() => setModal(false)}
        show={modal}
        edit_method="Add"
      />
      <div className="bg-gradient-to-br from-indigo-800 to-pink-900 text-white mx-auto h-full min-h-screen items-center justify-center flex flex-col">
        <div className="p-8 rounded-xl shadow-lg bg-white/10 border w-[25rem] border-white/15 flex items-center justify-center flex-col gap-3">
          <img className="w-[180px] mb-4" src="/img/rhythm_login.png" />
          <h2 className="text-[2rem] font-normal">Sign Up to Rhythm</h2>
          <h3 className="text-[0.8rem] text-center">
            To start using Rhythm and become a master in the art of completion
            and self-improvement, please use google sign-in below.
          </h3>
          {/* <button
            onClick={() => setModal(true)}
            className="bg-orange-500 text-white rounded-full p-2"
          >
            Open Modal
          </button> */}
          <SignInButton />
        </div>
      </div>
    </>
  );
}
