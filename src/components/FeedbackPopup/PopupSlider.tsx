import React, { useState } from "react";
import { FaStar } from "react-icons/fa6";
import { ImCross } from "react-icons/im";
import { Oval } from "react-loader-spinner";
import { popups } from "./FeedbackPrompts";
import PopupContent from "./PopupContent";

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
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      if (address) {
        myHeaders.append("x-wallet-address", address);
      }

      const raw = JSON.stringify({
        address: address,
        role: role,
        data: {
          platformExperience: [
            {
              userResponse: responses[0],
              timestamp: Date.now(),
              dao: daoName,
              meetingId: meetingId,
            },
          ],
          platformRecommendation: [
            {
              userResponse: responses[1],
              timestamp: Date.now(),
              dao: daoName,
              meetingId: meetingId,
            },
          ],
        },
      });

      const requestOptions: any = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch(
        "/api/feedback/store-feedback",
        requestOptions
      );

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
        {popups.length > 1 && (
          <div className="absolute top-3 left-3 text-blue-shade-200 font-semibold text-xs">
            {currentPopup + 1} / {popups.length}
          </div>
        )}
        <button
          className="absolute top-3 right-3 bg-gray-100 p-2 rounded-full hover:bg-gray-200"
          disabled={isSubmitting}
          onClick={onClose}
        >
          <ImCross color="#111" size={7} />
        </button>
        <PopupContent
          popups={popups}
          index={currentPopup}
          currentPopup={currentPopup}
          responses={responses}
          setHoverRating={setHoverRating}
          handleResponse={handleResponse}
          hoverRating={hoverRating}
        />
        <div className="flex justify-between">
          {popups.length > 1 && (
            <>
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
              {currentPopup < popups.length - 1 && (
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
              )}
            </>
          )}
          {/* ) : ( */}
          {(popups.length === 1 || currentPopup === popups.length - 1) && (
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
          {/* )} */}
        </div>
      </div>
    </div>
  );
}

export default PopupSlider;
