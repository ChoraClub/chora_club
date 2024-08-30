"use client"
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useAccount } from 'wagmi';

export const useSidebar = () => {
    const [storedDao, setStoredDao] = useState<string[]>([]);
  const [badgeVisiblity, setBadgeVisibility] = useState<boolean[]>(
    new Array(storedDao.length).fill(true)
  );
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [hasSeenTour, setHasSeenTour] = useState(true);

  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { address, isConnected } = useAccount();

  useEffect(() => {
    const intervalId = setInterval(() => {
      const localJsonData = JSON.parse(
        localStorage.getItem("visitedDao") || "{}"
      );

      const localStorageArr: string[] = Object.values(localJsonData);
      // console.log("Values: ", localStorageArr);

      setStoredDao(localStorageArr);
    }, 100);
    setIsPageLoading(false);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const tourSeen = JSON.parse(localStorage.getItem('tourSeen') || 'false');
    setHasSeenTour(tourSeen);
    if (!tourSeen) {
      setIsTourOpen(true);
    }
  }, []);

    const handleBadgeClick = (name: string) => {
    const localData = JSON.parse(localStorage.getItem("visitedDao") || "{}");

    delete localData[name];
    localStorage.setItem("visitedDao", JSON.stringify(localData));

    setStoredDao((prevState) => prevState.filter((item) => item[0] !== name));
    setBadgeVisibility(new Array(storedDao.length).fill(false));

    window.location.href = '/';
  };

  const handleMouseOver = (index: number) => {
    const updatedVisibility = [...badgeVisiblity];
    updatedVisibility[index] = true;
    setBadgeVisibility(updatedVisibility);
  };

  const handleMouseOut = (index: number) => {
    const updatedVisibility = [...badgeVisiblity];
    updatedVisibility[index] = false;
    setBadgeVisibility(updatedVisibility);
  };

  const closeTour = () => {
    setIsTourOpen(false);
    setHasSeenTour(true);
    localStorage.setItem('tourSeen', JSON.stringify(true));
  };

  return {
    storedDao,
    badgeVisiblity,
    isPageLoading,
    isTourOpen,
    hasSeenTour,
    session,
    status,
    address,
    isConnected,
    handleBadgeClick,
    handleMouseOver,
    handleMouseOut,
    closeTour,
  };
};