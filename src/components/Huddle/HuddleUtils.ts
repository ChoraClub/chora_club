import { SessionInterface } from "@/types/MeetingTypes";
import toast from "react-hot-toast";

export const startRecording = async (
  roomId: string | undefined,
  setIsRecording: (val: boolean | null) => void
) => {
  try {
    console.log("recording started");
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // if (address) {
    //   myHeaders.append("x-wallet-address", address);
    // }
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify({
        roomId: roomId,
      }),
    };

    const status = await fetch(`/api/startRecording/${roomId}`, requestOptions);
    if (!status.ok) {
      console.error(`Request failed with status: ${status.status}`);
      toast.error("Failed to start recording");
      return;
    }
    setIsRecording(true);
    toast.success("Recording started");
  } catch (error) {
    console.error("Error starting recording:", error);
    toast.error("Error starting recording");
  }
};

export const handleStopRecording = async (
  roomId: string | undefined,
  address: string | undefined,
  setIsRecording: (val: boolean | null) => void
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
      setIsRecording(false);
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

    const storedStatus = sessionStorage.getItem("meetingData");
    let meetingStatus;

    if (storedStatus) {
      const parsedStatus = JSON.parse(storedStatus);
      console.log("storedStatus: ", parsedStatus);
      if (parsedStatus.meetingId === roomId) {
        meetingStatus = parsedStatus.isMeetingRecorded;
      }
    }

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

export const handleRecording = async (
  roomId: string | undefined,
  address: string | undefined,
  isRecording: boolean | null,
  setIsRecording: (val: boolean | null) => void,
  setMeetingRecordingStatus: (val: boolean) => void
) => {
  if (isRecording) {
    handleStopRecording(roomId, address, setIsRecording);
    let existingValue = sessionStorage.getItem("meetingData");
    if (existingValue) {
      let parsedValue = JSON.parse(existingValue);
      console.log("parsedValue: ", parsedValue);
      parsedValue.recordingStatus = false;

      // Step 3: Store the updated value back in sessionStorage
      sessionStorage.setItem("meetingData", JSON.stringify(parsedValue));
    }
  } else {
    setMeetingRecordingStatus(true);

    startRecording(roomId, setIsRecording);
    let existingValue = sessionStorage.getItem("meetingData");
    if (existingValue) {
      let parsedValue = JSON.parse(existingValue);
      console.log("parsedValue: ", parsedValue);
      if (parsedValue.meetingId === roomId) {
        if (parsedValue.isMeetingRecorded === false) {
          parsedValue.isMeetingRecorded = true;
        }
        parsedValue.recordingStatus = true;
      }

      // Step 3: Store the updated value back in sessionStorage
      sessionStorage.setItem("meetingData", JSON.stringify(parsedValue));
    }
  }
};
