import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
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
    date: "",
    title: "",
    description: "",
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [confirmSave, setConfirmSave] = useState(false);
  const { address } = useAccount();
  const { chain, chains } = useNetwork();

  const handleModalInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setModalData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const startInstantMeet = async () => {
    const res = await fetch("/api/create-room", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await res.json();
    const roomId = await result.data;
    console.log("Instant meet: ", roomId);

    let localDateTime = new Date();

    // Convert the local date and time to the specified format (YYYY-MM-DDTHH:mm:ss.sssZ)
    let dateInfo = localDateTime.toISOString();
    let dao =
      chain?.name === "Optimism"
        ? "optimism"
        : chain?.name === "Arbitrum One"
        ? "arbitrum"
        : "";

    const requestData = {
      dao_name: dao,
      slot_time: dateInfo,
      title: modalData.title,
      description: modalData.description,
      host_address: address,
      session_type: "instant-meet",
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
      setConfirmSave(true);
      const response = await fetch("/api/book-slot", requestOptions);
      const result = await response.json();
      console.log("result of book-slots", result);
      if (result.success) {
        // setIsScheduled(true);
        setConfirmSave(false);
      }
    } catch (error) {
      setConfirmSave(false);
      // setIsScheduled(false);
      console.error("Error:", error);
    }
    setModalData({
      dao_name: "",
      date: "",
      title: "",
      description: "",
    });
    onClose();
  };

  return (
    <div>
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
                // onClick={apiCall}
                // isDisabled={confirmSave}
              >
                {confirmSave ? (
                  <div className="flex items-center justify-center">
                    <Oval
                      visible={true}
                      height="30"
                      width="30"
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
