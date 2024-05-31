import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";

function ReportAdditionalDetailsModal({
  category,
  onClose,
}: {
  category: string;
  onClose: () => void;
}) {
  const [details, setDetails] = useState("");

  const toggleModal = () => {
    onClose();
  };

  const handleReport = () => {
    // Handle the report submission logic with the details
    console.log(`Reported category: ${category}`);
    console.log(`Additional details: ${details}`);
    onClose(); // Close the modal after submission
  };
  return (
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
          >
            Report
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReportAdditionalDetailsModal;
