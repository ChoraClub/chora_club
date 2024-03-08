import React, { useState } from "react";
import img from "@/assets/images/daos/attestation.png";
import Image from "next/image";
import { RxCross2 } from "react-icons/rx";

function AttestationModal() {
  const [modalOpen, setModalOpen] = useState(false);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  return (
    <div>
      <button
        className="bg-blue-shade-200 font-bold text-white rounded-full px-8 py-[10px]"
        onClick={toggleModal}
      >
        Modal
      </button>
      {modalOpen && (
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
                <h2 className="text-2xl font-bold">Claim Attestations! 🎉</h2>
                <div className="justify-around space-x-8 py-5">
                  <button className="border-2 border-blue-shade-200 bg-blue-shade-200 rounded-full text-white px-8 py-3 font-bold text-sm">
                    On-chain
                  </button>
                  <button className="border-2 border-blue-shade-200 rounded-full text-blue-shade-200 px-8 py-3 font-bold text-sm">
                    Off-chain
                  </button>
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
