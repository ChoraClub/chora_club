"use client";
import { Button } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { imageCIDs } from "@/config/staticDataUtils";
import lighthouse from "@lighthouse-web3/sdk";
import Image from 'next/image'

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

  const getDescriptionStatus = (length: number) => {
    if (length < 600) return "Bad";
    if (length >= 600 && length <= 1000) return "Medium (Short)";
    if (length > 1000 && length <= 1500) return "Good";
    if (length > 1500) return "Medium (Long)";
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
    <div>
      <div className="flex justify-end">
        <Button
          className="bg-blue-shade-100 text-white"
          onClick={() => toast("Coming Soon! 🚀")}
        >
          Generate Title and Description
        </Button>
      </div>
      <div>
        <div className="py-3">
          <div className="text-lg font-semibold pb-1">Thumbnail Image</div>
          <div className="flex flex-col">
            <p className="text-xs mb-2">Your Current Thumbnail Image</p>
          <div className="w-40 h-24 bg-gray-100 mb-5 rounded-md flex items-center justify-center">
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
                          fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
          </div>
          <div className="flex items-center gap-5">

            <input
              type="file"
              name="image"
              accept="*/image"
              className="px-4 py-1 border rounded-lg bg-[#D9D9D945]"
              onChange={(e) => handleChange(e.target.files)}
              />
            <Button
              className="bg-blue-shade-100 text-white text-sm rounded-md"
              onClick={getRandomImage}
              >
              Add Random Image
            </Button>
              </div>
          </div>
        </div>
        <div className="py-3">
          <div className="text-lg font-semibold">Session Title</div>
          <div className="text-xs pb-2 text-gray-600">
            Enter a descriptive title for your session
          </div>
          <div className="relative w-5/6">
            <input
              type="text"
              className="border border-gray-500 w-full p-1 text-sm rounded-md outline-none"
              placeholder="Enter session title"
              value={sessionDetails.title}
              onChange={handleTitleChange}
              maxLength={100}
            />
            <div className="flex justify-end text-[10px] font-medium text-gray-600 pt-1 pe-1">
              {sessionDetails.title.length}/100 characters
            </div>
          </div>
        </div>
        <div className="py-3 w-5/6">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-lg font-semibold">Session Description</div>
              <div className="text-xs pb-2 text-gray-600">
                Briefly describe what your session covers
              </div>
            </div>
            <div
              className={`rounded-md px-2 py-1 text-sm ${
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
          <div className=" ">
            <textarea
              rows={8}
              className="border border-gray-500 w-full p-1 text-sm rounded-md outline-none"
              placeholder="Enter session description"
              value={sessionDetails.description}
              onChange={handleDescriptionChange}
              maxLength={2000}
            ></textarea>
            <div className="flex justify-end text-[10px] font-medium text-gray-600 pe-1">
              {sessionDetails.description.length}/2000 characters
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditSessionDetails;
