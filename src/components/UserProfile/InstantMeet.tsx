import React from "react";

interface instantMeetProps {
  isDelegate: boolean;
  selfDelegate: boolean;
}

function InstantMeet({ isDelegate, selfDelegate }: instantMeetProps) {
  return (
    <div>
      <button className="bg-blue-shade-200 text-white px-4 py-2 rounded-md font-semibold">
        Start an instant meet
      </button>
    </div>
  );
}

export default InstantMeet;
