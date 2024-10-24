import React, { useState, useEffect } from "react";
import text1 from "@/assets/images/daos/texture1.png"; // Assuming this is your static image
import Image from "next/image";
import { useAccount } from "wagmi";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { Tooltip } from "@nextui-org/react";
import { FaPencil, FaRegShareFromSquare } from "react-icons/fa6"; // Importing the pencil icon
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaSpinner } from "react-icons/fa"; // Importing the spinner icon
import { Oval } from "react-loader-spinner";
import toast, { Toaster } from "react-hot-toast";
import SessionTileSkeletonLoader from "@/components/SkeletonLoader/SessionTileSkeletonLoader";
import { headers } from "next/headers";
import { fetchApi } from "@/utils/api";

interface SessionDetail {
  img: any;
  title: string;
  dao: string;
  host: string;
  desc: string;
  started: string;

  meetingId: string;
}

function UserUpcomingHours() {
  const [sessionDetails, setSessionDetails] = useState<SessionDetail[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    officeHoursSlot: "",
  });
  const [loading, setLoading] = useState(false); // Loading state
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [pageLoading, setPageLoading] = useState(true);

  const { address } = useAccount();

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [startLoading, setStartLoading] = useState(false);

  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTime(e.target.value);
  };

  useEffect(() => {
    fetchApi(`/update-office-hours/${address}`)
      .then((response) => response.json()) // Parse response JSON
      .then((data: any[]) => {
        const mappedData: SessionDetail[] = data.map((item) => ({
          img: text1, // Static image
          title: item.title,
          dao: item.dao_name,
          started: item.office_hours_slot,
          host: item.host_address, // Host is the address from the API
          desc: item.description,
          meetingId: item.meetingId, // Description from the API
        }));
        setSessionDetails(mappedData); // Set the mapped data to state
        setPageLoading(false);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []); // Empty dependency array ensures the effect runs only once

  const handleInputChange = (field: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    // const selectedDate = new Date(formData.officeHoursSlot);
    // const utcFormattedDate = selectedDate.toISOString();

    const selectedDateTime = `${selectedDate} ${selectedTime}:00`;

    const selectedDateUTC = new Date(selectedDateTime);
    const utcFormattedDate = selectedDateUTC.toISOString();

    console.log("utcFormattedDate", utcFormattedDate);

    // Create updated form data with UTC formatted date
    const updatedFormData = { ...formData, officeHoursSlot: utcFormattedDate };

    // Toggle loading state
    setLoading(true);

    // Call the updateOfficeHours function with the updated form data
    updateOfficeHours(updatedFormData)
      .then(() => {
        // Update frontend data
        fetchApi(`/update-office-hours/${address}`)
          .then((response) => response.json())
          .then((data: any[]) => {
            const mappedData: SessionDetail[] = data.map((item) => ({
              img: text1,
              title: item.title,
              dao: item.dao_name,
              started: item.office_hours_slot,
              host: item.host_address,
              desc: item.description,
              meetingId: item.meetingId,
            }));
            setSessionDetails(mappedData);
            toast.success("Successfully updated your office hour.");
          })
          .catch((error) => {
            console.error("Error fetching updated data:", error);
            toast.error("Error updating your office hour.");
          })
          .finally(() => {
            // Toggle loading state
            setLoading(false);
          });
      })
      .catch((error) => console.error("Error updating data:", error));

    setLoading(false);

    // Close the modal
    onOpenChange();
  };

  const updateOfficeHours = (data: any) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    if (address) {
      myHeaders.append("x-wallet-address", address);
    }

    const raw = JSON.stringify({
      office_hours_slot: data.officeHoursSlot,
      title: data.title,
      description: data.description,
    });

    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
    };
    return fetchApi(`/edit-office-hours/${address}`, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  };

  const handleDelete = (index: number) => {
    const session = sessionDetails[index];
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    if (address) {
      myHeaders.append("x-wallet-address", address);
    }
    const requestOptions = {
      method: "DELETE",
      headers: myHeaders,
    };
    fetchApi(`/edit-office-hours/${address}`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        const updatedSessions = [...sessionDetails];
        updatedSessions.splice(index, 1);
        setSessionDetails(updatedSessions);
      })
      .catch((error) => console.error(error));
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const time = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        options.push(time);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  const currentDate = new Date();
  let formattedDate = currentDate.toLocaleDateString();
  if (
    formattedDate.length !== 10 ||
    !formattedDate.match(/^\d{4}-\d{2}-\d{2}$/)
  ) {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    formattedDate = `${year}-${month}-${day}`;
  }

  // console.log("formattedDate", formattedDate);

  // console.log("currentDate", currentDate);

  return (
    <div>
      <div className="space-y-6">
        {pageLoading ? (
          <SessionTileSkeletonLoader />
        ) : sessionDetails.length > 0 ? (
          sessionDetails.map((data, index) => (
            <div
              key={index}
              className="flex p-5 rounded-[2rem] justify-between"
              style={{
                boxShadow: "0px 4px 26.7px 0px rgba(0, 0, 0, 0.10)",
              }}>
              <div className="flex">
                <Image
                  src={data.img}
                  alt="image"
                  className="w-44 h-44 rounded-3xl border border-[#D9D9D9]"
                />

                <div className="ps-6 pe-12 py-1">
                  <div className="font-semibold text-blue-shade-200 text-lg">
                    {data.title}
                  </div>

                  <div className="flex space-x-4 py-2">
                    <div className="bg-[#1E1E1E] border border-[#1E1E1E] text-white rounded-md text-xs px-5 py-1 font-semibold">
                      {data.dao}
                    </div>
                  </div>

                  <div className="pt-1 pe-10">
                    <hr />
                  </div>

                  <div className="flex gap-x-16 text-sm py-3">
                    <div className="text-[#3E3D3D]">
                      <span className="font-semibold">Host:</span> {data.host}
                    </div>
                    <div className="text-[#3E3D3D]">
                      <span className="font-semibold">Started at:</span>{" "}
                      {new Date(data.started).toLocaleString()}{" "}
                      {/* Format start time */}
                    </div>
                  </div>

                  <div className="text-[#1E1E1E] text-sm">{data.desc}</div>
                </div>
              </div>

              <div className="flex flex-col justify-between">
                <div className="flex gap-2">
                  <Tooltip content="Share" placement="top" showArrow>
                    <span
                      className="border-[0.5px] border-[#8E8E8E] rounded-full h-fit p-1 cursor-pointer"
                      style={{
                        backgroundColor: "rgba(217, 217, 217, 0.42)",
                      }}
                      onClick={() => null}>
                      <FaRegShareFromSquare color="#3e3d3d" size={13} />
                    </span>
                  </Tooltip>
                  <Tooltip content="Edit" placement="top" showArrow>
                    <span
                      className="border-[0.5px] border-[#8E8E8E] rounded-full h-fit p-1 cursor-pointer"
                      style={{
                        backgroundColor: "rgba(217, 217, 217, 0.42)",
                      }}
                      onClick={onOpen}>
                      <FiEdit color="#3e3d3d" size={13} />
                    </span>
                  </Tooltip>

                  <Tooltip content="Delete" placement="top" showArrow>
                    <span
                      className="border-[0.5px] border-[#8E8E8E] rounded-full h-fit p-1 cursor-pointer"
                      style={{
                        backgroundColor: "rgba(217, 217, 217, 0.42)",
                      }}
                      onClick={() => handleDelete(index)}>
                      <RiDeleteBin5Line color="#3e3d3d" size={13} />
                    </span>
                  </Tooltip>
                </div>
                <div className="text-center bg-blue-shade-100 rounded-full font-bold text-white py-2 px-3 text-xs cursor-pointer">
                  <a
                    href={`/meeting/officehours/${data.meetingId}/lobby`}
                    rel="noopener noreferrer"
                    onClick={() => setStartLoading(true)}>
                    {startLoading ? (
                      <>
                        <Oval
                          visible={true}
                          height="20"
                          width="20"
                          color="#fff"
                          secondaryColor="#cdccff"
                          ariaLabel="oval-loading"
                        />
                      </>
                    ) : (
                      "Start"
                    )}
                  </a>
                </div>
              </div>
              <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                className="font-poppins"
                size="3xl">
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalHeader className="flex flex-col gap-1">
                        Edit Office Hours
                      </ModalHeader>
                      <ModalBody>
                        <div className="px-1 font-medium">Title</div>
                        <input
                          type="url"
                          value={formData.title}
                          placeholder="Title"
                          className="outline-none bg-[#D9D9D945] rounded-md px-2 py-1 text-sm"
                          onChange={(e) =>
                            handleInputChange("title", e.target.value)
                          }
                        />

                        <div className="px-1 font-medium">Description</div>
                        <input
                          type="url"
                          value={formData.description}
                          placeholder="Description"
                          className="outline-none bg-[#D9D9D945] rounded-md px-2 py-1 text-sm"
                          onChange={(e) =>
                            handleInputChange("description", e.target.value)
                          }
                        />
                        <div className="px-1 font-medium">
                          Office Hours Slot
                        </div>
                        <div className="flex">
                          <input
                            id="startDate"
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="outline-none bg-[#D9D9D945] rounded-md px-2 py-1 text-sm w-2/5"
                            min={formattedDate}
                          />
                          <select
                            value={selectedTime || "Time"}
                            onChange={handleTimeChange}
                            className="outline-none bg-[#D9D9D945] rounded-md px-2 py-2 text-sm ml-1 w-1/5">
                            <option disabled>Time</option>
                            {timeOptions.map((time) => (
                              <option key={time} value={time}>
                                {time}
                              </option>
                            ))}
                          </select>
                        </div>
                      </ModalBody>
                      <ModalFooter>
                        <Button color="default" onPress={onClose}>
                          Close
                        </Button>
                        <Button color="primary" onPress={handleSubmit}>
                          {loading ? ( // Display spinner when loading
                            <FaSpinner className="animate-spin mr-2" />
                          ) : (
                            "Save"
                          )}
                        </Button>
                      </ModalFooter>
                    </>
                  )}
                </ModalContent>
              </Modal>
            </div>
          ))
        ) : (
          <div className="flex flex-col justify-center items-center">
            <div className="text-5xl">☹️</div>{" "}
            <div className="pt-4 font-semibold text-lg">
              Oops, no such result available!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserUpcomingHours;
