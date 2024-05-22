import React, { useState, useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import Confetti from "react-confetti";
import { BsClipboardX, BsCopy, BsTwitterX } from "react-icons/bs";
import copy from "copy-to-clipboard";
import toast, { Toaster } from "react-hot-toast";
import { url } from "inspector";
import { FaCircleInfo } from "react-icons/fa6";
import { Tooltip } from "@nextui-org/react";

function SchedulingSuccessModal({
  data,
  isOpen,
  onClose,
}: {
  data: any;
  isOpen: boolean;
  onClose: () => void;
}) {
  // const { width, height } = useWindowSize();
  const [isToolTip, setIsToolTip] = useState(false);
  const shareOnTwitter = () => {
    const userAddress = data.userAddress;
    const dao_name = data.dao_name;
    const url = encodeURIComponent(
      `https://app.chora.club/${dao_name}/${userAddress}?active=delegatesSession&session=book`
    );
    const text = encodeURIComponent(
      `Hello Web3 Enthusiasts!🎉\nI've opened up some time slots for sessions on @ChoraClub!📅\nDon't miss out – book your session now to learn more about Web3 ecosystem! 📝\n👉 ${decodeURIComponent(
        url
      )}\n\n#choraclub #sessionbooking`
    );

    // Twitter share URL
    const twitterUrl = `https://twitter.com/intent/tweet?text=${text}`;

    // Open Twitter share dialog
    window.open(twitterUrl, "_blank");
  };

  const toggleModal = () => {
    onClose();
  };
  const CopyUrl = () => {
    const userAddress = data.userAddress;
    const dao_name = data.dao_name;
    const url = `https://app.chora.club/${dao_name}/${userAddress}?active=delegatesSession&session=book`;
    copy(url);
    setIsToolTip(true);
    setTimeout(() => {
      setIsToolTip(false);
    }, 2000); // Hide tooltip after 2 seconds
  };

  useEffect(() => {
    // Lock scrolling when the modal is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 backdrop-blur-md"
              onClick={toggleModal}></div>
            <div className="z-50 bg-white rounded-3xl max-w-5xl border-2 overflow-hidden">
              <Confetti recycle={false} />
              <div className="flex justify-between items-center px-8 py-4 border-b">
                <h2 className="text-2xl font-bold text-gray-900">
                  Congratulations! 🎉
                </h2>
                <button
                  className="text-gray-500 hover:text-gray-800"
                  onClick={toggleModal}>
                  <RxCross2 size={20} />
                </button>
              </div>
              <div className="p-8 text-gray-900">
                <p className="mb-4">
                  {/* Available session times have been scheduled. */}
                  One available session created to connect with you.
                </p>
                <p className="mb-8">
                  {/* Share on Twitter for users to book their sessions. */}
                  Thank you for your time to spread the word.
                </p>
                <div className="flex justify-between">
                  <Tooltip
                    showArrow
                    content={<div className="font-poppins">Copied</div>}
                    placement="bottom"
                    className="rounded-md bg-opacity-90 bg-black text-white"
                    closeDelay={1}
                    isOpen={isToolTip} // Set isOpen based on the isToolTip state
                  >
                    <span className="px-2 justify-end">
                      <button
                        className="bg-blue-shade-200 text-white rounded-full px-4 py-2 flex items-center space-x-1"
                        onClick={CopyUrl}>
                        Copy Url
                        <BsCopy className="ml-2" />
                      </button>
                    </span>
                  </Tooltip>    

                  <button
                    className="bg-black text-white rounded-full px-4 py-2 flex items-center space-x-1"
                    onClick={shareOnTwitter}>
                    Share on Twitter
                    <BsTwitterX className="ml-2" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default SchedulingSuccessModal;
