// app/auth/signin/page.js
"use client";
import { signInWithGoogle } from "@/lib/authController";
import { AiFillGoogleCircle } from "react-icons/ai";

/**
 * SignInButton Component
 *
 * A client-side component that renders a button for signing in with Google
 * The primary button uses Google
 * authentication and displays an icon alongside the text.
 *
 * @component
 * @file app/auth/signin/page.js
 * @description Renders buttons for user authentication.
 *
 * @requires "@/lib/authController" - Contains the `signInWithGoogle` function.
 * @requires "react-icons/ai" - Provides the Google icon (`AiFillGoogleCircle`).
 *
 * @returns {JSX.Element} The rendered button components.
 *
 * @example
 * // Example Usage
 * <SignInButton />
 */
const SignInButton = () => {
  return (
    <>
      <button className="signup-button  flex w-full" onClick={signInWithGoogle}>
        <AiFillGoogleCircle className="w-[30px] h-[30px]" />{" "}
        <span className="font-bold">Sign in with Google</span>
      </button>
    </>
  );
};

export default SignInButton;
