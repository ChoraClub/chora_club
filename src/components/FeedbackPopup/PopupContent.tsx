// PopupContent.tsx
import React from "react";
import EmojiRating from "./RatingTypes/EmojiRating";
import StarRating from "./RatingTypes/StarRating";

interface PopupContentProps {
  popups: any[];
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
  return (
    <div key={index}>
      <p className="text-center mb-4 font-semibold">
        {popups[currentPopup].content}
      </p>
      <div className="flex justify-center space-x-2 mb-4">
        {popups[currentPopup].type === "emoji" && (
          <EmojiRating
            responses={popups[currentPopup].responses}
            currentResponse={responses[currentPopup]}
            handleResponse={handleResponse}
          />
        )}
        {popups[currentPopup].type === "rating" && (
          <StarRating
            ratings={popups[currentPopup].responses}
            hoverRating={hoverRating}
            currentRating={responses[currentPopup]}
            setHoverRating={setHoverRating}
            handleResponse={handleResponse}
          />
        )}
      </div>
    </div>
  );
}

export default PopupContent;
