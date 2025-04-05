"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { User } from "firebase/auth";
import { getHabitById } from "@/data/ApiParser";
import ChatBot from "@/components/chatbot/ChatBot";
import ProtectedRoute from "@/components/auth/ProtectedRoutes";

const HabitDetail = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState("");
  const [habit, setHabit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const [showChatBot, setShowChatBot] = useState(false);
  const [scheduleGenerated, setScheduleGenerated] = useState(false);
  const [cachedSchedules, setCachedSchedules] = useState<Record<string, any>>({});
  
  const handleAuthSuccess = async (user_details: User) => {
    const token = await user_details.getIdToken();
    setToken(token);
    setUser(user_details);
  };
  
  useEffect(() => {
    // Try to load cached schedules from localStorage when component mounts
    const savedSchedules = localStorage.getItem('habitSchedules');
    if (savedSchedules) {
      setCachedSchedules(JSON.parse(savedSchedules));
    }
  }, []);
  
  // Check if we have a cached schedule for this habit
  useEffect(() => {
    if (params.id && cachedSchedules[params.id as string]) {
      setScheduleGenerated(true);
      setShowChatBot(true);
    }
  }, [params.id, cachedSchedules]);
  
  useEffect(() => {
    if (user && token) {
      const habitId = params.id as string;
      fetchHabitDetails(habitId);
    }
  }, [user, token, params.id]);
  
  const fetchHabitDetails = async (habitId: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_FLASK_API_URL;
    setLoading(true);
    try {
      const response = await getHabitById(apiUrl, token, habitId, user?.uid);
      console.log("response", response);
      setHabit(response.data.habit);
    } catch (error) {
      console.error("Error fetching habit details:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleGenerateSchedule = () => {
    setShowChatBot(true);
    setScheduleGenerated(true);
  };
  
  const handleRegenerateSchedule = () => {
    // Remove the cached schedule for this habit
    if (cachedSchedules && cachedSchedules[params.id as string]) {
      const newCachedSchedules = { ...cachedSchedules };
      delete newCachedSchedules[params.id as string];
      setCachedSchedules(newCachedSchedules);
      localStorage.setItem('habitSchedules', JSON.stringify(newCachedSchedules));
    }
    
    // Force the ChatBot to regenerate the schedule
    setShowChatBot(false); // Hide and then show again to trigger useEffect
    setTimeout(() => {
      setShowChatBot(true);
    }, 100);
  };
  
  return (
    <ProtectedRoute onAuthSuccess={handleAuthSuccess}>
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <p>Loading habit details...</p>
        </div>
      ) : (
        <div className="w-full flex flex-col gap-3">
          <h1 className="text-white/75 mb-3">
            Habit Details: {habit?.name}
          </h1>
          
          <div className="bg-white/10 border text-white w-full border-white/15 backdrop-blur-md flex flex-col transition-all rounded-3xl py-4 px-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-blue-500">
                {/* Add icon based on category */}
              </div>
              <div>
                <h2 className="text-xl font-bold">{habit?.name}</h2>
                <p className="text-sm text-white/70">{habit?.category}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-black/20 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Tasks & Durations</h3>
                <table className="w-full">
                  <thead className="border-b border-white/20">
                    <tr>
                      <th className="text-left pb-2">Task</th>
                      <th className="text-left pb-2">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {habit?.user_tasks?.map((task: string, index: number) => (
                      <tr key={index} className="border-b border-white/10">
                        <td className="py-3">{task}</td>
                        <td className="py-3">{habit?.user_duration[index]} min</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="bg-black/20 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Intensity</h3>
                <p>{habit?.user_intensity}</p>
                
                <h3 className="font-semibold mb-2 mt-4">Schedule</h3>
                <p><strong>Type:</strong> {habit?.schedule?.type}</p>
                {habit?.schedule?.type === "Weekly" && (
                  <div className="mt-2">
                    <p><strong>Days:</strong> {habit?.schedule?.days?.join(", ")}</p>
                  </div>
                )}
                {habit?.schedule?.type === "Daily" && habit?.schedule?.excludeWeekends && (
                  <p className="mt-2">Weekends excluded</p>
                )}
              </div>
            </div>
            
            <div className="flex gap-3 mt-4">
              <button 
                onClick={() => router.back()} 
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
              >
                Back to Dashboard
              </button>

              <button 
                onClick={handleGenerateSchedule} 
                className={`px-4 py-2 ${scheduleGenerated ? 'bg-green-600 hover:bg-green-700' : 'bg-purple-600 hover:bg-purple-700'} text-white rounded-lg transition`}
                disabled={scheduleGenerated}
              >
                {scheduleGenerated ? "Schedule Generated" : "Generate Schedule"}
              </button>

              <button 
                onClick={handleRegenerateSchedule} 
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                Regenerate
              </button>
            </div>
          </div>

          {showChatBot && (
            <div className="mt-6">
              <div className="bg-white/10 border text-white w-full border-white/15 backdrop-blur-md flex flex-col transition-all rounded-3xl py-4 px-4">
                <h3 className="mb-4">Habits Assistant</h3>
                <div className="flex items-center justify-center">
                  <ChatBot 
                    habit_id={params.id as string} 
                    user_id={user?.uid as string} 
                    setCachedSchedules={setCachedSchedules}
                    cachedSchedules={cachedSchedules}
                    setScheduleGenerated={setScheduleGenerated}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </ProtectedRoute>
  );
};

export default HabitDetail;