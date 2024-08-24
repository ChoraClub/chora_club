// StarRating.tsx
import React from "react";
import { FaStar } from "react-icons/fa";

interface StarRatingProps {
  ratings: number[];
  hoverRating: number;
  currentRating: number;
  setHoverRating: (rating: number) => void;
  handleResponse: (rating: number) => void;
}

function StarRating({
  ratings,
  hoverRating,
  currentRating,
  setHoverRating,
  handleResponse
}: StarRatingProps) {
  return (
    <>
      {ratings.map((rating) => (
        <FaStar
          key={rating}
          size={24}
          color={
            rating <= (hoverRating || currentRating) ? "#ebae34" : "gray"
          }
          onMouseEnter={() => setHoverRating(rating)}
          onMouseLeave={() => setHoverRating(0)}
          onClick={() => handleResponse(rating)}
          className="cursor-pointer"
        />
      ))}
    </>
  );
}

export default StarRating;
