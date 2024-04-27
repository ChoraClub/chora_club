"use client";

import React, { useState, useRef, useEffect } from "react";
import { Oval } from "react-loader-spinner";

interface AttestationObject {
  attendee_address: string;
  attendee_uid: string;
}

function WatchComponentMain({ props }: { props: { id: string } }) {
  
  const modalRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<any>();
  const [collection, setCollection] = useState<any>();

  useEffect(() => {
    async function fetchData() {
      try {
        const requestOptions: any = {
          method: "GET",
          redirect: "follow",
        };
        const response = await fetch(
          `/api/get-watch-data/${props.id}`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setData(result.data[0]);
        setCollection(result.collection);
        console.log(result.data[0].video_uri.video_uri);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, [props.id]);

  function utcToLocal(utcDateString: any) {
    // Create a Date object from the UTC string
    const utcDate = new Date(utcDateString);

    // Get the local date and time components
    const localDate = utcDate.toLocaleDateString();
    const localTime = utcDate.toLocaleTimeString();

    // Combine and return the formatted local date and time
    return `${localDate} ${localTime}`;
  }

  return (
    <>
      {data ? (
        <div
          ref={modalRef}
          className="font-poppins inline-block align-bottom bg-white rounded-lg text-left overflow-hidden  transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full"
          style={{
            maxWidth: "calc(95% + 50px)",
            maxHeight: "calc(80% + 50px)",
          }}
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="sm:w-3/5 mx-auto flex items-center justify-center bg-blue-100 rounded-lg">
                <video controls className="h-full w-full" src={data?.video_uri}>
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="sm:w-2/5 mt-3 sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg font-medium text-gray-900">
                  {data.title}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">{data.description}</p>
                </div>
              </div>
            </div>
            <div className="pt-5">
              <div
                className="text-sm text-gray-700 font-semibold mb-2 mt-2"
                style={{ fontSize: "1.5rem" }}
              >
                Details:
              </div>
              <table className="table-auto w-full">
                <tbody>
                  <tr>
                    <td className="font-semibold pr-4 ">DAO Name:</td>
                    <td className="capitalize">{data.dao_name}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold pr-4">Host:</td>
                    <td>
                      {data.host_address}{" "}
                      {data.uid_host ? (
                        <a
                          href={
                            data.dao_name === "optimism" || "Optimism"
                              ? `https://optimism-sepolia.easscan.org/offchain/attestation/view/${data.uid_host}`
                              : data.dao_name === "arbitrum" || "Arbitrum"
                              ? `https://arbitrum.easscan.org/attestation/view/${data.uid_host}`
                              : ""
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "blue" }}
                        >
                          Offchain↗️
                        </a>
                      ) : (
                        <></>
                      )}
                      {data.onchain_host_uid ? (
                        <a
                          href={
                            data.dao_name === "optimism" || "Optimism"
                              ? `https://optimism-sepolia.easscan.org/offchain/attestation/view/${data.onchain_host_uid}`
                              : data.dao_name === "arbitrum" || "Arbitrum"
                              ? `https://arbitrum.easscan.org/attestation/view/${data.onchain_host_uid}`
                              : ""
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "blue" }}
                        >
                          Onchain↗️
                        </a>
                      ) : (
                        <></>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold pr-4">Attendee:</td>
                    <td>
                      {data.attendees?.map((attendee: any, index: any) => (
                        <li className="list-decimal" key={index}>
                          {attendee.attendee_address}
                          {attendee.attendee_uid ? (
                            <a
                              href={
                                data.dao_name === "optimism" || "Optimism"
                                  ? `https://optimism-sepolia.easscan.org/offchain/attestation/view/${attendee.attendee_uid}`
                                  : data.dao_name === "arbitrum" || "Arbitrum"
                                  ? `https://arbitrum.easscan.org/attestation/view/${attendee.attendee_uid}`
                                  : ""
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: "blue" }}
                              className="px-3"
                            >
                              Offchain↗️
                            </a>
                          ) : (
                            <></>
                          )}
                          {attendee.onchain_attendee_uid ? (
                            <a
                              href={
                                data.dao_name === "optimism" || "Optimism"
                                  ? `https://optimism-sepolia.easscan.org/offchain/attestation/view/${attendee.onchain_attendee_uid}`
                                  : data.dao_name === "arbitrum" || "Arbitrum"
                                  ? `https://arbitrum.easscan.org/attestation/view/${attendee.onchain_attendee_uid}`
                                  : ""
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: "blue" }}
                              className="px-3"
                            >
                              Onchain↗️
                            </a>
                          ) : (
                            <></>
                          )}
                        </li>
                      ))}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold pr-4">Date:</td>
                    <td>
                      {collection === "office_hours"
                        ? utcToLocal(data.office_hours_slot)
                        : utcToLocal(data.slot_time)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center mt-5">
          <Oval
            visible={true}
            height="40"
            width="40"
            color="#0500FF"
            secondaryColor="#cdccff"
            ariaLabel="oval-loading"
          />
        </div>
      )}
    </>
  );
}

export default WatchComponentMain;
