import React from "react";

function PageBackgroundPattern() {
  return (
    <div
      className="fixed inset-0 opacity-10"
      style={{
        backgroundImage: `linear-gradient(30deg, #a0aec0 12%, transparent 12.5%, transparent 87%, #a0aec0 87.5%, #a0aec0),    linear-gradient(150deg, #a0aec0 12%, transparent 12.5%, transparent 87%, #a0aec0 87.5%, #a0aec0), 
      linear-gradient(30deg, #a0aec0 12%, transparent 12.5%, transparent 87%, #a0aec0 87.5%, #a0aec0), 
      linear-gradient(150deg, #a0aec0 12%, transparent 12.5%, transparent 87%, #a0aec0 87.5%, #a0aec0), 
      linear-gradient(60deg, #cbd5e0 25%, transparent 25.5%, transparent 75%, #cfcfcf 75%, #cbd5e0), 
      linear-gradient(60deg, #375677 25%, transparent 25.5%, transparent 75%, #6e88a5 75%, #cbd5e0)`,
        backgroundSize: "82rem 50rem",
        backgroundPosition: "0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px",
      }}
    />
  );
}

export default PageBackgroundPattern;
