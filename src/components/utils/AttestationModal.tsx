import React, { useState } from "react";
import img from "@/assets/images/daos/attestation.png";
import Image from "next/image";
import { RxCross2 } from "react-icons/rx";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";

function AttestationModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  // const [modalOpen, setModalOpen] = useState(props);

  const toggleModal = () => {
    onClose();
  };
  console.log("Attestation modal");

  return (
    <div>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-gray-800 opacity-50"
            onClick={toggleModal}
          ></div>
          <div className="z-50 bg-white rounded-3xl max-w-7xl">
            <div className="flex justify-evenly">
              <div>
                <Image
                  src={img}
                  alt="image"
                  height={300}
                  width={300}
                  className="rounded-3xl"
                />
              </div>
              <div className="flex flex-col items-center justify-center relative px-20">
                <button
                  className="text-gray-500 hover:text-gray-800 absolute top-3 right-4"
                  onClick={toggleModal}
                >
                  <RxCross2 size={20} />
                </button>
                <div className="py-4 text-gray-900">
                  <h2 className="text-2xl font-bold text-center">
                    Thanks for joining us!🎉
                  </h2>
                  <div className="font-medium py-2">
                    Your attestation will be on its way shortly. 📜✨
                  </div>
                </div>
                {/* <div className="justify-around space-x-8 py-5">
                  <button className="border-2 border-blue-shade-200 bg-blue-shade-200 rounded-full text-white px-8 py-3 font-bold text-sm">
                    On-chain
                  </button>
                  <button className="border-2 border-blue-shade-200 rounded-full text-blue-shade-200 px-8 py-3 font-bold text-sm">
                    Off-chain
                  </button>
                </div> */}
                <div className="flex items-center text-blue-shade-100">
                  <FaArrowRight size={10} className="" />
                  <Link
                    href={
                      "https://app.deform.cc/form/580f4057-b21e-4052-bf93-6b85e28a6032/?page_number=0"
                    }
                    target="_blank"
                    className="ps-[2px] underline font-semibold text-xs"
                  >
                    Share Your Feedback!
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AttestationModal;
