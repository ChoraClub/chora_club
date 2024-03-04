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
import { FaPencil } from "react-icons/fa6"; // Importing the pencil icon

import { MdDeleteForever } from "react-icons/md";
import { FaSpinner } from "react-icons/fa"; // Importing the spinner icon
import { Oval } from "react-loader-spinner";
interface SessionDetail {
  img: any;
  title: string;
  dao: string;
  host: string;
  desc: string;
  started: string;
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

  useEffect(() => {
    fetch(`/api/update-office-hours/${address}`)
      .then((response) => response.json()) // Parse response JSON
      .then((data: any[]) => {
        const mappedData: SessionDetail[] = data.map((item) => ({
          img: text1, // Static image
          title: item.title,
          dao: item.chain_name,
          started: item.office_hours_slot,
          host: item.address, // Host is the address from the API
          desc: item.description, // Description from the API
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
    // Convert officeHoursSlot to UTC before submitting
    const selectedDate = new Date(formData.officeHoursSlot);
    const utcFormattedDate = selectedDate.toISOString();

    // Create updated form data with UTC formatted date
    const updatedFormData = { ...formData, officeHoursSlot: utcFormattedDate };

    // Toggle loading state
    setLoading(true);

    // Call the updateOfficeHours function with the updated form data
    updateOfficeHours(updatedFormData)
      .then(() => {
        // Update frontend data
        fetch(`/api/update-office-hours/${address}`)
          .then((response) => response.json())
          .then((data: any[]) => {
            const mappedData: SessionDetail[] = data.map((item) => ({
              img: text1,
              title: item.title,
              dao: item.chain_name,
              started: item.office_hours_slot,
              host: item.address,
              desc: item.description,
            }));
            setSessionDetails(mappedData);
          })
          .catch((error) =>
            console.error("Error fetching updated data:", error)
          )
          .finally(() => {
            // Toggle loading state
            setLoading(false);
          });
      })
      .catch((error) => console.error("Error updating data:", error));

    // Close the modal
    onOpenChange();
  };

  const updateOfficeHours = (data: any) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

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
    return fetch(`/api/edit-office-hours/${address}`, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  };

  const handleDelete = (index: number) => {
    const session = sessionDetails[index];
    const requestOptions = {
      method: "DELETE",
    };
    fetch(`/api/edit-office-hours/${address}`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        const updatedSessions = [...sessionDetails];
        updatedSessions.splice(index, 1);
        setSessionDetails(updatedSessions);
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <div className="space-y-6">
        {pageLoading ? (
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
        ) : sessionDetails.length > 0 ? (
          sessionDetails.map((data, index) => (
            <div
              key={index}
              className="flex p-5 rounded-[2rem]"
              style={{
                boxShadow: "0px 4px 26.7px 0px rgba(0, 0, 0, 0.10)",
              }}
            >
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
              <Tooltip content="Edit social links" placement="right" showArrow>
                <span
                  className="border-[0.5px] border-[#8E8E8E] rounded-full h-fit p-1 cursor-pointer"
                  style={{
                    backgroundColor: "rgba(217, 217, 217, 0.42)",
                  }}
                  onClick={onOpen}
                >
                  <FaPencil color="#3e3d3d" size={12} />
                </span>
              </Tooltip>

              <Tooltip content="Edit social links" placement="right" showArrow>
                <span
                  className="border-[0.5px] border-[#8E8E8E] rounded-full h-fit p-1 cursor-pointer"
                  style={{
                    backgroundColor: "rgba(217, 217, 217, 0.42)",
                  }}
                  onClick={() => handleDelete(index)}
                >
                  <MdDeleteForever color="#3e3d3d" size={12} />
                </span>
              </Tooltip>
              <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                className="font-poppins"
              >
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalHeader className="flex flex-col gap-1">
                        Edit Socials
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
                        <input
                          type="datetime-local"
                          value={formData.officeHoursSlot}
                          className="outline-none bg-[#D9D9D945] rounded-md px-2 py-1 text-sm"
                          onChange={(e) =>
                            handleInputChange("officeHoursSlot", e.target.value)
                          }
                        />
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
