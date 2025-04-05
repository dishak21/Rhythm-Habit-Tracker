import React from "react";
import { useGlobalContext } from "@/contexts/GlobalContext";

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
} from "react-icons/fa";

// Define the props interface for Compo1
interface FormData {
  name: string;
  user_context: string;
  category: string;
  color: string;
  icon: string;
  schedule_type: string;
  user_id: string;
  description: string;
  schedule_radio: string;
}

// Icon mapping for resolving string to React component
const iconMapping: Record<string, React.FC> = {
  FaBookOpen,
  FaCarrot,
  FaHeartbeat,
  FaHome,
  FaPalette,
  FaPiggyBank,
  FaSpa,
  FaTasks,
  FaUsers,
};

interface RecapProps {
  formData: FormData;
}

const HabitRecap: React.FC<RecapProps> = ({ formData }) => {
  const { globalTheme } = useGlobalContext();

  const IconComponent = iconMapping[formData.icon];
  return (
    <>
      <div className="flex flex-col gap-3">
        <div
          className={`-4 text-gray-300 bg-${globalTheme}-600 p-3 rounded-xl`}
        >
          <small className="text-white mb-2">Habit Name</small>
          <h2>{formData.name}</h2>
        </div>
        <div className="relative -4 text-gray-300 bg-black/50 p-3 flex flex-col  rounded-xl">
          {/* Icon positioned in the top-right corner */}
          {IconComponent && (
            <div
              className={`absolute top-1/2 right-4 bg-${globalTheme}-600 rounded-full p-3 transform -translate-y-1/2`}
            >
              <IconComponent size={30} />
            </div>
          )}

          <small className="text-white mb-2">Habit Category</small>
          <span className="font-bold">{formData.category}</span>
          <p className="text-sm">{formData.description}</p>
        </div>
        <div
          className={`-4 text-gray-300 bg-black/40 flex flex-col p-3 rounded-xl`}
        >
          <small className="text-white mb-2">Habit AI Context</small>
          <p className="text-sm">{formData.user_context}</p>
        </div>
        <div
          className={`-4 text-gray-300 bg-black/40 flex flex-col p-3 rounded-xl`}
        >
          <small className="text-white mb-2">Habit Scheduling</small>
          <p className="text-sm">Repeat: {formData.schedule_radio}</p>
        </div>
      </div>
    </>
  );
};

export default HabitRecap;
