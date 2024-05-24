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
import React, { useEffect, useState } from "react";
import { Oval } from "react-loader-spinner";
import { useAccount } from "wagmi";
import { useNetwork } from "wagmi";
import Image from "next/image";
import { Tooltip } from "@nextui-org/react";
import connectImg from "@/assets/images/instant-meet/connect.png";
import connetImghover from "@/assets/images/instant-meet/ic_baseline-connect-without-contact-hover.svg";
import accessImg from "@/assets/images/instant-meet/quick-access.png";
import accessImghover from "@/assets/images/instant-meet/mingcute_link-fill-hover.svg";
import videoImg from "@/assets/images/instant-meet/video-call.png";
import videoImghover from "@/assets/images/instant-meet/wpf_video-call-hover.svg";
import audioImg from "@/assets/images/instant-meet/audio-call.png";
import audioImghover from "@/assets/images/instant-meet/fluent_call-12-filled-hover.svg";
import screenImg from "@/assets/images/instant-meet/screen-share.png";
import screenImghover from "@/assets/images/instant-meet/ic_baseline-screen-share-hover.svg";
import chatImg from "@/assets/images/instant-meet/chat.png";
import chatImghover from "@/assets/images/instant-meet/lets-icons_chat-fill-hover.svg";
import heroImg from "@/assets/images/instant-meet/instant-meet-hero.svg";

interface instantMeetProps {
  isDelegate: boolean;
  selfDelegate: boolean;
}

function InstantMeet({ isDelegate, selfDelegate }: instantMeetProps) {
  const [modalData, setModalData] = useState({
    title: "",
    description: "",
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [confirmSave, setConfirmSave] = useState(false);
  const { address } = useAccount();
  const { chain, chains } = useNetwork();
  const [isScheduling, setIsScheduling] = useState(false);
  const [daoName, setDaoName] = useState<string>();
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
    const res = await fetch(
      "https://api-choraclub.vercel.app/api/create-room",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await res.json();
    const roomId = await result.data;
    console.log("Instant meet: ", roomId);

    let localDateTime = new Date();

    // Convert the local date and time to the specified format (YYYY-MM-DDTHH:mm:ss.sssZ)
    let dateInfo = localDateTime.toISOString();

    console.log("Modal details: ", modalData);

    const requestData = {
      dao_name: daoName,
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
      // console.log("calling.......");
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
      title: "",
      description: "",
    });
  };

  useEffect(() => {
    if (chain?.name === "Optimism") {
      setDaoName("optimism");
    } else if (chain?.name === "Arbitrum One") {
      setDaoName("arbitrum");
    }
  }, [chain]);

  const block = [
    {
      image: connectImg,
      hoverImage: connetImghover,
      title: "Connect with Others Instantly",
      description:
        "Engage with yourself in an instant meeting and share the link with the people you want to connect with. Experience the following features for a comprehensive virtual meeting experience.",
    },
    {
      image: accessImg,
      hoverImage: accessImghover,
      title: "Quick Access to DAO Links",
      description:
        "Access the quick links of DAO directly within the meeting itself,making it easier to reference and share relevant information during your session.",
    },
    {
      image: videoImg,
      hoverImage: videoImghover,
      title: "Video Call",
      description:
        " Connect seamlessly and engage face-to-face with crisp and clear video quality, bringing your virtual meetings to life.",
    },
    {
      image: audioImg,
      hoverImage: audioImghover,
      title: "Audio Call",
      description:
        "Experience crystal-clear audio that ensures smooth and effective communication with all participants, enhancing the meeting experience.",
    },
    {
      image: screenImg,
      hoverImage: screenImghover,
      title: "Screen Sharing",
      description:
        "Effortlessly share your screen to showcase documents, presentations,or any other content, making collaboration more interactive and dynamic.",
    },
    {
      image: chatImg,
      hoverImage: chatImghover,
      title: "Chat",
      description:
        "Foster real-time communication by sending text messages to participants within the meeting, allowing for quick exchanges and enhanced collaboration.",
    },
  ];

  return (
    <div>
      <div className="pb-28 pr-12">
        <div className="">
          <div className="grid grid-cols-7 rounded-3xl border-solid border-2 border-[#F9F9F9]-900">
            <div className="col-span-4 border-solid border-r-2 border-[#F9F9F9]-900">
              <div className="p-14">
                <div className="text-[#3E3D3D] text-3xl font-semibold font-poppins text-center">
                  Start an Instant Meeting
                </div>

                <div className="grid grid-cols-3 grid-rows-2 text-sm gap-11 font-semibold pt-8 text-[#3E3D3D] text-center">
                  {block.map((data, index) => (
                    <Tooltip
                      key={index}
                      content={
                        <div className="px-1 py-3 w-80 ">
                          <div className="font-poppins text-[#7C7C7C] text-center">
                            {data.description}
                          </div>
                        </div>
                      }
                      placement="top"
                      className="group w-fit"
                      motionProps={{
                        variants: {
                          exit: {
                            opacity: 0,
                            transition: {
                              duration: 0.5,
                              ease: "easeIn",
                            },
                          },
                          enter: {
                            opacity: 1,
                            transition: {
                              duration: 0.25,
                              ease: "easeOut",
                            },
                          },
                        },
                      }}>
                      <div>
                        <div className="group border rounded-3xl bg-[#E5E5EA] flex items-center justify-center p-8 hover:bg-blue-shade-100 hover:shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
                          <Image
                            alt="{image}"
                            height={60}
                            width={60}
                            src={data.image}
                            className="transition duration-300 ease-in-out transform group-hover:hidden"
                            quality={100}
                            priority
                          />
                          <Image
                            alt="{hoverImage}"
                            height={60}
                            width={60}
                            src={data.hoverImage}
                            className="hidden transition duration-300 ease-in-out transform group-hover:block group-hover:scale-105"
                            quality={100}
                            priority
                          />
                        </div>
                        <div className="p-2">
                          <span className="">{data.title}</span>
                        </div>
                      </div>
                    </Tooltip>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-span-3 flex flex-col p-3 items-center justify-center -mt-[25%]">
              <div className="h-auto w-auto bg-cover mb-[-20%]">
                <Image alt="img7" src={heroImg} quality={100} priority />
              </div>
              <div className="text-center transition-transform transform hover:scale-105 duration-300">
                <button
                  className="bg-blue-shade-200 py-3 px-6 rounded-full text-white font-semibold"
                  onClick={onOpen}>
                  Start an instant meet
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          // setIsScheduling(false);
        }}
        className="font-poppins">
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

              <div className="px-1 font-medium">Selected DAO:</div>
              <div className="outline-none bg-[#D9D9D945] rounded-md px-2 py-1 text-sm capitalize">
                {daoName}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="default"
                onClick={() => {
                  onClose();
                  // setIsScheduling(false);
                }}>
                Close
              </Button>
              <Button
                color="primary"
                onClick={startInstantMeet}
                isDisabled={confirmSave}>
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
