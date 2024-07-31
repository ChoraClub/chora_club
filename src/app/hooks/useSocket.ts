"use client";

import { SOCKET_BASE_URL } from "@/config/constants";
// import { useEffect, useState } from "react";
// import { io, Socket } from "socket.io-client";

// export function useSocket(): Socket | null {
//   const [socket, setSocket] = useState<Socket | null>(null);

//   useEffect(() => {
//     const socketIo = io(`${SOCKET_BASE_URL}`);
//     console.log("socketIo", socketIo);
//     setSocket(socketIo);

//     return () => {
//       socketIo.disconnect();
//     };
//   }, []);

//   return socket;
// }

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export const useSocket = () => {
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    const socketInstance = io(`${SOCKET_BASE_URL}`, {
      transports: ["websocket"],
    });

    socketInstance.on("connect", () => {
      console.log("Connected to WebSocket server in instance");
    });

    socketInstance.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return socket;
};
