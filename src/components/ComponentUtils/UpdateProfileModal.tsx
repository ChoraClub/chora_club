import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
} from "@nextui-org/react";
import Image from "next/image";
import React from "react";
import { BsDiscord } from "react-icons/bs";
import { CgAttachment } from "react-icons/cg";
import { FaUserEdit } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { SiDiscourse } from "react-icons/si";
import { TbBrandGithubFilled, TbMailFilled } from "react-icons/tb";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalData: {
    displayName: string;
    emailId: string;
    twitter: string;
    discourse: string;
    discord: string;
    github: string;
    displayImage: string;
  };
  handleInputChange: (field: string, value: string) => void;
  uploadImage: (files: FileList | null) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  isLoading: boolean;
  handleSave: () => void;
  handleToggle: () => void;
  isToggled: boolean;
}

function UpdateProfileModal({
  isOpen,
  onClose,
  modalData,
  handleInputChange,
  uploadImage,
  fileInputRef,
  isLoading,
  handleSave,
  handleToggle,
  isToggled,
}: ProfileModalProps) {
  return (
    <div>
      <Modal
        isOpen={isOpen}
        // onOpenChange={onOpenChange}
        className="font-poppins rounded-3xl "
        size="2xl"
        // style={{ '--modal-size': '672px' }}
        hideCloseButton>
        <ModalContent>
          <>
            <ModalHeader className="flex justify-between text-2xl font-semibold items-center bg-blue-shade-100 text-white px-8 py-6 ">
              Update your Profile
              <button
                onClick={onClose}
                className="text-blue-shade-100 bg-white w-5 h-5  rounded-full flex items-center justify-center font-semibold text-xl">
                <IoClose className="font-bold size-4" />
              </button>
            </ModalHeader>
            <ModalBody className="px-10 pb-4 pt-6">
              <div className="mb-4">
                <div className="text-sm font-semibold mb-2">
                  Upload Profile Image:
                </div>
                <div className="flex items-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-md flex items-center justify-center mr-4">
                    {modalData.displayImage ? (
                      <Image
                        src={`https://gateway.lighthouse.storage/ipfs/${modalData.displayImage}`}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-md"
                        width={100}
                        height={100}
                      />
                    ) : (
                      <div className="text-gray-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12"
                          viewBox="0 0 20 20"
                          fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      Please upload square image, size less than 100KB
                    </p>
                    <div className="flex items-center">
                      <label className="bg-white  text-blue-shade-100 font-medium text-sm py-3 px-4 rounded-full border cursor-pointer border-blue-shade-100 cursor-point flex gap-2 items-center">
                        <CgAttachment />
                        <span>Choose File</span>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={(e) => uploadImage(e.target.files)}
                          className="hidden"
                        />
                      </label>
                      <span className="ml-3 text-sm text-gray-600">
                        {fileInputRef.current?.files?.[0]?.name ||
                          "No File Chosen"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-6 ">
                <div className="flex flex-col basis-1/2 mt-1.5">
                  <div className="font-semibold text-sm flex px-3 items-center gap-1.5">
                    <FaUserEdit /> Display name:
                  </div>
                  <input
                    type="text"
                    value={modalData.displayName}
                    placeholder="Enter Name"
                    className="border border-[#f2eeee] mt-1 bg-white rounded-lg px-3 py-[10px] text-sm text-[#2e2e2e] font-normal"
                    onChange={(e) =>
                      handleInputChange("displayName", e.target.value)
                    }
                  />
                </div>
                <div className="flex flex-col basis-1/2 mt-1.5 ">
                  <div className="text-sm font-semibold flex px-3 items-center gap-1.5">
                    <TbMailFilled />
                    Email:
                    <Tooltip
                      content={
                        isToggled
                          ? "Your email is now visible to everyone!"
                          : "Your email is private and only visible to you."
                      }
                      placement="right"
                      showArrow>
                      <label className="cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isToggled}
                          onChange={handleToggle}
                          disabled={isLoading}
                          value=""
                          className="sr-only peer"
                        />
                        <div
                          className={`relative w-9 h-5 ${
                            isToggled ? "bg-green-500" : "bg-red-500"
                          } peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600`}></div>
                      </label>
                    </Tooltip>
                  </div>
                  <input
                    type="email"
                    value={modalData.emailId}
                    placeholder="xxx@gmail.com"
                    className="border border-[#f2eeee] mt-1 bg-white rounded-lg px-3 py-[10px] text-sm text-[#2e2e2e] font-normal"
                    onChange={(e) =>
                      handleInputChange("emailId", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="flex gap-6 ">
                <div className="flex flex-col basis-1/2 mt-1.5">
                  <div className="text-sm font-semibold flex px-3 items-center gap-1.5">
                    <FaXTwitter />
                    (Formerly Twitter):
                  </div>
                  <input
                    type="url"
                    value={modalData.twitter}
                    placeholder="Enter Twitter Name"
                    className="border border-[#f2eeee] mt-1 bg-white rounded-lg px-3 py-[10px] text-sm text-[#2e2e2e] font-normal "
                    onChange={(e) =>
                      handleInputChange("twitter", e.target.value)
                    }
                  />
                </div>
                <div className="flex flex-col basis-1/2 mt-1.5">
                  <div className="text-sm font-semibold flex px-3 items-center gap-1.5">
                    <SiDiscourse />
                    Discourse:
                  </div>
                  <input
                    type="url"
                    value={modalData.discourse}
                    placeholder="Enter Discourse Name"
                    className="border border-[#f2eeee] mt-1 bg-white rounded-lg px-3 py-[10px] text-sm text-[#2e2e2e] font-normal "
                    onChange={(e) =>
                      handleInputChange("discourse", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="flex gap-6 ">
                <div className="flex flex-col basis-1/2 mt-1.5">
                  <div className="text-sm font-semibold flex px-3 items-center gap-1.5">
                    <BsDiscord />
                    Discord:
                  </div>
                  <input
                    type="url"
                    value={modalData.discord}
                    placeholder="Enter Discord Name"
                    className="border border-[#f2eeee] mt-1 bg-white rounded-lg px-3 py-[10px] text-sm text-[#2e2e2e] font-normal "
                    onChange={(e) =>
                      handleInputChange("discord", e.target.value)
                    }
                  />
                </div>
                <div className="flex flex-col basis-1/2 mt-1.5">
                  <div className="text-sm font-semibold flex px-3 items-center gap-1.5">
                    <TbBrandGithubFilled />
                    Github:
                  </div>
                  <input
                    type="url"
                    value={modalData.github}
                    placeholder="Enter Github Name"
                    className="border border-[#f2eeee] mt-1 bg-white rounded-lg px-3 py-[10px] text-sm text-[#2e2e2e] font-normal "
                    onChange={(e) =>
                      handleInputChange("github", e.target.value)
                    }
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="flex justify-center items-center">
              {/* <Button color="default" onPress={onClose}>
                                Close
                              </Button> */}
              <Button
                className="bg-blue-shade-100 rounded-full text-sm font-semibold text-white px-10 mt-3 mb-7 "
                onClick={() => handleSave()}>
                {isLoading ? "Saving" : "Save"}
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default UpdateProfileModal;
