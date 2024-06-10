import React, { useEffect } from "react";
import { useAccount } from "wagmi";
import Confetti from "react-confetti";
import { RxCross2 } from "react-icons/rx";
import { BsTwitterX } from "react-icons/bs";
import { useRouter } from "next-nprogress-bar";

function BookingSuccessModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { isConnected, address } = useAccount();
  const router = useRouter();

  const shareOnTwitter = () => {
    const url = encodeURIComponent(
      `https://app.chora.club/available-delegates`
    );
    const text = encodeURIComponent(
      `Hello Geeks! 🎉\nJust booked my session on @ChoraClub and can't wait to learn more about the #Web3 ecosystem from the experienced Delegate!🌐\n👉 ${decodeURIComponent(
        url
      )}\n\n#choraclub #session #growth`
    );

    // Twitter share URL
    const twitterUrl = `https://twitter.com/intent/tweet?text=${text}`;

    // Open Twitter share dialog
    window.open(twitterUrl, "_blank");
  };

  // const redirectToAttending = () => {
  //   if (isConnected) {
  //     const url = `http://localhost:3000/profile/${address}?active=sessions&session=attending`;
  //     window.location.href = url;
  //   } else {
  //     // Handle the case where the user is not connected
  //     console.log("User is not connected");
  //   }
  // };

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
          <div className="fixed inset-0 z-50 flex items-center justify-center font-poppins">
            <div
              className="absolute inset-0 backdrop-blur-md"
              onClick={onClose}></div>
            <div className="z-50 bg-white rounded-3xl max-w-5xl border-2 overflow-hidden">
              <Confetti recycle={false} />
              <div className="flex justify-between items-center px-8 py-4 border-b">
                <h2 className="text-2xl font-bold text-gray-900">
                  Congratulations! 🎉
                </h2>
                <button
                  className="text-gray-500 hover:text-gray-800"
                  onClick={onClose}>
                  <RxCross2 size={20} />
                </button>
              </div>
              <div className="p-8 text-gray-900">
                <p className="mb-4">
                  Your session is successfully booked and confirmed! Get ready
                  for an engaging experience.
                </p>
                <p className="mb-8">
                  Share the news of your learnings on Twitter!&nbsp;📣
                </p>

                <div className="flex justify-between">
                  <button
                    className="bg-blue-shade-200 text-white rounded-full px-4 py-2 flex items-center space-x-1"
                    onClick={() =>
                      router.push(
                        `/profile/${address}?active=sessions&session=attending`
                      )
                    }>
                    🚀 Let&apos;s Go!
                  </button>
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

export default BookingSuccessModal;
