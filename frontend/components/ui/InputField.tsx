"use client";
import React from "react";

const FloatingLabelInput = ({
  name,
  value,
  placeholder,
  type = "text",
  onChange,
}: {
  name: string;
  value: string;
  placeholder: string;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const hasValue = value?.trim().length > 0;

  return (
    <div className="relative w-full my-4">
      {/* Label */}
      <label
        htmlFor={name}
        className={`absolute left-2 top-2   transition-all duration-200 ease-in-out ${
          hasValue
            ? "text-base -translate-y-10 text-white"
            : "text-base text-gray-500"
        }`}
      >
        {placeholder}
      </label>
      {/* Input */}
      <input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        className="w-full border border-gray-300 rounded-md px-2 py-2 text-base font-medium text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-400"
      />
    </div>
  );
};

export default FloatingLabelInput;
