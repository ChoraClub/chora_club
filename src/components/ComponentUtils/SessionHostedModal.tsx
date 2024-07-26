import { BASE_URL } from "@/config/constants";
import { useRouter } from "next-nprogress-bar";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { BsTwitterX } from "react-icons/bs";
import { IoCopy } from "react-icons/io5";

function SessionHostedModal({ data }: any) {
  const router = useRouter();
  const [copySuccess, setCopySuccess] = useState(false);

  const link = `${BASE_URL}/watch/${data.meetingId}`;

  const shareOnTwitter = () => {
    const url = encodeURIComponent(link);
    const text = encodeURIComponent(
      `${data.title} ${decodeURIComponent(
        url
      )} via @ChoraClub\n\n#choraclub #session #growth`
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

        <div className="px-8 py-10 border z-50 rounded-2xl bg-white flex flex-col gap-3 relative w-[50%]">
          <h2 className="text-xl font-bold mb-4">
            Congratulations for taking the Session! 🎉
          </h2>
          <p className="mb-4">
            Your session is now live and can be viewed by everyone on the Chora
            Club Platform. 🎉
          </p>
          <p className="mb-4">
            Share the video URL with your audience to maximize its reach. If
            viewers enjoy your session, they can mint NFTs for it directly on
            the platform. 😊
          </p>
          <div className="flex justify-end space-x-2">
            <div>
              {/* <div className="flex justify-center"> */}
              <button
                className="bg-black text-white rounded-full px-4 py-2 flex items-center space-x-1 gap-3"
                onClick={handleCopy}
              >
                Copy URL
                <IoCopy
                  className={`cursor-pointer ${
                    copySuccess ? "text-blue-shade-100" : ""
                  }`}
                />
              </button>
            </div>
            <div>
              {/* <div className="flex justify-center"> */}
              <button
                className="bg-black text-white rounded-full px-4 py-2 flex items-center space-x-1"
                onClick={shareOnTwitter}
              >
                Share on Twitter
                <BsTwitterX className="ml-2" />
              </button>
            </div>
            <div>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-full"
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
