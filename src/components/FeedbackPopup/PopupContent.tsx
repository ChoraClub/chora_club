import React from "react";
import { FaStar } from "react-icons/fa";
interface PopupContentProps {
  popups: any;
  index: number;
  currentPopup: number;
  responses: any;
  setHoverRating: (rating: number) => void;
  handleResponse: (response: any) => void;
  hoverRating: number;
}

function PopupContent({
  popups,
  index,
  currentPopup,
  responses,
  setHoverRating,
  handleResponse,
  hoverRating,
}: PopupContentProps) {
  console.log("Pop ups: ", popups);

  return (
    <div key={index}>
      <p className="text-center mb-4 font-semibold">
        {popups[currentPopup].content}
      </p>
      <div className="flex justify-center space-x-2 mb-4">
        {popups[currentPopup].type === "emoji" &&
          popups[currentPopup].responses.map((response: any) => (
            <div
              key={response.text}
              onClick={() => handleResponse(response.text)}
              className="cursor-pointer text-center p-2"
            >
              <div
                className={`text-3xl mb-1 p-1 ${
                  responses[currentPopup] === response.text
                    ? "bg-yellow-100 rounded-lg inline-block"
                    : "inline-block"
                }`}
              >
                {response.emoji}
              </div>
              <div className="text-xs">{response.text}</div>
            </div>
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
    </div>
  );
}

export default PopupContent;
