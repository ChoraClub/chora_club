import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import ReportAddionalDetailsModal from "./ReportAddionalDetailsModal";

type ReportCategory =
  | "Sexual content"
  | "Violent or repulsive content"
  | "Hateful or abusive content"
  | "Harassment or bullying"
  | "Harmful or dangerous acts"
  | "Misinformation"
  | "Child abuse"
  | "Promotes terrorism";

function ReportOptionModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const toggleModal = () => {
    onClose();
  };

  const categories: ReportCategory[] = [
    "Sexual content",
    "Violent or repulsive content",
    "Hateful or abusive content",
    "Harassment or bullying",
    "Harmful or dangerous acts",
    "Misinformation",
    "Child abuse",
    "Promotes terrorism",
  ];

  const [selectedCategory, setSelectedCategory] =
    useState<ReportCategory | null>(null);
  const [showAdditionalDetails, setShowAdditionalDetails] = useState(false);

  const handleNext = () => {
    if (selectedCategory) {
      setShowAdditionalDetails(true);
    }
  };

  if (showAdditionalDetails) {
    return (
      <ReportAddionalDetailsModal
        category={selectedCategory!}
        onClose={onClose}
      />
    );
  }

  return (
    <div>
      <div className="fixed inset-0 z-50 flex items-center justify-center font-poppins">
        <div
          className="absolute inset-0 backdrop-blur-md"
          onClick={toggleModal}
        ></div>
        <div className="z-50 bg-white rounded-3xl min-w-96 border-2 overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <div className="text-xl font-bold text-gray-900">Report video</div>
            <button
              className="text-gray-500 hover:text-gray-800"
              onClick={toggleModal}
            >
              <RxCross2 size={20} />
            </button>
          </div>
          <div className="p-4 text-gray-900">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleNext();
              }}
            >
              {categories.map((category) => (
                <label key={category} className="block mb-2">
                  <input
                    type="radio"
                    name="reportCategory"
                    value={category}
                    checked={selectedCategory === category}
                    onChange={() => setSelectedCategory(category)}
                    className="mr-2"
                  />
                  {category}
                </label>
              ))}
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 rounded hover:text-gray-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedCategory}
                  className={`px-4 py-2 rounded font-semibold ${
                    selectedCategory
                      ? "text-blue-shade-100 hover:text-blue-shade-200"
                      : "text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Next
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportOptionModal;
