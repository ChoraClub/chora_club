import { SessionInterface } from "@/types/MeetingTypes";
import toast from "react-hot-toast";

export const handleStopRecording = async (
  roomId: string | undefined,
  address: string | undefined
) => {
  console.log("stop recording");
  if (!roomId) {
    console.error("roomId is undefined");
    return;
  }

  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    if (address) {
      myHeaders.append("x-wallet-address", address);
    }
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify({
        roomId: roomId,
      }),
    };
    const response = await fetch(
      `/api/stopRecording/${roomId}`,
      requestOptions
    );
    const data = await response.json();
    console.log("response: ", response);

    if (!response.ok) {
      console.error(`Request failed with status: ${response.status}`);
      toast.error("Failed to stop recording");
      return;
    }

    if (data.success === true) {
      // setIsRecording(false);
      toast.success("Recording stopped");
      const success = true;
      return success;
    }
  } catch (error) {
    console.error("Error during stop recording:", error);
    toast.error("Error during stop recording");
  }
};

export const handleCloseMeeting = async (
  address: string | undefined,
  meetingCategory: string,
  roomId: string | undefined,
  daoName: string,
  hostAddress: string,
  meetingStatus: boolean | undefined,
  meetingData: SessionInterface | undefined
) => {
  // if (role === "host") {
  let meetingType;
  if (meetingCategory === "officehours") {
    meetingType = 2;
  } else if (meetingCategory === "session") {
    meetingType = 1;
  } else {
    meetingType = 0;
  }

  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    if (address) {
      myHeaders.append("x-wallet-address", address);
    }
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify({
        roomId: roomId,
        meetingType: meetingType,
        dao_name: daoName,
        hostAddress: hostAddress,
      }),
    };

    const response = await fetch("/api/end-call", requestOptions);
    const result = await response.json();
    console.log("result in end call::", result);

    if (meetingStatus === true && result.success) {
      try {
        toast.success("Giving Attestations");
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        if (address) {
          myHeaders.append("x-wallet-address", address);
        }
        const response = await fetch(`/api/get-attest-data`, {
          method: "POST",
          headers: myHeaders,
          body: JSON.stringify({
            roomId: roomId,
            connectedAddress: address,
            meetingData: meetingData,
          }),
        });
        const response_data = await response.json();
        console.log("Updated", response_data);
        if (response_data.success) {
          toast.success("Attestation successful");
        }
      } catch (e) {
        console.log("Error in attestation: ", e);
        toast.error("Attestation denied");
      }
    }
  } catch (error) {
    console.error("Error handling end call:", error);
  }
  // }
};
