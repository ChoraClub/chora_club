import React, { useState } from "react";
import { FaStar } from "react-icons/fa6";
import { ImCross } from "react-icons/im";
import { Oval } from "react-loader-spinner";

const popups = [
  {
    id: 1,
    content: "How was your experience using Chora Club?",
    type: "emoji",
    responses: ["😐", "😊", "😍"],
  },
  {
    id: 2,
    content: "How likely are you to recommend Chora Club to others?",
    type: "rating",
    responses: [1, 2, 3, 4, 5],
  },
];

function PopupSlider({
  role,
  address,
  daoName,
  meetingId,
  onClose,
}: {
  role: string;
  address: string;
  daoName: string;
  meetingId: string;
  onClose: () => void;
}) {
  const [currentPopup, setCurrentPopup] = useState(0);
  const [responses, setResponses] = useState<any>({});
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResponse = (emoji: any) => {
    setResponses({ ...responses, [currentPopup]: emoji });
    console.log(emoji);
  };

  const nextPopup = () => {
    if (currentPopup < popups.length - 1) {
      setCurrentPopup(currentPopup + 1);
    }
  };

  const prevPopup = () => {
    if (currentPopup > 0) {
      setCurrentPopup(currentPopup - 1);
    }
  };

  const handleSubmit = async () => {
    // setIsClosed(true);
    setIsSubmitting(true);
    console.log("Responses submitted:", responses);

    try {
      const requestOptions: any = {
        method: "POST",
        redirect: "follow",
        body: JSON.stringify({
          address: address,
          role: role,
          data: {
            platformExperience: {
              userResponse: responses[0],
              timestamp: Date.now(),
              dao: daoName,
              meetingId: meetingId,
            },
            platformRecommendation: {
              userResponse: responses[1],
              timestamp: Date.now(),
              dao: daoName,
              meetingId: meetingId,
            },
          },
        }),
      };

      const response = await fetch("/api/store-feedback", requestOptions);

      const result = await response.json();
      console.log(result);
      if (result.success) {
        setIsSubmitting(false);
        onClose();
      }
    } catch (e) {
      console.log("Error while storing feedback: ", e);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 font-poppins">
      <div className="absolute inset-0 backdrop-blur-md"></div>
      <div className="bg-white py-8 px-10 rounded-2xl border w-1/3 2xl:w-1/4 border-black shadow-lg relative z-10">
        <div className="absolute top-3 left-3 text-blue-shade-200 font-semibold text-xs">
          {currentPopup + 1} / {popups.length}
        </div>
        <button
          className="absolute top-3 right-3 bg-gray-100 p-2 rounded-full hover:bg-gray-200"
          onClick={onClose}
          disabled={isSubmitting}
        >
          <ImCross color="#111" size={7} />
        </button>
        <p className="text-center mb-4 font-semibold">
          {popups[currentPopup].content}
        </p>
        <div className="flex justify-center space-x-2 mb-4">
          {popups[currentPopup].type === "emoji" &&
            popups[currentPopup].responses.map((emoji) => (
              <span
                key={emoji}
                onClick={() => handleResponse(emoji)}
                className={`cursor-pointer text-3xl p-2 ${
                  responses[currentPopup] === emoji
                    ? "bg-yellow-100 rounded-lg"
                    : ""
                }`}
              >
                {emoji}
              </span>
            ))}
          {popups[currentPopup].type === "rating" &&
            popups[currentPopup].responses.map((rating: any) => (
              <FaStar
                key={rating}
                size={24}
                color={
                  rating <= (hoverRating || responses[currentPopup])
                    ? "#ebae34"
                    : "gray"
                }
                onMouseEnter={() => setHoverRating(rating)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => handleResponse(rating)}
                className="cursor-pointer"
              />
            ))}
        </div>
        <div className="flex justify-between">
          <button
            onClick={prevPopup}
            disabled={currentPopup === 0 || isSubmitting}
            className={`text-sm font-semibold px-4 ${
              currentPopup === 0 || isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            Previous
          </button>
          {currentPopup < popups.length - 1 ? (
            <button
              onClick={nextPopup}
              disabled={responses[currentPopup] === undefined}
              className={`py-1 px-3  font-semibold text-sm text-white rounded-full ${
                responses[currentPopup] === undefined
                  ? "cursor-not-allowed bg-gray-500"
                  : "bg-blue-shade-200"
              }`}
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={Object.keys(responses).length !== popups.length}
              className={`py-1 px-3 font-semibold text-sm text-white rounded-full ${
                Object.keys(responses).length !== popups.length
                  ? "cursor-not-allowed bg-gray-500"
                  : "bg-green-800"
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center px-4">
                  <Oval
                    visible={true}
                    height="18"
                    width="18"
                    color="#ffffff"
                    secondaryColor="#cdccff"
                    ariaLabel="oval-loading"
                  />
                </div>
              ) : (
                "Submit"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PopupSlider;
