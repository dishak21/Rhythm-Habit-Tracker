import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "../../hooks/useAuth";
import { User } from "firebase/auth";

/**
 * A higher-order component (HOC) to protect routes by verifying user authentication.
 * Redirects unauthenticated users to the login page ("/").
 *
 * @param {ReactNode} children - Components to render if the user is authenticated.
 * @param {(user: User) => void} [onAuthSuccess] - Optional callback executed with the authenticated user object.
 *
 * @returns {ReactNode | null} The `children` if authenticated, otherwise null with a redirection.
 */
const ProtectedRoute = ({
  children,
  onAuthSuccess,
}: {
  children: ReactNode;
  onAuthSuccess?: (user: User) => void; // Optional callback for passing user info
}) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/"); // Redirect to login if not authenticated
      } else if (onAuthSuccess) {
        onAuthSuccess(user); // Pass user info to parent
      }
    }
  }, [user, loading, router, onAuthSuccess]);

  // if (loading) {
  //   return (
  //     <div className="flex w-full min-h-screen  h-full text-white mx-auto items-center justify-center">
  //       <p className="bg-white/10 border-white/15 rounded-full px-4 py-2">
  //         Loading Please Wait ...
  //       </p>
  //     </div>
  //   );
  // }

  return user ? children : null;
};

export default ProtectedRoute;
