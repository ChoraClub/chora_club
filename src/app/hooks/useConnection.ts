"use client";
import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useAccount, useAccountEffect } from "wagmi";

export const useConnection = () => {
  const { data: session, status: sessionStatus } = useSession();
  const { address, isConnected } = useAccount();
  const [connection, setConnection] = useState(false);
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const checkConnection = useCallback(() => {
    const isFullyConnected = Boolean(address && session && isConnected);
    setConnection(isFullyConnected);
    setIsSessionLoading(sessionStatus === "loading");
  }, [address, session, isConnected, sessionStatus]);

  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  useEffect(() => {
    // Check if the page has finished loading
    if (document.readyState === "complete") {
      setIsPageLoading(false);
    } else {
      const handleLoad = () => setIsPageLoading(false);
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  useAccountEffect({
    onConnect: checkConnection,
    onDisconnect: () => {
      setConnection(false);
      checkConnection();
    },
  });

  const isLoading = isSessionLoading || isPageLoading;
  const isReady = !isLoading && connection;

  return {
    isConnected: connection,
    isLoading,
    isSessionLoading,
    isPageLoading,
    isReady,
  };
};
