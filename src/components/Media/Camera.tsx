import React, { useEffect, useRef } from "react";
import { useStudioState } from "@/store/studioState";

interface VideoProps {
  stream: MediaStream | null;
  name: string;
}

const Camera = ({ stream, name }: VideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isRecordVideo } = useStudioState();

  useEffect(() => {
    const videoObj = videoRef.current;

    if (videoObj && stream) {
      videoObj.srcObject = stream;
      videoObj.onloadedmetadata = async () => {
        try {
          videoObj.muted = true;
          await videoObj.play();
        } catch (error) {
          console.error(error);
        }
      };
    }
  }, [stream]);

  return (
    <>
      <video
        className="h-full w-full rounded-lg object-cover object-center"
        ref={videoRef}
        autoPlay
        muted
      />
    </>
  );
};

export default Camera;
