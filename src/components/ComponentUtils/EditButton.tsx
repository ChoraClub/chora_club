// EditButton.tsx
import React, { useState } from "react";
import { Tooltip } from "@nextui-org/react";
import { FaPencil } from "react-icons/fa6";
import UpdateHostedSessionModal from "./UpdateHostedSessionModal";
import lighthouse from "@lighthouse-web3/sdk";
import toast from "react-hot-toast";

interface EditButtonProps {
  sessionData: any;
  updateSessionData: (updatedData: any, index: number) => void;
  index: number
}

const EditButton: React.FC<EditButtonProps> = ({
  sessionData,
  updateSessionData,
  index
}) => {
  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
  });

  const handleEditModal = () => {
    setEditOpen(true);
  };

  const handleCloseEdit = () => {
    setEditOpen(false);
  };

  const handleChange = (e: any) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files : value,
    }));
  };

  const handleSave = async () => {
    // Handle save logic here, such as making an API call
    setLoading(true);
    console.log(formData);
    console.log(sessionData);
    // Close the modal after saving
    const progressCallback = async (progressData: any) => {
      let percentageDone =
        100 -
        (
          ((progressData?.total as any) / progressData?.uploaded) as any
        )?.toFixed(2);
      console.log(percentageDone);
    };

    const apiKey = process.env.NEXT_PUBLIC_LIGHTHOUSE_KEY
      ? process.env.NEXT_PUBLIC_LIGHTHOUSE_KEY
      : "";
    try {
      let imageCid = "";
      if (formData.image) {
        const output = await lighthouse.upload(formData.image, apiKey);
        imageCid = output.data.Hash;
        console.log("image output: ", output.data.Hash);
      }

      const updatedData = {
        title: formData.title || sessionData.title,
        description: formData.description || sessionData.description,
        thumbnail_image: formData.image
          ? imageCid
          : sessionData.thumbnail_image,
      };

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("x-wallet-address", sessionData.host_address);

      const raw = JSON.stringify({
        meetingId: sessionData.meetingId,
        host_address: sessionData.host_address,
        ...updatedData,
      });

      console.log("raw: ", raw);

      const requestOptions: any = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      const response = await fetch(
        `/api/update-recorded-session`,
        requestOptions
      );
      if (response) {
        const responseData = await response.json();
        console.log("responseData: ", responseData);
        updateSessionData(updatedData, index);
        setLoading(false);
      } else {
        setLoading(false);
      }

      handleCloseEdit();
    } catch (e) {
      console.log("errorrrrrr: ", e);
      toast.error("Unable to update the data.");
      setLoading(false);
      handleCloseEdit();
    }
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

      {editOpen && (
        <UpdateHostedSessionModal
          isOpen={editOpen}
          onClose={handleCloseEdit}
          onSave={handleSave}
          sessionData={sessionData}
          formData={formData}
          handleChange={handleChange}
          loading={loading}
        />
      )}
    </>
  );
};

export default EditButton;
