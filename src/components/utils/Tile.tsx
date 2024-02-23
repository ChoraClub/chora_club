import React, { useState } from "react";
import Image, { StaticImageData } from "next/image";
import { Oval } from "react-loader-spinner";
import IndividualTileModal from "./IndividualTileModal";
import staticImg from "@/assets/images/daos/texture1.png";

interface Type {
  img: StaticImageData;
  title: string;
  dao: string;
  participant: number;
  host: string;
  started: string;
  desc: string;
  attendee: string;
  video_uri?: string;
  chain_name: string;
  address: string;
  office_hours_slot: string;
  description: string;
}

interface TileProps {
  sessionDetails: any;
  dataLoading: boolean;
  isEvent: string;
  isOfficeHour: boolean;
}

function Tile({
  sessionDetails,
  dataLoading,
  isEvent,
  isOfficeHour,
}: TileProps) {
  const [selectedTileIndex, setSelectedTileIndex] = useState<number | null>(
    null
  );

  const openModal = (index: number) => {
    setSelectedTileIndex(index);
  };

  const closeModal = () => {
    setSelectedTileIndex(null);
  };
  return (
    <div className="space-y-6">
      {sessionDetails.length > 0 ? (
        dataLoading ? (
          <Oval
            visible={true}
            height="50"
            width="50"
            color="#0500FF"
            secondaryColor="#cdccff"
            ariaLabel="oval-loading"
          />
        ) : (
          sessionDetails.map((data:any, index:any) => (
            <div
              key={index}
              className="flex p-5 rounded-[2rem] cursor-pointer"
              style={{ boxShadow: "0px 4px 26.7px 0px rgba(0, 0, 0, 0.10)" }}
              onClick={() => openModal(index)}
            >
              <Image
                src={staticImg}
                alt="image"
                className="w-44 h-44 rounded-3xl border border-[#D9D9D9]"
              />

              <div className="ps-6 pe-12 py-1">
                <div className="font-semibold text-blue-shade-200 text-xl">
                  {data.title}
                </div>

                <div className="flex space-x-4 py-2">
                  <div className="bg-[#1E1E1E] border border-[#1E1E1E] text-white rounded-md text-xs px-5 py-1 font-semibold">
                    {data.chain_name}
                  </div>
                  <div className="border border-[#1E1E1E] rounded-md text-[#1E1E1E] text-xs px-5 py-1 font-medium">
                    {data.participant} Participants
                  </div>
                </div>

                <div className="pt-2 pe-10">
                  <hr />
                </div>

                {isOfficeHour ? (
                  <div className="flex gap-x-16 text-sm py-3">
                    <div className="text-[#3E3D3D]">
                      <span className="font-semibold">Host:</span>{" "}
                      {data.address}
                    </div>
                    <div className="text-[#3E3D3D]">
                      {isEvent === "Upcoming" ? (
                        <span className="font-semibold">Starts at:</span>
                      ) : isEvent === "Ongoing" ? (
                        <span className="font-semibold">Started at:</span>
                      ) : isEvent === "Recorded" ? (
                        <span className="font-semibold">Started at:</span>
                      ) : null}
                      {new Date(data.office_hours_slot).toLocaleDateString()}
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-x-16 text-sm py-3">
                    <div className="text-[#3E3D3D]">
                      <span className="font-semibold">Attendee:</span>{" "}
                      {data.attendee.substring(0, 10)}...
                    </div>
                    <div className="text-[#3E3D3D]">
                      <span className="font-semibold">Host:</span>{" "}
                      {data.host.substring(0, 10)}...
                    </div>
                    <div className="text-[#3E3D3D]">
                      {isEvent === "Upcoming" ? (
                        <span className="font-semibold">Starts at:</span>
                      ) : isEvent === "Ongoing" ? (
                        <span className="font-semibold">Started at:</span>
                      ) : isEvent === "Recorded" ? (
                        <span className="font-semibold">Started at:</span>
                      ) : null}
                      {data.started}
                    </div>
                  </div>
                )}

                <div className="text-[#1E1E1E] text-sm">{data.description}</div>
              </div>
            </div>
          ))
        )
      ) : (
        <div className="flex flex-col justify-center items-center">
          <div className="text-5xl">☹️</div>{" "}
          <div className="pt-4 font-semibold text-lg">
            Oops, no such result available!
          </div>
        </div>
      )}

      {selectedTileIndex !== null && isEvent === "Recorded" ? (
        <IndividualTileModal
          title={sessionDetails[selectedTileIndex].title}
          description={sessionDetails[selectedTileIndex].description}
          videoUrl={sessionDetails[selectedTileIndex].video_uri || ""}
          date={sessionDetails[selectedTileIndex].office_hours_slot}
          host={sessionDetails[selectedTileIndex].address}
          attendee={sessionDetails[selectedTileIndex].attendee}
          dao={sessionDetails[selectedTileIndex].chain_name}
          onClose={closeModal}
        />
      ) : null}
    </div>
  );
}

export default Tile;
