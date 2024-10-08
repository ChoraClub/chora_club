"use client";

import React, { useState, useEffect } from "react";
import DayTimeScheduler from "@captainwalterdev/daytimescheduler";
import { useAccount } from "wagmi";
import { DateTime, Duration } from "luxon";
import dateFns from "date-fns";
import { useSession } from "next-auth/react";
import { Oval, ThreeDots } from "react-loader-spinner";
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
import AddEmailModal from "@/components/ComponentUtils/AddEmailModal";
import { RxCross2 } from "react-icons/rx";
import { MdCancel } from "react-icons/md";
import { useRouter } from "next-nprogress-bar";
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
  const router = useRouter();
  const { openConnectModal } = useConnectModal();
  // const host_address = "0x3013bb4E03a7B81106D69C10710EaE148C8410E1";
  const daoName = props.daoDelegates;
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

  const [mailId, setMailId] = useState<string>();
  const [hasEmailID, setHasEmailID] = useState<Boolean>();
  const [showGetMailModal, setShowGetMailModal] = useState<Boolean>();
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [continueAPICalling, setContinueAPICalling] = useState<Boolean>(false);
  const [userRejected, setUserRejected] = useState<Boolean>();
  const [addingEmail, setAddingEmail] = useState<boolean>();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    getAvailability();
    getSlotTimeAvailability();
    return () => {
      clearTimeout(loadingTimeout);
    };
  }, [address, isConnected, session]);

  const getAvailability = async () => {
    try {
      const response = await fetch(
        `/api/get-availability/${host_address}?dao_name=${daoName}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();
      if (result.success) {
        setAPIData(result.data);
        setIsLoading(false);
      }
    } catch (error) {}
  };

  const getSlotTimeAvailability = async () => {
    try {
      const response = await fetch(
        `/api/get-meeting/${host_address}?dao_name=${daoName}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();
      if (result.success) {
        setAPIBookings(result.data);
        const extractedSlotTimes = result.data.map(
          (item: any) => new Date(item.slot_time)
        );
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
      if (host_address === address) {
        toast("Delegates can not book their own sessions!");
      } else {
        setIsScheduling(true);
        setScheduleErr("");
        setDateInfo(data);
        onOpen();
      }
    } else {
      if (openConnectModal) {
        openConnectModal();
      }
    }
  };

  useEffect(() => {
    const hasRejected = JSON.parse(
      sessionStorage.getItem("bookingMailRejected") || "false"
    );
    setUserRejected(hasRejected);
  }, [userRejected, sessionStorage.getItem("bookingMailRejected")]);

  useEffect(() => {
    if (continueAPICalling) {
      apiCall();
    }
  }, [continueAPICalling]);

  const checkUser = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      if (address) {
        myHeaders.append("x-wallet-address", address);
      }

      const raw = JSON.stringify({
        address: address,
      });

      const requestOptions: any = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      const response = await fetch(`/api/profile/${address}`, requestOptions);
      const result = await response.json();
      if (Array.isArray(result.data) && result.data.length > 0) {
        for (const item of result.data) {
          if (item.address === address) {
            if (item.emailId === null || item.emailId === "") {
              setHasEmailID(false);
              return false;
            } else if (item.emailId) {
              const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              const isValid = emailPattern.test(item.emailId);
              if (isValid) {
                setMailId(item.emailId);
                setContinueAPICalling(true);
                setHasEmailID(true);
                return true;
              } else {
                setContinueAPICalling(false);
                return false;
              }
            }
          }
        }
      }
    } catch (error) {
      toast.error("An error occurred while checking user information");
      setHasEmailID(false);
      setContinueAPICalling(false);
      return false;
    }
  };

  const checkBeforeApiCall = async () => {
    if (modalData.title.length > 0 && modalData.description.length > 0) {
      try {
        setConfirmSave(true);
        const checkUserMail = await checkUser();
        const userRejectedLocal: any = await sessionStorage.getItem(
          "bookingMailRejected"
        );
        if (!checkUserMail && (!userRejected || !userRejectedLocal)) {
          setShowGetMailModal(true);
        } else {
          if (!continueAPICalling || continueAPICalling === false) {
            setContinueAPICalling(true);
          } else if (continueAPICalling) {
            apiCall();
          }
        }
      } catch (error) {}
    } else {
      toast.error("Please enter title and description!");
    }
  };

  const createRandomRoom = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_CREATE_ROOM_ENDPOINT}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await res.json();
    const roomId = await result.data;
    return roomId;
  };
  const apiCall = async () => {
    let roomId = await createRandomRoom();

    const requestData = {
      dao_name: props.daoDelegates,
      slot_time: dateInfo,
      title: modalData.title,
      description: modalData.description,
      host_address: host_address,
      attendees: [
        { attendee_address: address, attendee_joined_status: "Pending" },
      ],
      meeting_status: "Upcoming",
      booking_status: "Approved",
      session_type: "session",
      meetingId: roomId,
      host_joined_status: "Pending",
    };

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    if (address) {
      myHeaders.append("x-wallet-address", address);
    }

    const requestOptions: any = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(requestData),
      redirect: "follow",
    };

    try {
      setConfirmSave(true);
      const response = await fetch("/api/book-slot", requestOptions);
      const result = await response.json();
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

    setModalData({
      dao_name: "",
      date: "",
      title: "",
      description: "",
    });
    onClose();
  };

  const timeSlotSizeMinutes = 30;
  let dateAndRanges: any = [];
  let allowedDates: any = [];

  if (APIData) {
    APIData.forEach((item: any) => {
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

  function subtractOneMinute(date: any) {
    let newDate = new Date(date);
    newDate.setTime(newDate.getTime() - 60000);
    return newDate;
  }

  function timeSlotValidator(
    slotTime: any,
    dateAndRanges: any,
    bookedSlots: any
  ) {
    dateAndRanges = dateAndRanges.map((range: any) => ({
      formattedUTCTime_startTime: range.formattedUTCTime_startTime,
      formattedUTCTime_endTime: subtractOneMinute(
        range.formattedUTCTime_endTime
      ),
    }));
    for (const {
      formattedUTCTime_startTime: startTime,
      formattedUTCTime_endTime: endTime,
    } of dateAndRanges) {
      if (
        slotTime.getTime() >= startTime.getTime() &&
        slotTime.getTime() <= endTime.getTime()
      ) {
        const isBooked = bookedSlots.some((bookedSlot: any) => {
          return (
            dateFns.isSameDay(startTime, bookedSlot) &&
            slotTime.getHours() === bookedSlot.getHours() &&
            slotTime.getMinutes() === bookedSlot.getMinutes()
          );
        });

        if (!isBooked) {
          return true;
        }
      }
    }

    return false;
  }

  const handleModalClose = () => {
    setModalOpen(false);
    router.push(`/profile/${address}?active=sessions&session=attending`);
  };

  const handleEmailChange = (email: string) => {
    setMailId(email);
    setIsValidEmail(validateEmail(email));
  };

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  useEffect(() => {
    console.log("mailId", mailId);
  }, [mailId]);

  const handleSubmit = async () => {
    if (address) {
      if (mailId && (mailId !== "" || mailId !== undefined)) {
        if (isValidEmail) {
          try {
            setAddingEmail(true);
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            if (address) {
              myHeaders.append("x-wallet-address", address);
            }

            const raw = JSON.stringify({
              address: address,
              emailId: mailId,
            });

            const requestOptions: any = {
              method: "PUT",
              headers: myHeaders,
              body: raw,
              redirect: "follow",
            };

            const response = await fetch("/api/profile", requestOptions);
            const result = await response.json();
            if (result.success) {
              setContinueAPICalling(true);
              setAddingEmail(false);
            }
            setShowGetMailModal(false);
          } catch (error) {
            setAddingEmail(false);
          }
        } else {
          toast.error("Enter Valid Email");
          setShowGetMailModal(true);
        }
      } else {
        toast.error("Enter Valid Email");
        setShowGetMailModal(true);
      }
    }
  };

  const handleGetMailModalClose = () => {
    if (!userRejected) {
      sessionStorage.setItem("bookingMailRejected", JSON.stringify(true));
      setUserRejected(true);
    }
    setContinueAPICalling(true);
    setShowGetMailModal(false);
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

      {isOpen && (
        <div
          className="font-poppins z-[70] fixed inset-0 flex items-center justify-center backdrop-blur-md"
          style={{ boxShadow: " 0px 0px 45px -17px rgba(0,0,0,0.75)" }}
        >
          <div className="bg-white rounded-[41px] overflow-hidden shadow-lg w-1/2">
            <div className="relative">
              <div className="flex flex-col gap-1 text-white bg-[#292929] p-4 py-7">
                <h2 className="text-lg font-semibold mx-4">
                  Book your slot for{" "}
                  {props.daoDelegates.charAt(0).toUpperCase() +
                    props.daoDelegates.slice(1)}
                  <button
                    className="absolute right-7"
                    onClick={() => {
                      onClose();
                      setIsScheduling(false);
                    }}
                  >
                    <MdCancel size={28} color="white" />
                  </button>
                </h2>
              </div>
              <div className="px-8 py-4">
                <div className="mt-4">
                  <label className="block mb-2 font-semibold">Title:</label>
                  <input
                    disabled={confirmSave}
                    type="text"
                    name="title"
                    value={modalData.title}
                    onChange={handleModalInputChange}
                    placeholder="Explain Governance"
                    className="w-full px-4 py-2 border rounded-xl bg-[#D9D9D945]"
                    required
                  />
                </div>
                <div className="mt-4">
                  <label className="block mb-2 font-semibold">
                    Description:
                  </label>
                  <textarea
                    disabled={confirmSave}
                    name="description"
                    value={modalData.description}
                    onChange={handleModalInputChange}
                    placeholder="Please share anything that will help prepare for our meeting."
                    className="w-full px-4 py-2 border rounded-xl bg-[#D9D9D945]"
                    required
                  />
                </div>

                {showGetMailModal && (
                  <div className="mt-4 border rounded-xl p-4 relative">
                    <button
                      className="absolute top-2 right-3"
                      onClick={handleGetMailModalClose}
                      disabled={addingEmail}
                    >
                      <MdCancel size={25} />
                    </button>
                    <h2 className="text-blue-shade-200 font-semibold text-base">
                      Get Notified About Your Session Request
                    </h2>
                    <p className="text-gray-500 text-sm">
                      Add your email address to get notified when the delegate
                      approves or rejects your session request.
                    </p>
                    <div className="mt-2 flex rounded-3xl p-2 bg-[#D9D9D945]">
                      <input
                        type="text"
                        value={mailId || ""}
                        placeholder="Enter email address"
                        onChange={(e) => handleEmailChange(e.target.value)}
                        className="flex-1 px-4 py-2 rounded-3xl bg-transparent mr-1"
                      />
                      <button
                        onClick={handleSubmit}
                        className="bg-black text-white px-8 py-3 rounded-3xl hover:bg-gray-900"
                        disabled={addingEmail}
                      >
                        {addingEmail ? (
                          <div className="flex items-center justify-center px-3 py-[0.15rem]">
                            <ThreeDots
                              visible={true}
                              height="20"
                              width="50"
                              color="#ffffff"
                              radius="9"
                              ariaLabel="three-dots-loading"
                              wrapperStyle={{}}
                              wrapperClass=""
                            />
                          </div>
                        ) : (
                          <>Notify Me</>
                        )}
                      </button>
                    </div>
                    <div className="text-blue-shade-100 text-xs italic mt-2 ps-3">
                      You can also add your email address later from your
                      profile. Cancel or submit email to continue booking.
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-center px-8 py-4 ">
                {/* <button className="text-gray-600" onClick={onClose}>
                Cancel
              </button> */}
                <button
                  className="bg-blue-shade-200 text-white px-8 py-3 font-semibold rounded-full"
                  onClick={checkBeforeApiCall}
                  disabled={confirmSave}
                >
                  {confirmSave ? (
                    <div className="flex items-center">
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
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {modalOpen && (
        <BookingSuccessModal isOpen={modalOpen} onClose={handleModalClose} />
      )}

      {/* {showGetMailModal && (
        <AddEmailModal
          isOpen={showGetMailModal}
          onClose={handleGetMailModalClose}
          onEmailChange={handleEmailChange}
          onSubmit={handleSubmit}
          mailId={mailId}
          isValidEmail={isValidEmail}
        />
      )} */}
    </>
  );
}

export default BookSession;
