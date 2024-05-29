import React from "react";
import { IoClose } from "react-icons/io5";
import whatsapp from '@/assets/images/SocialMedia/Ellipse 216.svg'
import faceBook from '@/assets/images/SocialMedia/Ellipse 217.svg'
import appX from '@/assets/images/SocialMedia/Ellipse 218.svg'
import Image from "next/image";
import { IoCopy } from "react-icons/io5";
import { TbMailFilled } from "react-icons/tb";

function ReportOptionModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const toggleModal = () => {
    onClose();
  };

  

  return (
    // <div className="fixed inset-0 z-50 flex items-center justify-center font-poppins">
    //    <div
    //       className="absolute inset-0 backdrop-blur-md"
    //       onClick={toggleModal}
    //     ></div>
    //     <div className="bg-white border-2">
          
    //         <div className="flex justify-center text-black">Share</div>
    //         <div className="bg-black rounded-full size-6 p-px flex justify-center items-center">
    //         <IoClose
    //               className="cursor-pointer w-6 h-6 text-white "
    //               onClick={toggleModal}
    //               />
    //               </div>
          
    //     </div>
    // </div>
    <div className="fixed inset-0 flex items-center justify-center z-50  overflow-hidden">
          <div
            className="absolute inset-0 backdrop-blur-md"
            onClick={toggleModal}
          ></div>
          <div className="p-5 border z-50 rounded-2xl bg-white flex flex-col gap-3 relative">
          <div className="bg-black rounded-full size-5 p-px flex justify-center items-center absolute top-5 right-5">
              <IoClose
                  className="cursor-pointer w-5 h-5 text-white "
                  onClick={toggleModal}
                  />
                   </div>

            
              <p className="flex items-center justify-center font-medium text-[28px]">Share</p>
              <div className="flex gap-4 justify-center items-center my-5">
                <Image src={whatsapp} alt="whatsapp"  width={72} height={72} className="cursor-pointer"/>
                <Image src={faceBook} alt="facebook"  width={72} height={72} className="cursor-pointer"/>
                <Image src={appX} alt="appx"  width={72} height={72} className="cursor-pointer"/>
                <div className="bg-black-shade-900 rounded-full size-[72px] p-3 flex justify-center items-center cursor-pointer">
                  <TbMailFilled className="text-white size-8"/>
                </div>
              </div>
              <div className="bg-black-shade-800 rounded-lg py-2.5 px-3 gap-28 flex justify-between items-center">
                <p className="text-sm font-light ">https://app.chora.club/watch/afx-nhcd-vla</p>
                <IoCopy className="cursor-pointer"/>
              </div>
            
            
          </div>
        </div>
  );
}

export default ReportOptionModal;
