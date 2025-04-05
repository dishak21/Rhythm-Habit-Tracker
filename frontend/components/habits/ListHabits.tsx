import { useState, useEffect } from "react";
import { IoMdSettings } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { IoAddCircleSharp } from "react-icons/io5";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Textarea,
  Slider,
} from "@nextui-org/react";

// Import Needed Icons
import {
  FaBookOpen,
  FaCarrot,
  FaHeartbeat,
  FaHome,
  FaPalette,
  FaPiggyBank,
  FaSpa,
  FaTasks,
  FaUsers,
  FaCheckCircle,
  FaCode,
  FaEdit,
} from "react-icons/fa";

import { MdCancel } from "react-icons/md";

interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  category: string;
  user_context: string;
  completed?: boolean;
}

// Icon mapping for resolving string to React component
const iconMapping: Record<string, React.FC<{ className?: string }>> = {
  FaBookOpen,
  FaCarrot,
  FaHeartbeat,
  FaHome,
  FaPalette,
  FaPiggyBank,
  FaSpa,
  FaTasks,
  FaUsers,
  FaCode,
};

const DynamicIcon = ({
  iconName,
  className,
}: {
  iconName: string;
  className?: string;
}) => {
  const IconComponent = iconMapping[iconName];
  return IconComponent ? <IconComponent className={className} /> : null;
};

