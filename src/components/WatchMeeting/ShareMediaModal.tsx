import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import whatsapp from "@/assets/images/SocialMedia/Ellipse 216.svg";
import faceBook from "@/assets/images/SocialMedia/Ellipse 217.svg";
import appX from "@/assets/images/SocialMedia/Ellipse 218.svg";
import Image from "next/image";
import { IoCopy } from "react-icons/io5";
import { TbMailFilled } from "react-icons/tb";
import "./WatchSession.module.css";
import toast, { Toaster } from "react-hot-toast";
import { FaFacebook } from "react-icons/fa";
import { FaXTwitter, FaWhatsapp } from "react-icons/fa6";
import { RiTwitterXLine } from "react-icons/ri";

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

  const [link, setLink] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    setLink(window.location.href);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const scrollPosition =
        window.pageYOffset || document.documentElement.scrollTop;

      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollPosition}px`;

      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.overflow = "";
        window.scrollTo(0, scrollPosition);
      };
    }
  }, [isOpen]);

  const shareOnWhatsapp = () =>{
    toast("Coming soon🚀")
  }
  const shareOnFacebook = () =>{
    toast("Coming soon🚀")
  }
  const shareOnMail = () =>{
    toast("Coming soon🚀")
  }

  const shareOnTwitter = () => {
    const url = encodeURIComponent(link);
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

          <p className="flex items-center justify-center font-medium text-[28px]">
            Share
          </p>
          <div className="flex gap-4 justify-center items-center my-5">
            <div className="bg-green-shade-200 rounded-full size-[72px]  flex justify-center items-center cursor-pointer" onClick={shareOnWhatsapp}>
              <FaWhatsapp className="text-white bg-green-shade-200 size-10 " />
            </div>
            <div onClick={shareOnFacebook}>
              <FaFacebook className="text-blue-shade-100 bg-white size-[72px] cursor-pointer" />
            </div>
            <div
              className="bg-black rounded-full size-[72px]  flex justify-center items-center cursor-pointer"
              onClick={shareOnTwitter}
            >
              <RiTwitterXLine className="text-white bg-black size-10 " />
            </div>
            <div className="bg-black-shade-900 rounded-full size-[72px] p-3 flex justify-center items-center cursor-pointer" onClick={shareOnMail}>
              <TbMailFilled className="text-white size-8" />
            </div>
          </div>
          <div
            className={`bg-black-shade-800 rounded-lg py-2.5 px-3 gap-28 flex justify-between items-center`}
          >
            <p className="text-sm font-light ">{link}</p>
            <IoCopy
              className={`cursor-pointer ${
                copySuccess ? "text-blue-shade-100" : ""
              }`}
              onClick={handleCopy}
            />
          </div>
        </div>
      </div>
      <Toaster
        toastOptions={{
          style: {
            fontSize: "14px",
            backgroundColor: "#3E3D3D",
            color: "#fff",
            boxShadow: "none",
            borderRadius: "50px",
            padding: "3px 5px",
          },
        }}
      />
    </>
  );
}

export default ReportOptionModal;
