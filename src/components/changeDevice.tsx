"use client";

import { useDevices } from "@huddle01/react/hooks";
import { FC, use } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { BasicIcons } from "@/utils/BasicIcons";
import { useStudioState } from "@/store/studioState";

interface ChangeDeviceProps {
  deviceType: "mic" | "cam" | "speaker";
  children: React.ReactNode;
}

const ChangeDevice: FC<ChangeDeviceProps> = ({ children, deviceType }) => {
  const {
    audioInputDevice,
    videoDevice,
    audioOutputDevice,
    setAudioInputDevice,
    setVideoDevice,
    setAudioOutputDevice,
  } = useStudioState();
  const { devices } = useDevices({
    type: deviceType,
  });

  return (
    <>
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>{children}</TooltipTrigger>
          <TooltipContent>
            {devices.map((device) => (
              <button
                key={device.deviceId}
                onClick={() => {
                  switch (deviceType) {
                    case "mic":
                      setAudioInputDevice(device);
                      break;
                    case "cam":
                      setVideoDevice(device);
                      break;
                    case "speaker":
                      setAudioOutputDevice(device);
                      break;
                  }
                }}
                className="flex gap-2 p-2 gray-800 w-full rounded-lg hover:bg-gray-700"
              >
                <span>
                  {deviceType === "mic" &&
                    audioInputDevice?.label === device.label &&
                    BasicIcons.selected}
                  {deviceType === "cam" &&
                    videoDevice?.label === device.label &&
                    BasicIcons.selected}
                  {deviceType === "speaker" &&
                    audioOutputDevice?.label === device.label &&
                    BasicIcons.selected}
                </span>
                {device.label}
              </button>
            ))}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
};

export default ChangeDevice;
