"use client";

import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import ProtectedRoute from "@/components/auth/ProtectedRoutes";
import ListHabits from "@/components/habits/ListHabits";
import HabitsModal from "@/components/habits/HabitsModal";
import ChatBot from "@/components/chatbot/ChatBot";
import getFormattedDate from "@/utils/helpers";

// Global Context Variables
import { useGlobalContext } from "@/contexts/GlobalContext";

// NextUI imports
import { CircularProgress } from "@nextui-org/react";
import HabitBarChart from "@/components/habits/HabitDistribution";

const DashBoard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState("");
  const [habitsModal, setHabitsModal] = useState(false);
  const [habitId, setHabitId] = useState("");
  const [habitCat, setHabitCat] = useState({});
  const [totalHabits, setTotalHabits] = useState(0);
  const [completedHabits, setCompletedHabits] = useState(0);

  // Global theme color setter and getter
  const { globalTheme } = useGlobalContext();

  // Date selection management
  const [date, SetDate] = useState(getFormattedDate(new Date()));

  /**
   * Function to retrieve user information from the ProtectedRoute middleware
   */
  const handleAuthSuccess = async (user_details: User) => {
    const token = await user_details.getIdToken();
    setToken(token);
    setUser(user_details); // Store the user info in state
  };

  // Calculate completion percentage
  const getCompletionPercentage = () => {
    if (totalHabits === 0) return 100; // If no habits, show 100% complete
    return ((completedHabits) / totalHabits) * 100;
  };

  useEffect(() => {
    if (habitsModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [habitsModal]);

  return (
    <ProtectedRoute onAuthSuccess={handleAuthSuccess}>
      {user ? ( // Render only when the user is authenticated
        <>
          {/* Habits Modal */}
          {habitsModal && (
            <div
              className="bg-black/75 w-full h-screen absolute top-0 left-0 flex items-center justify-center z-20"
              onClick={() => setHabitsModal(false)} // Close modal on overlay click
            >
              <div
                className="bg-slate-700 max-w-4xl rounded-xl p-4 relative z-20"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
              >
                <HabitsModal
                  user={user.uid}
                  onClose={() => setHabitsModal(false)}
                />
              </div>
            </div>
          )}
          {/* Habits Modal */}

          <h1 className="text-white/75 mb-3">
            Welcome back, <span className="">{user.displayName}</span>
          </h1>

          <div className="w-full flex flex-col gap-3 sm:flex-row mb-8">
            {/* Habits List */}
            <div className="sm:w-2/5 min-h-full  w-full">
              <div className="bg-white/10 border text-white w-full h-full border-white/15 backdrop-blur-md flex flex-col transition-all rounded-3xl py-4 px-4 sm:col-span-3 row-span-2">
                <h3 className="mb-4">Active Habits for {date}</h3>
                <ListHabits
                  token={token}
                  user_id={user.uid}
                  setHabitId={setHabitId}
                  setHabitCat={setHabitCat}
                  setTotalHabits={setTotalHabits}
                  setCompletedHabits={setCompletedHabits}
                />
              </div>
            </div>
            {/* Habits List */}

            <div className=" flex flex-col gap-3 sm:w-3/5 w-full ">
              {/* Daily Completion */}
              <div className=" sm:flex flex-row gap-3  w-full">
                <div className="w-full sm:mb-0 mb-3">
                  <div className="bg-white/10 border text-white w-full border-white/15 backdrop-blur-md transition-all flex flex-col rounded-3xl py-4 px-4 sm:col-span-2 min-h-[150px]">
                    <h3 className="mb-4">Daily Completion</h3>
                    <div className="w-full h-full flex flex-col  items-center justify-center">
                      <CircularProgress
                        classNames={{
                          svg: "w-52 h-52 drop-shadow-md",
                          indicator: `stroke-${globalTheme}-500`,
                          track: "stroke-white/10",
                          value: "text-3xl font-semibold text-white",
                        }}
                        value={getCompletionPercentage()}
                        strokeWidth={4}
                        showValueLabel={true}
                        aria-label="Completion Circle"
                      />
                      <small className="mt-5"></small>
                    </div>
                  </div>
                </div>
                <div className="flex h-full w-full">
                  <div className="bg-white/10 border text-white w-full border-white/15 backdrop-blur-md transition-all rounded-3xl  py-4 px-4 sm:col-span-2 min-h-[150px] ">
                    <h3 className="mb-4">Habits Distribution</h3>
                    <div className="flex h-full w-full items-center justify-center">
                      {/* Categories Chart */}
                      {Object.keys(habitCat).length > 0 && (
                        <HabitBarChart habitCat={habitCat} />
                      )}
                      {/* Categories Chart */}
                    </div>
                  </div>
                </div>
              </div>
              {/* Daily Completion */}

              
            </div>
          </div>
        </>
      ) : (
        // Loading placeholder while waiting for user authentication
        <div className="flex items-center justify-center h-screen">
          <p>Loading user information...</p>
        </div>
      )}
    </ProtectedRoute>
  );
};

export default DashBoard;