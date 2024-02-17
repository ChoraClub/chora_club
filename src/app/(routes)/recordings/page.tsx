'use client'
import React, { useState, useEffect } from "react";
import axios from "axios";

interface Recording {
  id: string;
  recordingUrl: string;
  recordingSize: number;
}

const Index: React.FC = () => {
  const [recordings, setRecordings] = useState<Recording[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<{
          recordings: Recording[];
        }>("https://api.huddle01.com/api/v1/get-recordings", {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "WDfdwP2ChGv3OmRDbQzKDHeJQd0cTnqk",
          },
        });

        setRecordings(response.data.recordings);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-4">Recordings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recordings.map((recording) => (
          <div key={recording.id} className="bg-gray-800 p-4 rounded-md">
            <video
              controls
              className="w-full h-48 object-cover rounded-md mb-4"
              src={recording.recordingUrl}
            ></video>
            <p className="text-sm">ID: {recording.id}</p>
            <p className="text-sm">Size: {recording.recordingSize}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Index;
