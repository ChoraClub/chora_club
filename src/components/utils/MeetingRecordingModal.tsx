import React from "react";
import { MdCancel } from "react-icons/md";

function MeetingRecordingModal({
  show,
  onClose,
}: {
  show: boolean;
  onClose: (result: boolean) => void;
}) {
  return (
    <>
      {show && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 backdrop-blur-md"
            // onClick={onClose}
          ></div>
          <div className="bg-white rounded-3xl shadow-lg p-8 relative w-full max-w-lg mx-4">
            <button
              className="absolute top-5 right-6"
              onClick={() => onClose(false)}
            >
              <MdCancel size={25} />
            </button>

            <h2 className="text-2xl font-bold mb-2">
              Do you want to record the meeting?
            </h2>
            <div className="flex justify-center space-x-4 mt-6">
              <button
                onClick={() => onClose(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Yes
              </button>
              <button
                onClick={() => onClose(false)}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MeetingRecordingModal;
