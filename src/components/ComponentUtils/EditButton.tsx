// EditButton.tsx
import React, { useState } from "react";
import { Tooltip } from "@nextui-org/react";
import { FaPencil } from "react-icons/fa6";
import { useRouter } from "next-nprogress-bar";

interface EditButtonProps {
  sessionData: any;
  updateSessionData: (updatedData: any, index: number) => void;
  index: number;
}

const EditButton: React.FC<EditButtonProps> = ({
  sessionData,
  updateSessionData,
  index,
}) => {
  const router = useRouter();

  const handleEditModal = () => {
    // setEditOpen(true);
    router.push(
      `/meeting/session/${sessionData.meetingId}/update-session-details`
    );
  };

  return (
    <>
      <Tooltip content="Edit Details" placement="top" showArrow>
        <div
          className={`bg-gradient-to-r from-[#8d949e] to-[#555c6629] rounded-full p-1 py-3 cursor-pointer w-10 flex items-center justify-center font-semibold text-sm text-black`}
          //   style={{ backgroundColor: "rgba(217, 217, 217, 0.42)" }}
          onClick={(e) => {
            handleEditModal();
          }}
        >
          <FaPencil color="black" size={14} />
        </div>
      </Tooltip>

    </>
  );
};

export default EditButton;
