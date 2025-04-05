"use client";
import React, { useState, useEffect } from "react";
import FloatingLabelInput from "@/components/ui/InputField";
import { MdOutlineAddCircle } from "react-icons/md";
import { MdError } from "react-icons/md";
import { useRouter } from "next/navigation";

const HabitsModal = ({
  user,
  onClose,
}: {
  user: string;
  onClose: () => void;
}) => {
  //Initialize Router
  const router = useRouter();
  // Form Errors
  const [selectError, setSelectError] = useState("");
  const [categories, setCategories] = useState<{
    [key: string]: { description: string; color: string };
  }>({});
  // API URL
  const apiUrl = process.env.NEXT_PUBLIC_FLASK_API_URL;

  // Fetch categories from the Flask backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Set api URL and call endpoint
        const response = await fetch(`${apiUrl}/api/categories`);
        // Retreive data from Flask
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [apiUrl]);

  //Pass UID to form Data
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        user_id: user,
      }));
    }
  }, [user]);

  //Set Form Data and add UID
  const [formData, setFormData] = useState({
    habit_name: "",
    context: "",
    category: "",
    color: "",
    user_id: user,
  });

  //Handle form changes
  const handleFormChanges = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  //Send form data to Flask
  const processFormData = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.category === "") {
      console.log("Select empty");
      setSelectError("Please select a category");
    } else {
      setSelectError("");
    }

    try {
      // Add color to the form
      formData.color = categories[formData.category].color;
      const response = await fetch(`${apiUrl}/api/habits/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        onClose();
      } else {
        console.error("Error creating habit:", result);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <h1>Create New Habit {user}</h1>
      <form
        onSubmit={processFormData}
        className="grid grid-cols-2 gap-x-4 mt-10  "
      >
        <FloatingLabelInput
          name="habit_name"
          value={formData.habit_name}
          placeholder="Habit Name"
          onChange={handleFormChanges}
        />
        <FloatingLabelInput
          name="context"
          value={formData.context}
          placeholder="Context"
          onChange={handleFormChanges}
        />
        <div className="relative">
          {selectError && (
            <div className="relative bg-red-500 rounded-md flex items-center gap-2 text-white py-1 px-2 mb-5 shadow-sm text-sm font-bold">
              <MdError className="w-[20px] h-[20px]" />
              {selectError}
              <div className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-4 h-4 bg-red-500 rotate-45"></div>
            </div>
          )}
          <select
            className={`w-full font-medium text-gray-500 border rounded-md px-2 py-2 bg-white focus:outline-none ${
              selectError
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-400"
            }`}
            name="category"
            onChange={handleFormChanges}
          >
            <option
              className="text-gray-500 bg-white/70 backdrop-blur-md"
              value=""
            >
              Select a category
            </option>
            {Object.entries(categories).map(([key, value]) => (
              <option key={key} value={key}>
                {key} - {value.description}
              </option>
            ))}
          </select>
        </div>

        <div className="col-span-2 mt-10  flex justify-center items-center">
          <button className="custom-button flex">
            <MdOutlineAddCircle className="w-[30px] h-[30px]" />{" "}
            <span className="font-bold">Create New Habit</span>
          </button>
        </div>
      </form>
    </>
  );
};

export default HabitsModal;