// Main Component Function
const ListHabits = ({
  user_id,
  token,
  setHabitId,
  setHabitCat,
  setTotalHabits,
  setCompletedHabits
}: {
  user_id: string;
  token: string;
  setHabitId: (id: string) => void;
  setHabitCat: (categories: object) => void;
  setTotalHabits: (count: number) => void;
  setCompletedHabits: (count: number) => void;
}) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [nohabit, setNoHabits] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshHabits, setRefreshHabits] = useState(false);
  const [selectedHabitId, setSelectedHabitId] = useState(null); // Track selected habit
  const apiUrl = process.env.NEXT_PUBLIC_FLASK_API_URL;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();

  const markHabitComplete = (
    event: React.MouseEvent,
    habit_id: string
  ) => {
    event.stopPropagation(); // Prevent event bubbling

    // Update habits state to mark the selected habit as completed
    setHabits(prevHabits => 
      prevHabits.map(habit => 
        habit.id === habit_id ? { ...habit, completed: true } : habit
      )
    );

    // Increment completed habits count
    setCompletedHabits(prev => prev + 1);
  };

  const deleteHabit = async (
    event: React.MouseEvent<SVGElement> | React.MouseEvent, // Accept both event types
    user_id: string,
    habit_id: string
  ) => {
    event.stopPropagation(); // Prevent the event from reaching the parent

    // Find the habit to determine if it was completed
    const habitToDelete = habits.find(h => h.id === habit_id);
    const wasCompleted = habitToDelete?.completed || false;

    try {
      const response = await fetch(`${apiUrl}/api/habits/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token if needed
        },
        body: JSON.stringify({ user_id, habit_id }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to delete habit");
      }

      // Update local state
      setHabits(prevHabits => prevHabits.filter(habit => habit.id !== habit_id));
      setHabitId("");
      
      // Update counts
      setTotalHabits(prev => prev - 1);
      if (wasCompleted) {
        setCompletedHabits(prev => prev - 1);
      }
    } catch (error) {
      console.error("Error deleting habit:", (error as Error).message);
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function fetchHabits() {
      try {
        const response = await fetch(`${apiUrl}/api/habits/get/${user_id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include token if needed
          },
        });
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const result = await response.json();
        
        // Set no habits to true if there are no habits to display
        if (result.habits.length === 0) {
          setNoHabits(true);
          setTotalHabits(0);
          setCompletedHabits(0);
        } else {
          setNoHabits(false);
          // Update total habits count
          setTotalHabits(result.habits.length);
          
          // Each habit needs a completed property, defaulting to false
          const habitsWithCompletion = result.habits.map(habit => ({
            ...habit,
            completed: habit.completed || false
          }));
          
          // Set initial completed count to 0 since we're handling completions on frontend only
          if (isMounted) {
            setCompletedHabits(0);
            setHabits(habitsWithCompletion);
            setHabitCat(result.category_counts);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchHabits();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshHabits]);

  return (
    <div className="flex w-full  flex-col gap-1">
      {/* Habit Completion Modal */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          body: "py-6",
          backdrop: "bg-black/70 backdrop-opacity-40",
          base: "border-[#292f46] bg-slate-800 dark:bg-[#19172c] text-[#a8b0d3]",
          header: "border-b-[1px] border-[#292f46]",
          footer: "border-t-[1px] border-[#292f46]",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Complete task:&nbsp;
                {habits.find((habit) => habit.id === selectedHabitId) ? (
                  <>
                    {habits.find((habit) => habit.id === selectedHabitId).name}
                  </>
                ) : (
                  "Habit not found."
                )}
              </ModalHeader>
              <ModalBody>
                <div className="flex w-full p-5 bg-slate-900 rounded-xl mb-5 h-full">
                  <Slider
                    label="Evaluate how hard or easy it was"
                    color="foreground"
                    size="md"
                    showSteps={true}
                    hideValue={true}
                    step={25}
                    classNames={{
                      base: "mb-12",
                      label: "mb-3",
                      mark: "text-white text-xs text-center whitespace-nowrap mt-4",
                    }}
                    marks={[
                      {
                        value: 0,
                        label: "Too Easy",
                      },
                      {
                        value: 25,
                        label: "Easy",
                      },
                      {
                        value: 50,
                        label: "Normal",
                      },
                      {
                        value: 75,
                        label: "Hard",
                      },
                      {
                        value: 100,
                        label: "Too Hard",
                      },
                    ]}
                    defaultValue={0}
                    className="flex text-white text-tiny"
                  />
                </div>
                <Textarea
                  label="Habit Feedback"
                  placeholder="Please enter some feedback, how did it go?"
                  className="flex w-full h-full"
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  className="bg-slate-700 text-white"
                  variant="light"
                  onPress={onClose}
                >
                  Close
                </Button>
                <Button
                  onClick={(event) => {
                    markHabitComplete(event, selectedHabitId);
                    onClose();
                  }}
                  className="bg-green-500 text-white"
                >
                  Complete Habit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      {/* Habit Completion Modal */}

      {/*  Display empty call to action if there are no habits */}
      {nohabit && (
        <Link href="/habits">
          <motion.div
            className="rounded-xl flex flex-col text-center  items-center w-full bg-black/50 border border-white/15 p-3 hover:bg-black/70 hover:shadow-md hover:cursor-pointer group"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              delay: 0.5,
              duration: 1,
              ease: "easeInOut",
            }}
          >
            <h3 className="font-normal">It's quite empty in here</h3>
            <small>Click here to add new habits to track.</small>
            <IoAddCircleSharp className="text-slate-300 w-8 h-8 mt-3" />
          </motion.div>
        </Link>
      )}
      {/*  Display empty call to action if there are no habits */}

      {loading ? (
        Array(5)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="rounded-xl flex w-full bg-black/30 border border-white/15 p-4"
            >
              <div className="flex-shrink-0 bg-gray-300 rounded-full w-7 h-7 animate-pulse mr-4"></div>
              <div className="flex flex-col w-full">
                <div className="bg-gray-300 h-4 w-1/3 rounded-md animate-pulse mb-2"></div>
                <div className="bg-gray-300 h-3 w-1/2 rounded-md animate-pulse"></div>
              </div>
            </div>
          ))
      ) : (
        <AnimatePresence mode="popLayout">
          {habits.map((habit) => (
            <motion.div
              onClick={() => {
                setHabitId(habit.id);
                router.push(`/habits/${habit.id}`);
              }}
              whileHover={{
                scale: 1.05,
                transition: { type: "spring", duration: 0.3 }, // Hover animation duration
              }}
              exit={{
                scale: 0.5,
                opacity: 0,
                transition: { type: "spring", duration: 0.8 }, // Exit animation duration
              }}
              key={habit.id}
              layout
              className={`rounded-xl flex w-full ${
                selectedHabitId === habit.id
                  ? "bg-black/80 border-white/50  text-red-500 "
                  : habit.completed 
                    ? "bg-black/30 border-green-300/30" 
                    : "bg-black/50  border-white/15"
              } p-3 hover:shadow-md hover:cursor-pointer hover:bg-black/80 transition-color  group 
              }`}
            >
              <div
                style={{ backgroundColor: habit.color }}
                className="flex-shrink-0 text-white rounded-full w-9 h-9 flex items-center justify-center mr-3 relative"
              >
                <DynamicIcon
                  iconName={habit.icon}
                  className="text-white w-7 h-7 p-1 group-hover:text-white/80"
                />
                {habit.completed && (
                  <div className="absolute -top-1 -right-1 bg-green-500 rounded-full w-4 h-4 flex items-center justify-center">
                    <FaCheckCircle className="text-white w-3 h-3" />
                  </div>
                )}
              </div>
              {selectedHabitId === habit.id ? (
                <div className="flex flex-grow flex-col">
                  <span className="font-bold text-gray-100">{habit.name}</span>
                  <small className="mb-2 text-gray-100">{habit.category}</small>
                  <small className="text-gray-200">{habit.user_context}</small>
                </div>
              ) : (
                <div className="flex flex-grow flex-col">
                  <span className={`font-bold ${habit.completed ? "text-green-300" : "text-gray-400"}`}>
                    {habit.name}
                  </span>
                  <small className="mb-2 text-gray-400">{habit.category}</small>
                  <small className="text-gray-400">{habit.user_context}</small>
                </div>
              )}
              <div className="flex flex-row gap-1 ml-3 justify-end items-end">
                <Dropdown className="bg-black/60 backdrop-blur-md">
                  <DropdownTrigger>
                    <IoMdSettings
                      aria-label="Habit Settings"
                      className="text-white/20 w-8 h-8 group-hover:text-white/80 hover:bg-white/30 p-1 rounded-full transition-all duration-100 "
                    />
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Static Actions" variant="solid">
                    {!habit.completed && (
                      <DropdownItem
                        onClick={() => {
                          onOpen();
                          setSelectedHabitId(habit.id);
                        }}
                        className="flex items-center justify-center"
                        description="Complete habit and give feedback"
                        startContent={
                          <FaCheckCircle className="text-green-600 h-5 w-5 mr-2" />
                        }
                        key="complete"
                      >
                        Mark as completed
                      </DropdownItem>
                    )}
                    <DropdownItem
                      className="flex items-center justify-center"
                      key="delete"
                      description="Warning, this is permanent"
                      startContent={
                        <MdCancel className="text-red-500 h-6 w-6 mr-2" />
                      }
                      color="primary"
                      onClick={(event) => deleteHabit(event, user_id, habit.id)}
                    >
                      Delete Habit
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
};

export default ListHabits;