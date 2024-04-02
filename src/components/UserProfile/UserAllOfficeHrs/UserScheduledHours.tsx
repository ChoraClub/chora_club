import React, { useState } from "react";
import { useAccount, useNetwork } from "wagmi";
import toast, { Toaster } from "react-hot-toast";

const UserScheduledHours: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { address } = useAccount();
  const { chain } = useNetwork();

  const [selectedTime, setSelectedTime] = useState<string>("");

  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTime(e.target.value);
  };

  const createRandomRoom = async () => {
    const response = await fetch(
      "https://api.huddle01.com/api/v1/create-room",
      {
        method: "POST",
        body: JSON.stringify({
          title: "Test Room",
        }),
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY ?? "",
        },
        cache: "no-store",
      }
    );

    // if (!response.ok) {
    //   throw new Error("Failed to fetch");
    // }

    const result = await response.json();
    // console.log(result);
    const { roomId } = await result.data;
    return roomId;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      const roomId = await createRandomRoom();

      const selectedDateTime = `${selectedDate} ${selectedTime}:00`;

      const selectedDateUTC = new Date(selectedDateTime);
      const utcFormattedDate = selectedDateUTC.toISOString();

      const response = await fetch("/api/office-hours", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          host_address: address,
          office_hours_slot: utcFormattedDate,
          title,
          description,
          meeting_status: "active",
          dao_name: chain?.name,
          meetingId: roomId, // Pass the roomId as meetingId
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit data");
      }

      setTitle("");
      setDescription("");
      setSelectedDate("");
      setError(null);
      toast.success("Successfully scheduled your office hour.");
      console.log("Data submitted successfully");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error scheduling your office hour.");
      setError("Failed to submit data");
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const time = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        options.push(time);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  const currentDate = new Date();
  let formattedDate = currentDate.toLocaleDateString();
  if (
    formattedDate.length !== 10 ||
    !formattedDate.match(/^\d{4}-\d{2}-\d{2}$/)
  ) {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    formattedDate = `${year}-${month}-${day}`;
  }

  // console.log("formattedDate", formattedDate);

  // console.log("currentDate", currentDate);

  return (
    <div className="ps-4 font-poppins">
      <h1 className="text-xl font-bold mb-4">Schedule Office Hours</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-bold mb-2" htmlFor="title">
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
          <label className="block font-bold mb-2" htmlFor="description">
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
          <label className="block font-bold mb-2" htmlFor="startDate">
            Date & Time
          </label>
          <div className="flex">
            <input
              id="startDate"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="shadow appearance-none border rounded w-2/5 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-1"
              min={formattedDate}
            />
            <select
              value={selectedTime || "Time"}
              onChange={handleTimeChange}
              className="shadow appearance-none border rounded w-1/5 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ml-1"
            >
              <option disabled>Time</option>
              {timeOptions.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
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
