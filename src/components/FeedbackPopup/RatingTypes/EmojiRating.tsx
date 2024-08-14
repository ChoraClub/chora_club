// EmojiRating.tsx
import React from "react";

interface EmojiRatingProps {
  responses: any[];
  currentResponse: string;
  handleResponse: (response: any) => void;
}

function EmojiRating({ responses, currentResponse, handleResponse }: EmojiRatingProps) {
  return (
    <>
      {responses.map((response) => (
        <div
          key={response.text}
          onClick={() => handleResponse(response.text)}
          className="cursor-pointer text-center p-2"
        >
          <div
            className={`text-3xl mb-1 p-1 ${
              currentResponse === response.text
                ? "bg-yellow-100 rounded-lg inline-block"
                : "inline-block"
            }`}
          >
            {response.emoji}
          </div>
          <div className="text-xs">{response.text}</div>
        </div>
      ))}
    </>
  );
}

export default EmojiRating;
