"use client";
import { Button } from "@nextui-org/react";
import React, { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { imageCIDs } from "@/config/staticDataUtils";
import lighthouse from "@lighthouse-web3/sdk";
import Image from "next/image";
import { CgAttachment } from "react-icons/cg";

function EditSessionDetails({
  data,
  sessionDetails,
  onSessionDetailsChange,
}: {
  data: any;
  sessionDetails: { title: string; description: string; image: string };
  onSessionDetailsChange: (field: string, value: any) => void;
}) {
  // const [title, setTitle] = useState("");
  // const [description, setDescription] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const getDescriptionStatus = (length: number) => {
    if (length < 600) return "Bad";
    if (length >= 600 && length <= 1000) return "Medium";
    if (length > 1000 && length <= 1500) return "Good";
    if (length > 1500) return "Medium";
  };

  const handleTitleChange = (e: any) => {
    if (e.target.value.length <= 100) {
      onSessionDetailsChange("title", e.target.value);
    }
  };

  const handleDescriptionChange = (e: any) => {
    if (e.target.value.length <= 2000) {
      onSessionDetailsChange("description", e.target.value);
    }
  };

  const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * imageCIDs.length);
    // return imageCIDs[randomIndex];
    onSessionDetailsChange("image", imageCIDs[randomIndex]);
  };

  const handleChange = async (selectedImage: any) => {
    const apiKey = process.env.NEXT_PUBLIC_LIGHTHOUSE_KEY
      ? process.env.NEXT_PUBLIC_LIGHTHOUSE_KEY
      : "";

    if (selectedImage) {
      const output = await lighthouse.upload(selectedImage, apiKey);
      const imageCid = output.data.Hash;
      console.log("image output: ", output.data.Hash);
      onSessionDetailsChange("image", imageCid);
    }
  };

  return (
    <div className="relative">
      <div className="absolute top-0 right-0">
        <Button
          className="border-blue-shade-100 text-blue-shade-100 border rounded-full font-poppins font-semibold text-xs bg-white"
          onClick={() => toast("Coming Soon! 🚀")}
        >
          Generate Title and Description
        </Button>
      </div>
      <div>
        <div className="">
          <div className="text-xl font-semibold mb-2 text-blue-shade-100 font-poppins">
            Thumbnail Image
          </div>
          <div className="flex gap-3 items-center">
            <div className="w-40 h-24 bg-gray-100 mb-5 rounded-lg flex items-center justify-center">
              {sessionDetails.image ? (
                <Image
                  src={`https://gateway.lighthouse.storage/ipfs/${sessionDetails.image}`}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-md"
                  width={100}
                  height={100}
                />
              ) : (
                <div className="text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex items-end">
              <div className="flex bg-[#EEF8FF] items-center gap-6 rounded-lg p-3">
                <label className="bg-[#EEF8FF]  text-blue-shade-100 font-medium text-sm py-3 px-4 rounded-full border cursor-pointer border-blue-shade-100 cursor-point flex gap-2 items-center ">
                  <CgAttachment />
                  <span>Upload Image</span>
                  <input
                    type="file"
                    name="image"
                    ref={fileInputRef}
                    accept="*/image"
                    className="hidden"
                    onChange={(e) => handleChange(e.target.files)}
                  />
                </label>
                <Button
                  className="bg-black text-white py-5 px-4 text-xs font-medium rounded-full font-poppins"
                  onClick={getRandomImage}
                >
                  Add Random Image
                </Button>
              </div>
              {/* </div> */}
            </div>
          </div>
        </div>
        <div className="py-3 font-poppins">
          <div className="text-xl mb-2 font-semibold text-blue-shade-100 font-poppins">
            Session Title
          </div>
          <div className="relative">
            <input
              type="text"
              className="border bg-[#F9F9F9] w-full py-3 px-4 text-sm rounded-lg outline-none pr-20"
              placeholder="Enter a descriptive title for your session"
              value={sessionDetails.title}
              onChange={handleTitleChange}
              maxLength={100}
            />
            <div className="absolute top-3 right-4 text-[14px] font-medium text-[#7C7C7C] pe-1 font-poppins">
              {sessionDetails.title.length}/100
            </div>
          </div>
        </div>
        <div className="py-3">
          <div className="flex justify-between items-center mb-2">
            <div>
              <div className="text-xl font-semibold text-blue-shade-100 font-poppins">
                Session Description
              </div>
            </div>
            <div
              className={`rounded-lg  px-4 py-1 text-xs border ${
                sessionDetails.description.length < 600
                  ? "bg-red-500"
                  : sessionDetails.description.length <= 1000
                  ? "bg-yellow-500"
                  : sessionDetails.description.length <= 1500
                  ? "bg-green-700"
                  : "bg-yellow-700"
              } text-white`}
            >
              {getDescriptionStatus(sessionDetails.description.length)}
            </div>
          </div>
          <div className="relative ">
            <textarea
              rows={8}
              className="border bg-[#F9F9F9] w-full p-4 text-sm rounded-lg outline-none pr-20"
              placeholder="Briefly describe what your session covers"
              value={sessionDetails.description}
              onChange={handleDescriptionChange}
              maxLength={2000}
            ></textarea>
            <div className="absolute top-4 right-4 text-[14px] font-medium text-[#7C7C7C] pe-1">
              {sessionDetails.description.length}/2000
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditSessionDetails;
