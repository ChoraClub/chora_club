import React, { useEffect } from "react";
import { Oval } from "react-loader-spinner";

interface SessionTileProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (session: any) => void;
  sessionData: any;
  formData: any;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  loading: boolean;
}

function UpdateHostedSessionModal({
  isOpen,
  onClose,
  onSave,
  sessionData,
  formData,
  handleChange,
  loading,
}: SessionTileProps) {
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
      <div className="fixed inset-0 flex items-center justify-center z-50  overflow-hidden">
        <div className="absolute inset-0 backdrop-blur-md"></div>
        <div className="p-7 border z-50 rounded-2xl w-[35vw]  bg-white flex flex-col gap-3">
          <div className="text-blue-shade-100 flex justify-center items-center text-3xl font-semibold">
            Edit Session
          </div>
          <div className="mt-4">
            <label className="block mb-2 font-semibold">Title:</label>
            <input
              type="text"
              name="title"
              placeholder={sessionData.title}
              className="w-full px-4 py-2 border rounded-lg bg-[#D9D9D945]"
              value={formData.title}
              onChange={handleChange}
            />
          </div>
          <div className="mt-2">
            <label className="block mb-2 font-semibold">Description:</label>
            <textarea
              name="description"
              placeholder={sessionData.description}
              className="w-full px-4 py-2 border rounded-lg bg-[#D9D9D945]"
              onChange={handleChange}
            >
              {formData.description}
            </textarea>
          </div>
          <div className="mt-2">
            <label className="block mb-2 font-semibold">Thumbnail Image:</label>
            <input
              type="file"
              name="image"
              accept="*/image"
              className="w-full px-4 py-2 border rounded-lg bg-[#D9D9D945]"
              onChange={handleChange}
            />
          </div>
          <div className="mt-4 flex gap-2 justify-end">
            <button
              className="bg-blue-shade-100 rounded-lg py-2 px-4 text-white"
              onClick={(e) => {
                onSave(sessionData);
              }}
            >
              {loading ? (
                <div className="flex items-center justify-center top-10">
                  <Oval
                    visible={true}
                    height="20"
                    width="20"
                    color="#0500FF"
                    secondaryColor="#cdccff"
                    ariaLabel="oval-loading"
                  />
                </div>
              ) : (
                <>Save</>
              )}
            </button>
            <button
              className="bg-[#D9D9D945] rounded-lg py-2 px-3"
              onClick={(e) => {
                onClose();
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default UpdateHostedSessionModal;
