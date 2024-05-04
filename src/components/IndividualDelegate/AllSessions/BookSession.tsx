"use client";

import React, { useState, useEffect } from "react";
import DayTimeScheduler from "@captainwalterdev/daytimescheduler";
import { useAccount } from "wagmi";
import { DateTime, Duration } from "luxon";
import dateFns from "date-fns";
import { useSession } from "next-auth/react";
import { Oval } from "react-loader-spinner";
import styled from "styled-components";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import toast, { Toaster } from "react-hot-toast";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import SchedulingSuccessModal from "@/components/UserProfile/UserAllSessions/SchedulingSuccessModal";
import BookingSuccessModal from "./BookingSuccessModal";
interface Type {
  daoDelegates: string;
  individualDelegate: string;
}
const StyledTimePickerContainer = styled.div`
  div > ul {
    height: 400px;
  }
`;

function BookSession({ props }: { props: Type }) {
  const { openConnectModal } = useConnectModal();
  // const host_address = "0x3013bb4E03a7B81106D69C10710EaE148C8410E1";
  const host_address = props.individualDelegate;
  const { isConnected, address } = useAccount();
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const [isScheduling, setIsScheduling] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleErr, setScheduleErr] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [APIData, setAPIData] = useState<any>();
  const [APIBookings, setAPIBookings] = useState<any>();
  const [bookedSlots, setBookedSlots] = useState<any>([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [dateInfo, setDateInfo] = useState();
  const [modalData, setModalData] = useState({
    dao_name: "",
    date: "",
    title: "",
    description: "",
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [confirmSave, setConfirmSave] = useState(false);
  const [slotTimes, setSlotTimes] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // if (isConnected) {
    // setTimeout(() => {
    getAvailability();
    getSlotTimeAvailability();
    // setIsPageLoading(false);
    // }, 1000);
    // }

    // setIsPageLoading(false);

    return () => {
      clearTimeout(loadingTimeout);
    };
  }, [address, isConnected, session]);

  const getAvailability = async () => {
    try {
      const response = await fetch(`/api/get-availability/${host_address}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      // console.log("result", result);
      if (result.success) {
        setAPIData(result.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  const getSlotTimeAvailability = async () => {
    try {
      const response = await fetch(`/api/get-meeting/${host_address}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      console.log("result in get meeting", result);
      if (result.success) {
        setAPIBookings(result.data);
        const extractedSlotTimes = result.data.map(
          (item: any) => new Date(item.slot_time)
        );
        console.log("extractedSlotTimes", extractedSlotTimes);
        setSlotTimes(extractedSlotTimes);
        setIsPageLoading(false);

        // Assuming bookedSlots is an array of Date objects
        const newBookedSlots: any = [
          ...bookedSlots,
          ...extractedSlotTimes, // Spread the extractedSlotTimes array
        ];

        setBookedSlots(newBookedSlots);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("error in catch", error);
      setIsPageLoading(false);
    }
  };

  const dataRequest = async (data: any) => {
    setIsScheduling(true);
    setScheduleErr("");

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          status: "ok",
          scheduled: data,
        });
      }, 1000);
    });
  };

  const handleModalInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setModalData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleScheduled = async (data: any) => {
    if (isConnected) {
      setIsScheduling(true);
      setScheduleErr("");
      setDateInfo(data);
      onOpen();
    } else {
      if (openConnectModal) {
        openConnectModal();
      }
    }
  };

  const apiCall = async () => {
    const requestData = {
      dao_name: props.daoDelegates,
      slot_time: dateInfo,
      title: modalData.title,
      description: modalData.description,
      host_address: host_address,
      attendees: [{ attendee_address: address }],
      meeting_status: "",
      booking_status: "Pending",
      session_type: "session",
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
        setIsScheduled(true);
        setConfirmSave(false);
        setModalOpen(true);
      }
    } catch (error) {
      setConfirmSave(false);
      setIsScheduled(false);
      console.error("Error:", error);
    }

    // Reset modal data
    setModalData({
      dao_name: "",
      date: "",
      title: "",
      description: "",
    });
    onClose();
  };

  const timeSlotSizeMinutes = 15;
  let dateAndRanges: any = [];
  let allowedDates: any = [];

  // Check if API data exists
  if (APIData) {
    // console.log("APIData", APIData)
    APIData.forEach((item: any) => {
      // console.log("item", item)
      dateAndRanges.push(...item.dateAndRanges);
      allowedDates.push(...item.allowedDates);
    });

    dateAndRanges.forEach((range: any) => {
      range.date = new Date(range.date);
      range.formattedUTCTime_startTime = new Date(
        range.formattedUTCTime_startTime
      );
      range.formattedUTCTime_endTime = new Date(range.formattedUTCTime_endTime);

      const timeOptions = { hour: "2-digit", minute: "2-digit", hour12: false };
      const formattedStartTime =
        range.formattedUTCTime_startTime.toLocaleTimeString(
          undefined,
          timeOptions
        );
      const formattedEndTime =
        range.formattedUTCTime_endTime.toLocaleTimeString(
          undefined,
          timeOptions
        );

      range.utcTime_startTime = formattedStartTime;
      range.utcTime_endTime = formattedEndTime;

      const [startHourTime, startMinuteTime] = formattedStartTime.split(":");
      const [endHourTime, endMinuteTime] = formattedEndTime.split(":");

      range.timeRanges = [
        [startHourTime, startMinuteTime, endHourTime, endMinuteTime],
      ];
    });

    allowedDates = [
      ...new Set(
        dateAndRanges.flatMap(
          ({ formattedUTCTime_startTime, formattedUTCTime_endTime }: any) => [
            formattedUTCTime_startTime,
            formattedUTCTime_endTime,
          ]
        )
      ),
    ];
  }

  function timeSlotValidator(
    slotTime: any,
    dateAndRanges: any,
    bookedSlots: any
  ) {
    for (const {
      formattedUTCTime_startTime: startTime,
      formattedUTCTime_endTime: endTime,
    } of dateAndRanges) {
      // Check if slotTime is within the time range of startTime and endTime
      if (
        slotTime.getTime() >= startTime.getTime() &&
        slotTime.getTime() <= endTime.getTime()
      ) {
        // Check if the slot is booked
        const isBooked = bookedSlots.some((bookedSlot: any) => {
          return (
            dateFns.isSameDay(startTime, bookedSlot) &&
            slotTime.getHours() === bookedSlot.getHours() &&
            slotTime.getMinutes() === bookedSlot.getMinutes()
          );
        });

        // If the slot is not booked, return true
        if (!isBooked) {
          return true;
        }
      }
    }

    return false;
  }

  const handleModalClose = () => {
    console.log("Popup Closed");
    setModalOpen(false);
  };

  return (
    <>
      {isPageLoading ? (
        <div className="flex items-center justify-center">
          <Oval
            visible={true}
            height="40"
            width="40"
            color="#0500FF"
            secondaryColor="#cdccff"
            ariaLabel="oval-loading"
          />
        </div>
      ) : (
        <div className="flex justify-center">
          <div
            className="rounded-2xl"
            style={{
              margin: "0 auto",
              marginTop: "2rem",
              boxShadow: "0px 4px 50.8px 0px rgba(0, 0, 0, 0.11)",
              width: "fit-content",
            }}
          >
            <StyledTimePickerContainer>
              <DayTimeScheduler
                allowedDates={allowedDates}
                timeSlotSizeMinutes={timeSlotSizeMinutes}
                isLoading={isScheduling}
                isDone={isScheduled}
                err={scheduleErr}
                onConfirm={handleScheduled}
                timeSlotValidator={(slotTime: any) =>
                  timeSlotValidator(slotTime, dateAndRanges, bookedSlots)
                }
              />
            </StyledTimePickerContainer>
          </div>
        </div>
      )}

      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setIsScheduling(false);
        }}
        className="font-poppins"
      >
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1">
              Book your slot for {props.daoDelegates}
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
                  setIsScheduling(false);
                }}
              >
                Close
              </Button>
              <Button
                color="primary"
                onClick={apiCall}
                isDisabled={confirmSave}
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

      {modalOpen && (
        <BookingSuccessModal isOpen={modalOpen} onClose={handleModalClose} />
      )}
    </>
  );
}

export default BookSession;
