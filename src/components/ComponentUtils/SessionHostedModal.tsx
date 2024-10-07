import { BASE_URL } from "@/config/constants";
import { useRouter } from "next-nprogress-bar";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { BsTwitterX } from "react-icons/bs";
import { IoClose, IoCopy } from "react-icons/io5";
import Confetti from "react-confetti";

function SessionHostedModal({ data }: any) {
  const router = useRouter();
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const link = `${BASE_URL}watch/${data.meetingId}`;

  const shareOnTwitter = () => {
    const url = encodeURIComponent(link);
    // const text = encodeURIComponent(
    //   `${data.title} ${decodeURIComponent(
    //     url
    //   )} via @ChoraClub\n\n#choraclub #session #growth`
    // );
    const text = encodeURIComponent(
      `Just wrapped up an incredible session in @ChoraClub! 🎉 Thrilled to share my knowledge and help new users dive into the Web3 ecosystem.
Check out the session here:👇\n ${decodeURIComponent(url)}
#Web3 #ChoraClub`
    );

    // Twitter share URL
    const twitterUrl = `https://twitter.com/intent/tweet?text=${text}`;

    // Open Twitter share dialog
    window.open(twitterUrl, "_blank");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      toast("Copied!");
    } catch (err) {
      console.error("Failed to copy link: ", err);
    }
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50 overflow-hidden">
        <div className="absolute inset-0 backdrop-blur-md"></div>

        <div className="px-8 pb-14 pt-20 border z-50 rounded-[30px] bg-white flex flex-col items-center text-center gap-3 relative w-[56%]">
          <Confetti recycle={true} className="size-[100%]" />
          <IoClose
            className="text-white cursor-pointer font-semibold bg-black size-5 rounded-full absolute top-8 right-8"
            onClick={() =>
              router.push(
                `/profile/${data.host_address}?active=sessions&session=hosted`
              )
            }
          />
          <h2 className="text-[40px] font-bold mb-4 text-blue-shade-200">
            Congratulations for taking the Session!
          </h2>
          <p className="mb-1 text-base">
            Your session is now live and can be viewed by everyone on the Chora
            Club Platform.
          </p>
          <p className="mb-8 text-base">
            Share the video URL with your audience to maximize its reach. If
            viewers enjoy your session, they can mint NFTs for it directly on
            the platform.
          </p>
          <div className="flex justify-end font-bold text-sm space-x-4">
            <div>
              <button
                className="bg-white text-blue-shade-200 border border-blue-shade-200 rounded-full flex items-center py-4 justify-center space-x-1 gap-2 w-[178px]"
                onClick={handleCopy}
              >
                <IoCopy
                  className={`cursor-pointer ${
                    copySuccess ? "text-blue-shade-200" : ""
                  }`}
                />
                Copy URL
              </button>
            </div>
            <div>
              <button
                className="bg-blue-shade-200 text-white rounded-full px-5 py-4 flex items-center space-x-1"
                onClick={shareOnTwitter}
              >
                <BsTwitterX className="mr-2" />
                Share on Twitter
              </button>
            </div>
            <div>
              <button
                className="bg-black hover:bg-blue-shade-200 text-white flex items-center justify-center py-4 rounded-full w-[178px]"
                onClick={() =>
                  router.push(
                    `/profile/${data.host_address}?active=sessions&session=hosted`
                  )
                }
              >
                Back to Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SessionHostedModal;
