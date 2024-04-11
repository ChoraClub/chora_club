import React, { useState, useEffect } from "react";
import { RxCross2 } from "react-icons/rx";

function AddEmailModal({
  isOpen,
  onClose,
  mailId,
  isValidEmail,
  onEmailChange,
  onSubmit,
}: {
  isOpen: Boolean;
  onClose: () => void;
  mailId: string | undefined;
  isValidEmail: boolean;
  onEmailChange: (email: string) => void;
  onSubmit: () => void;
}) {
  useEffect(() => {
    // Lock scrolling when the modal is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div>
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 backdrop-blur-md"
              // onClick={onClose}
            ></div>
            <div className="z-50 bg-white rounded-3xl min-w-5xl border-2 overflow-hidden">
              <div className="flex justify-between items-center px-8 py-4 border-b relative pb-7">
                {/* <div> */}
                <h2>Get Notified</h2>
                {/* </div> */}
                <button
                  className="text-gray-500 hover:text-gray-800 absolute top-3 right-4 "
                  onClick={onClose}
                >
                  <RxCross2 size={20} />
                  {/* Close */}
                </button>
              </div>
              <div className="px-8 py-4">
                <label className="block mb-2">Email Address:</label>
                <input
                  type="text"
                  value={mailId || ""}
                  onChange={(e) => onEmailChange(e.target.value)}
                  className={`border ${
                    isValidEmail ? "border-gray-300" : "border-red-500"
                  } rounded-md p-2 w-full`}
                />
                {!isValidEmail && (
                  <p className="text-red-500 text-sm mt-1">
                    Invalid email format
                  </p>
                )}
                <button
                  onClick={onSubmit}
                  className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AddEmailModal;
