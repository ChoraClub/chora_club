"use client";
import { Button, ButtonGroup, TimeInput } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import EditSessionDetails from "./EditSessionDetails";
import SessionPreview from "./SessionPreview";
import { Time } from "@internationalized/date";
import { ThreeDots } from "react-loader-spinner";
import { useAccount } from "wagmi";
import { useRouter } from "next-nprogress-bar";
import UpdateSessionDetailsSkeletonLoader from "../SkeletonLoader/UpdateSessionDetailsSkeletonLoader";
import not_found from "@/assets/images/daos/404.png";
import Image from "next/image";
import PageNotFound from "../PageNotFound/PageNotFound";

function UpdateSessionDetails({ roomId }: { roomId: string }) {
  // localStorage.removeItem("isMeetingRecorded");
  try {
    const storedStatus = localStorage.getItem("meetingData");
    console.log("storedStatus: ", storedStatus);
    if (storedStatus !== null) {
      localStorage.removeItem("meetingData");
    }
  } catch (e) {
    console.log(e);
  }

  const [sessionDetails, setSessionDetails] = useState({
    title: "",
    description: "",
    image: "",
  });

  const [data, setData] = useState<any>();
  const [collection, setCollection] = useState<any>();
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const { address } = useAccount();
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    console.log("room id: ", roomId);
  }, []);

  useEffect(() => {
    console.log("roomId: ", roomId);
    async function fetchData() {
      try {
        const requestOptions: any = {
          method: "GET",
          redirect: "follow",
        };
        const response = await fetch(
          `/api/get-watch-data/${roomId}`,
          requestOptions
        );
        // if (!response.ok) {
        //   throw new Error("Network response was not ok");
        // }
        const result = await response.json();
        console.log("result::::", result);
        setData(result.data[0]);
        setCollection(result.collection);
        console.log(result.data[0].video_uri.video_uri);
        setShowPopup(true);
        setDataLoading(false);
      } catch (error) {
        console.error(error);
        setDataLoading(false);
      }
    }

    fetchData();
  }, [roomId]);

  const handleSessionDetailsChange = (field: string, value: any) => {
    setSessionDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));
  };

  useEffect(() => {
    if (data) {
      setSessionDetails({
        title: data.title,
        description: data.description,
        image: data.thumbnail_image,
      });
    }
  }, [data]);

  const handleUpdate = async () => {
    console.log("handle update");
    try {
      if (address?.toLowerCase() === data.host_address.toLowerCase()) {
        setLoading(true);
        console.log("handle update");
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
          meetingId: roomId,
          host_address: data.host_address,
          title: sessionDetails.title,
          description: sessionDetails.description,
          thumbnail_image: sessionDetails.image,
        });

        const requestOptions: any = {
          method: "PUT",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };
        const response = await fetch(
          `/api/update-recorded-session`,
          requestOptions
        );
        if (response) {
          const responseData = await response.json();
          console.log("responseData: ", responseData);
          setLoading(false);
          router.push(`/profile/${address}?active=sessions&session=hosted`);
        } else {
          setLoading(false);
          // setData(null);
        }
      }
    } catch (e) {}
  };

  return (
    <div className="font-poppins">
      {!dataLoading ? (
        address?.toLowerCase() === data.host_address.toLowerCase() ? (
          <div className="py-5 px-16 ">
            {showPopup && (
              <div className="w-1/2 mx-auto transition-all duration-300 ease-in-out bg-blue-shade-100 text-white px-4 py-2 rounded-full shadow-lg mb-4">
                <div className="flex items-center justify-between">
                  <span>Thank you for taking the session on CC</span>
                  <button className="ml-4" onClick={() => setShowPopup(false)}>
                    ✕
                  </button>
                </div>
              </div>
            )}
            <div
              className={`text-2xl transition-all duration-300 ease-in-out ${
                showPopup ? "mt-4" : "mt-0"
              }`}
            >
              Please add a title and description for your session so that other
              users can easily understand what it&apos;s about before watching.
              You can edit this information later if needed.
            </div>
            <div className="flex flex-col justify-end gap-5 py-4">
              <div className="flex justify-end">
                <ButtonGroup>
                  <Button
                    onClick={() => setViewMode("edit")}
                    className={
                      viewMode === "edit"
                        ? "bg-blue-shade-200 text-white"
                        : "bg-white border border-blue-shade-200 text-blue-shade-200"
                    }
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => setViewMode("preview")}
                    className={
                      viewMode === "preview"
                        ? "bg-blue-shade-200 text-white"
                        : "bg-white border border-blue-shade-200 text-blue-shade-200"
                    }
                  >
                    Preview
                  </Button>
                </ButtonGroup>
              </div>
            </div>
            <div>
              {viewMode === "edit" ? (
                <>
                  <EditSessionDetails
                    data={data}
                    sessionDetails={sessionDetails}
                    onSessionDetailsChange={handleSessionDetailsChange}
                  />
                  <div className="flex gap-4">
                    <Button
                      className="bg-blue-shade-200 text-white"
                      onClick={() => setViewMode("preview")}
                    >
                      Next
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col w-[60%] mx-auto">
                  <SessionPreview
                    data={data}
                    collection={collection}
                    sessionDetails={sessionDetails}
                  />
                  <div className="flex justify-end gap-4">
                    <Button
                      className="bg-blue-shade-200 text-white"
                      onClick={() => handleUpdate()}
                    >
                      {loading ? (
                        <ThreeDots
                          visible={true}
                          height="40"
                          width="40"
                          color="#FFFFFF"
                          ariaLabel="oval-loading"
                        />
                      ) : (
                        "Update"
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <PageNotFound />
        )
      ) : (
        <UpdateSessionDetailsSkeletonLoader />
      )}
    </div>
  );
}

export default UpdateSessionDetails;
