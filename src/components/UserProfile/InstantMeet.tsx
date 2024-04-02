import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Oval } from "react-loader-spinner";
import { useAccount } from "wagmi";
import { useNetwork } from "wagmi";

interface instantMeetProps {
  isDelegate: boolean;
  selfDelegate: boolean;
}

function InstantMeet({ isDelegate, selfDelegate }: instantMeetProps) {
  const [modalData, setModalData] = useState({
    dao_name: "",
    title: "",
    description: "",
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [confirmSave, setConfirmSave] = useState(false);
  const { address } = useAccount();
  const { chain, chains } = useNetwork();
  const [isScheduling, setIsScheduling] = useState(false);
  const router = useRouter();

  const handleModalInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    console.log("Value in modal: ", value);
    setModalData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const startInstantMeet = async () => {
    setConfirmSave(true);
    const response = await fetch(
      "https://api.huddle01.com/api/v1/create-room",
      {
        method: "POST",
        body: JSON.stringify({
          title: "Test Room",
        }),
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY ?? "",
        },
        cache: "no-store",
      }
    );

    // if (!response.ok) {
    //   throw new Error("Failed to fetch");
    // }

    const result = await response.json();
    // console.log(result);
    const { roomId } = await result.data;
    console.log("Instant meet: ", roomId);

    let localDateTime = new Date();

    // Convert the local date and time to the specified format (YYYY-MM-DDTHH:mm:ss.sssZ)
    let dateInfo = localDateTime.toISOString();

    console.log("Modal details: ", modalData);

    const requestData = {
      dao_name: modalData.dao_name,
      slot_time: dateInfo,
      title: modalData.title,
      description: modalData.description,
      host_address: address,
      session_type: "instant-meet",
      meetingId: roomId,
      meeting_status: "Ongoing",
      attendees: [],
    };

    console.log("requestData", requestData);

    const requestOptions: any = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
      redirect: "follow",
    };

    try {
      console.log("calling.......");
      const response = await fetch("/api/book-slot", requestOptions);
      const result = await response.json();
      console.log("result of book-slots", result);
      if (result.success) {
        // setIsScheduled(true);
        setConfirmSave(false);
        router.push(`/meeting/session/${roomId}/lobby`);
      }
    } catch (error) {
      setConfirmSave(false);
      // setIsScheduled(false);
      console.error("Error:", error);
    }
    setModalData({
      dao_name: "",
      title: "",
      description: "",
    });
  };

  return (
    <div>
      <div className="pb-4 pr-12">
        <div className="text-blue-shade-100 text-xl font-semibold pb-1">
          Start an Instant Meeting
        </div>
        <div className="font-semibold pb-3">Connect with Others Instantly</div>

        <div className="pb-3">
          Engage with yourself in an instant meeting and share the link with the
          people you want to connect with. Experience the following features for
          a comprehensive virtual meeting experience:
        </div>

        <div className="pb-2">
          <span className="font-semibold">Quick Access to DAO Links: </span>{" "}
          <span>
            Access the quick links of DAO directly within the meeting itself,
            making it easier to reference and share relevant information during
            your session.
          </span>
        </div>

        <div className="pb-2">
          <span className="font-semibold">Video Call: </span>{" "}
          <span>
            Connect seamlessly and engage face-to-face with crisp and clear
            video quality, bringing your virtual meetings to life.
          </span>
        </div>

        <div className="pb-2">
          <span className="font-semibold">Audio Call: </span>{" "}
          <span>
            Experience crystal-clear audio that ensures smooth and effective
            communication with all participants, enhancing the meeting
            experience.
          </span>
        </div>

        <div className="pb-2">
          <span className="font-semibold">Screen Sharing: </span>{" "}
          <span>
            Effortlessly share your screen to showcase documents, presentations,
            or any other content, making collaboration more interactive and
            dynamic.
          </span>
        </div>

        <div className="pb-2">
          <span className="font-semibold">Chat: </span>{" "}
          <span>
            Foster real-time communication by sending text messages to
            participants within the meeting, allowing for quick exchanges and
            enhanced collaboration.
          </span>
        </div>
      </div>
      <button
        className="bg-blue-shade-200 text-white px-4 py-2 rounded-md font-semibold"
        onClick={onOpen}
      >
        Start an instant meet
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          // setIsScheduling(false);
        }}
        className="font-poppins"
      >
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1">
              Provide details for instant meet
            </ModalHeader>
            <ModalBody>
              <div className="px-1 font-medium">Title:</div>
              <input
                type="text"
                name="title"
                value={modalData.title}
                onChange={handleModalInputChange}
                placeholder="Explain Governance"
                className="outline-none bg-[#D9D9D945] rounded-md px-2 py-1 text-sm"
                required
              />

              <div className="px-1 font-medium">Description:</div>
              <textarea
                name="description"
                value={modalData.description}
                onChange={handleModalInputChange}
                placeholder="Please share anything that will help prepare for our meeting."
                className="outline-none bg-[#D9D9D945] rounded-md px-2 py-1 text-sm"
                required
              />

              <div className="px-1 font-medium">Select DAO:</div>
              <select
                required
                className="outline-none bg-[#D9D9D945] rounded-md px-2 py-1 text-sm"
                onChange={handleModalInputChange}
                name="dao_name"
              >
                <option selected disabled>
                  Select DAO
                </option>
                <option value="optimism">Optimism</option>
                <option value="arbitrum">Arbitrum</option>
              </select>
            </ModalBody>
            <ModalFooter>
              <Button
                color="default"
                onClick={() => {
                  onClose();
                  // setIsScheduling(false);
                }}
              >
                Close
              </Button>
              <Button
                color="primary"
                onClick={startInstantMeet}
                isDisabled={confirmSave}
              >
                {confirmSave ? (
                  <div className="flex items-center justify-center">
                    <Oval
                      visible={true}
                      height="20"
                      width="20"
                      color="#0500FF"
                      secondaryColor="#cdccff"
                      ariaLabel="oval-loading"
                    />
                  </div>
                ) : (
                  <>Save</>
                )}
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default InstantMeet;
