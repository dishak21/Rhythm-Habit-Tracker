import { LuBrainCircuit } from "react-icons/lu";
import { useEffect, useState } from "react";
import ChatTypingEffect from "../ui/ChatTyping";
import { Spinner } from "@nextui-org/react";
import { FaCheckCircle } from "react-icons/fa";
import Confetti from 'react-confetti';

const apiUrl = process.env.NEXT_PUBLIC_FLASK_API_URL;

const ChatBot = ({
  habit_id,
  user_id,
  setCachedSchedules,
  cachedSchedules,
  setScheduleGenerated
}: {
  habit_id: string;
  user_id: string;
  setCachedSchedules?: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  cachedSchedules?: Record<string, any>;
  setScheduleGenerated?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [chatResponse, setChatResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [scheduleItems, setScheduleItems] = useState<any[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({ 
    width: typeof window !== 'undefined' ? window.innerWidth : 0, 
    height: typeof window !== 'undefined' ? window.innerHeight : 0 
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setWindowDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        });
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);
  // Query Chat Bot Assistant
  const queryAssistant = async () => {
    try {
      // If we have cached data, use it instead of making an API call
      if (cachedSchedules && cachedSchedules[habit_id]) {
        setScheduleItems(cachedSchedules[habit_id].items || []);
        setCompletedTasks(cachedSchedules[habit_id].completed || {});
        if (setScheduleGenerated) setScheduleGenerated(true);
        return;
      }
      
      setLoading(true);
      setChatResponse("");
      
      const response = await fetch(`${apiUrl}/api/chatbot/get`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ habit_id, user_id }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const result = await response.json();
      setChatResponse(result.data);
      
      // Parse the JSON response if it's in JSON format
      try {
        const parsedSchedule = JSON.parse(result.data);
        const formattedItems = [];
        
        for (const [task, timeRange] of Object.entries(parsedSchedule)) {
          if (Array.isArray(timeRange) && timeRange.length === 2) {
            formattedItems.push({
              task: task.replace(/["']/g, ''),
              startTime: timeRange[0].replace(/["']/g, ''),
              endTime: timeRange[1].replace(/["']/g, '')
            });
          }
        }
        
        setScheduleItems(formattedItems);
        
        // Cache the results if caching is enabled
        if (setCachedSchedules && cachedSchedules) {
          const newCachedSchedules = {
            ...cachedSchedules,
            [habit_id]: {
              items: formattedItems,
              completed: {},
              timestamp: Date.now()
            }
          };
          
          setCachedSchedules(newCachedSchedules);
          localStorage.setItem('habitSchedules', JSON.stringify(newCachedSchedules));
          
          // Update button state
          if (setScheduleGenerated) setScheduleGenerated(true);
        }
      } catch (e) {
        console.error("Error parsing schedule data:", e);
      }
    } catch (error) {
      console.error("Error posting message:", error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle completion status
  const toggleCompletion = (taskIndex: number) => {
    const newCompletedTasks = {
      ...completedTasks,
      [taskIndex]: !completedTasks[taskIndex]
    };
    
    setCompletedTasks(newCompletedTasks);
    
    // Update cached data with new completion status
    if (setCachedSchedules && cachedSchedules && cachedSchedules[habit_id]) {
      const newCachedSchedules = {
        ...cachedSchedules,
        [habit_id]: {
          ...cachedSchedules[habit_id],
          completed: newCompletedTasks
        }
      };
      
      setCachedSchedules(newCachedSchedules);
      localStorage.setItem('habitSchedules', JSON.stringify(newCachedSchedules));
    }

    const allTasksCompleted = scheduleItems.length > 0 && 
      scheduleItems.every((_, index) => newCompletedTasks[index]);
    
    if (allTasksCompleted) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 10000); // Stop confetti after 5 seconds
    }
  };

  // Trigger queryAssistant in useEffect
  useEffect(() => {
    if (habit_id !== "") {
      queryAssistant();
    }
  }, [habit_id]);

  return (
    <>
      {showConfetti && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={false}
          numberOfPieces={500}
        />
      )}

      {/* If no task is selected, chatbot is idle */}
      {habit_id === "" && (
        <div className="flex flex-col items-center">
          <div>
            <LuBrainCircuit className="h-12 w-12 text-slate-300 mb-4 animate-pulse" />
          </div>
          <div className="font-normal">Advisor is idle</div>
          <small>Please click on a task to get smart feedback</small>
        </div>
      )}
      
      {/* Display Chatbot if habit is selected */}
      {habit_id !== "" && (
        <div className="h-full w-full rounded-xl text-sm bg-black/50 p-6 text-justify flex flex-col">
          {loading === true ? (
            <div className="flex flex-col items-center self-center mx-auto text-center">
              <div className="mb-3">
                <Spinner size="lg" color="default" />
              </div>
              <div className="font-normal">Advisor is thinking</div>
              <small>Please Wait...</small>
            </div>
          ) : (
            <div className="w-full">
              {scheduleItems.length > 0 ? (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left p-2">Task</th>
                      <th className="text-left p-2">Start Time</th>
                      <th className="text-left p-2">End Time</th>
                      <th className="text-center p-2">Completed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scheduleItems.map((item, index) => (
                      <tr key={index} className="border-b border-white/10">
                        <td className="p-2">{item.task}</td>
                        <td className="p-2">{item.startTime}</td>
                        <td className="p-2">{item.endTime}</td>
                        <td className="p-2 text-center">
                          <button 
                            onClick={() => toggleCompletion(index)}
                            className="focus:outline-none"
                          >
                            <FaCheckCircle 
                              className={`h-6 w-6 ${completedTasks[index] ? 'text-green-500' : 'text-gray-500'}`}
                            />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <ChatTypingEffect chatResponse={chatResponse} />
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ChatBot;