import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import img from "@/assets/images/daos/Rectangle 362.png";
import Image from "next/image";

function AttestationModal() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  return (
    <div>
      <button
        className="bg-blue-shade-200 font-bold text-white rounded-full px-8 py-[10px]"
        onClick={onOpen}
      >
        Modal
      </button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className="font-poppins p-0"
        size="5xl"
      >
        <ModalContent>
          {(onClose: any) => (
            <>
              <ModalBody>
                <div className="flex">
                  <Image src={img} alt="image" />
                  <div className="flex flex-col items-center justify-center w-auto">
                    <div>Congratulations</div>
                    <button className="bg-blue-shade-100 rounded-full text-white px-5 py-2 font-medium">
                      Attest Onchain
                    </button>
                    <button className="bg-blue-shade-100 rounded-full text-white px-5 py-2 font-medium">
                      Attest Offchain
                    </button>
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default AttestationModal;
