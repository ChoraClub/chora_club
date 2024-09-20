import React from "react";

interface IconProps {
  onClick: () => void;
  className?: string; // Add className as an optional prop
}

export const PlusIcon: React.FC<IconProps> = ({ onClick, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="white"
    width="32"
    height="32"
    className={className}
    style={{
      background: "blue",
      borderRadius: "50%",
      padding: "4px",
      // cursor: "pointer",
    }}
    onClick={onClick}
  >
    <path
      fillRule="evenodd"
      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
      clipRule="evenodd"
    />
  </svg>
);

export const MinusIcon: React.FC<IconProps> = ({ onClick, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="white"
    width="32"
    height="32"
    className={className}
    style={{
      background: "blue",
      borderRadius: "50%",
      padding: "4px",
      // cursor: "pointer",
    }}
    onClick={onClick}
  >
    <path
      fillRule="evenodd"
      d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
      clipRule="evenodd"
    />
  </svg>
);

const SourceGraphics = React.memo(() => (
  <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
    <defs>
      <filter id="goo">
        <feGaussianBlur
          in="SourceGraphic"
          result="blur"
          stdDeviation="10"
        ></feGaussianBlur>
        <feColorMatrix
          in="blur"
          mode="matrix"
          values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 21 -7"
          result="goo"
        ></feColorMatrix>
        <feBlend in2="goo" in="SourceGraphic" result="mix"></feBlend>
      </filter>
    </defs>
  </svg>
));

SourceGraphics.displayName = "SourceGraphics";

export const BasicMintIcons = {
  SourceGraphics,
};
