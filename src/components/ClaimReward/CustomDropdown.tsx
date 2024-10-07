"use client";
import React, { useEffect, useRef, useState } from "react";

interface CustomDropdownProps {
  options: string[];
  onChange?: (option: string) => void;
}

export function CustomDropdown({ options, onChange }: CustomDropdownProps) {
  const [selectedOption, setSelectedOption] = useState(options[2]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
    if (onChange) {
      onChange(option);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="rounded-full w-52 py-2 px-4 outline-none cursor-pointer bg-white shadow-md flex justify-between items-center transition-all duration-300 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500"
        onClick={() => setIsOpen(!isOpen)}
        tabIndex={0} // Makes the div focusable for better accessibility
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setIsOpen(!isOpen);
          }
        }}
      >
        {selectedOption}
        <svg
          className={`ml-2 w-4 h-4 transition-transform duration-200 ${
            isOpen ? "transform rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
      {isOpen && (
        <div className="absolute mt-1 w-full rounded-lg bg-white shadow-lg z-10 max-h-60 overflow-y-auto">
          {options.map((option: any, index: any) => (
            <div
              key={index}
              className={`py-2 px-4 cursor-pointer transition-all duration-200 ${
                selectedOption === option
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => handleSelect(option)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleSelect(option);
                }
              }}
              tabIndex={0} // Makes each option focusable
              role="option" // Helps screen readers understand that these are options
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
