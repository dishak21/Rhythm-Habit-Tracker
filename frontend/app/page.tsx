"use client";

import ModalWindow from "@/components/ModalWindow";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, Auth } from "firebase/auth";
import { app } from "@/lib/firebase"; // Ensure the Firebase config is properly imported
import Link from "next/link";

export default function HomePage() {
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
      <div className="text-slate-600 text-[2rem] w-[300px]">
          <img src="/img/rhythm_logo2.png" />
        </div>
        <div className="text-white text-sm flex mx-auto">
          <Link href="/signin">
            <button className="text-white mt-5 ">
              Create an account or <span className=" underline font-bold">Sign In</span>
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
