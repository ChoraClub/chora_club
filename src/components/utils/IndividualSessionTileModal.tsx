import React, { useRef, useEffect } from "react";

interface IndividualTileModalProps {
  title: string;
  description: string;
  dao: string;
  videoUrl: string;
  date: string;
  host: string;
  attendee: string;
  host_attestation: string;
  attendee_attestation: string;
  onClose: () => void;
}

function IndividualSessionTileModal({
  title,
  description,
  videoUrl,
  date,
  host,
  attendee,
  dao,
  host_attestation,
  attendee_attestation,
  onClose,
}: IndividualTileModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div
          ref={modalRef}
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full"
          style={{
            maxWidth: "calc(80% + 50px)",
            maxHeight: "calc(80% + 50px)",
          }}
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="sm:w-3/5 mx-auto flex items-center justify-center bg-blue-100 rounded-lg">
                <video
                  controls
                  className="h-full w-full"
                  src={videoUrl}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="sm:w-2/5 mt-3 sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">{description}</p>
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
                    <td className="font-semibold pr-4">DAO Name:</td>
                    <td>{dao}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold pr-4">Host:</td>
                    <td>
                      {host}{" "}
                      <a
                        href={
                          dao === "optimism" || "Optimism"
                            ? `https://optimism.easscan.org/attestation/view/${host_attestation}`
                            : dao === "arbitrum" || "Arbitrum"
                            ? `https://arbitrum.easscan.org/attestation/view/${host_attestation}`
                            : ""
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "blue" }}
                      >
                        View↗️
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold pr-4">Attendee:</td>
                    <td>
                      {attendee}{" "}
                      <a
                        href={
                          dao === "optimism" || "Optimism"
                            ? `https://optimism.easscan.org/attestation/view/${attendee_attestation}`
                            : dao === "arbitrum" || "Arbitrum"
                            ? `https://arbitrum.easscan.org/attestation/view/${attendee_attestation}`
                            : ""
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "blue" }}
                      >
                        View↗️
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold pr-4">Date:</td>
                    <td>{date}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              onClick={onClose}
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-shade-200 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              style={{ borderRadius: "20px" }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IndividualSessionTileModal;
