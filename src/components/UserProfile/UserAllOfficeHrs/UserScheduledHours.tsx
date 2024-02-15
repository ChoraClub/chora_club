import React, { useState } from "react";

import { useAccount, useNetwork } from "wagmi";

const UserScheduledHours: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { address } = useAccount();
  const { chain } = useNetwork();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      // Convert the selected date to UTC
      const selectedDateUTC = new Date(selectedDate);
      const utcFormattedDate = selectedDateUTC.toISOString();

      const response = await fetch("/api/office-hours", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: address, // Replace with the actual address
          office_hours_slot: utcFormattedDate,
          title,
          description,
          status: "active",
          chain_name: chain?.name,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit data");
      }

      setTitle("");
      setDescription("");
      setSelectedDate("");
      setError(null);
      console.log("Data submitted successfully");
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to submit data");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">User Scheduled Hours</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="title"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="startDate"
          >
            Date & Time
          </label>
          <input
            id="startDate"
            type="datetime-local"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 4.418 3.582 8 8 8v-4c-2.22 0-4.239-.905-5.708-2.369l1.416-1.416zm16.294-7.58A7.962 7.962 0 0120 12h4c0-4.418-3.582-8-8-8v4c2.219 0 4.238.904 5.707 2.369l-1.413 1.414z"
              ></path>
            </svg>
          ) : (
            "Submit"
          )}
        </button>
      </form>
    </div>
  );
};

export default UserScheduledHours;
