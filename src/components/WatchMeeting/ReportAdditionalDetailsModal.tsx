import { ReportRequestBody, VideoReport } from "@/app/api/report-session/route";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { v4 as uuidv4 } from "uuid";
import { useNetwork, useAccount } from "wagmi";
import { Toaster, toast } from "react-hot-toast";

function ReportAdditionalDetailsModal({
  data,
  collection,
  category,
  onClose,
}: {
  data: any;
  collection: any;
  category: string;
  onClose: () => void;
}) {
  const { openConnectModal } = useConnectModal();
  const { address, isConnected } = useAccount();
  const [details, setDetails] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>();
  const toggleModal = () => {
    onClose();
  };

  function dateToUnixEpoch(date: Date) {
    // Get the timestamp in milliseconds
    let timestampInMilliseconds = date.getTime();
    // Convert milliseconds to seconds
    let timestampInSeconds = Math.floor(timestampInMilliseconds / 1000);
    return timestampInSeconds;
  }

  // Function to make the API request
  const submitReport = async (
    meetingId: any,
    host_address: any,
    video_reports: any
  ) => {
    setIsLoading(true);
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        meetingId,
        host_address,
        video_reports,
      }),
    };

    try {
      const response = await fetch("/api/report-session", requestOptions);
      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Error submitting report:", error);
      throw error;
    }
  };

  const handleReport = async () => {
    const date = new Date();
    const unixEpochTime = dateToUnixEpoch(date);
    const unique_id = uuidv4();
    const { meetingId, host_address } = data;

    const video_reports = {
      reports: [
        {
          report_id: unique_id,
          user_wallet_address: address,
          report_type: category,
          description: details,
          timestamp: unixEpochTime,
          status: "pending",
          admin_notes: "",
        },
      ],
    };

    if (address && isConnected) {
      try {
        const result = await submitReport(
          meetingId,
          host_address,
          video_reports
        );

        if (result.success) {
          console.log("Report submitted successfully:", result);
          toast("Report submitted successfully");
        } else {
          if (result.exists) {
            toast.error("You have already reported this session.");
            console.log("User already reported the session before");
          } else {
            console.error("Failed to submit report:", result);
            toast.error(result.error || "Failed to submit report");
          }
        }
        onClose();
        setIsLoading(false);
      } catch (error) {
        onClose();
        console.error("Error submitting report:", error);
        toast.error("Error submitting report:");
        setIsLoading(false);
      }
    } else {
      if (openConnectModal) {
        openConnectModal();
      }
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center font-poppins">
        <div
          className="absolute inset-0 backdrop-blur-md"
          onClick={toggleModal}
        ></div>
        <div className="z-50 bg-white p-6 rounded-3xl shadow-lg w-[28rem]">
          <div className="flex justify-between items-center">
            <div className="text-xl font-bold text-gray-900">Report video</div>
            <button
              className="text-gray-500 hover:text-gray-800"
              onClick={toggleModal}
            >
              <RxCross2 size={20} />
            </button>
          </div>
          {/* <p className="mb-2">Provide additional details</p> */}
          <textarea
            placeholder="Provide additional details"
            className="w-full p-2 border rounded my-4 bg-[#EDEDED]"
            rows={6}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={toggleModal}
              className="ps-4 text-gray-700 rounded hover:text-gray-800 font-semibold"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleReport}
              className="ps-4 text-red-500 hover:text-red-600 font-semibold"
              disabled={isLoading}
            >
              {isLoading ? <>Submitting...</> : <> Report</>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ReportAdditionalDetailsModal;
