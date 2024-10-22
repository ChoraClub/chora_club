import React, { useState, useEffect } from "react";
import RecordedSessionsSpecificSkeletonLoader from "../SkeletonLoader/RecordedSessionsSpecificSkeletonLoader";
import RecordedSessionsTile from "../ComponentUtils/RecordedSessionsTile";
import Link from "next/link";
import { debounce } from 'lodash'; 
import {
  DynamicAttendeeInterface,
  SessionInterface,
} from "@/types/MeetingTypes";
import { UserProfileInterface } from "@/types/UserProfileTypes";

interface Attendee extends DynamicAttendeeInterface {
  profileInfo: UserProfileInterface;
}

interface Meeting extends SessionInterface {
  attendees: Attendee[];
  hostProfileInfo: UserProfileInterface;
}

const WatchVideoRecommendation = ({ data }: any) => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [screenSize, setScreenSize] = useState<'xs' | 'lg' | '1.5lg' | '2xl'>('xs');

  function getUniqueRandomItems<T>(arr: T[], num: number): T[] {
    // Convert array to a Set to ensure uniqueness
    const uniqueItems = Array.from(new Set(arr));

    // Shuffle the unique items
    const shuffled = uniqueItems.sort(() => 0.5 - Math.random());

    // Return the first 'num' items
    return shuffled.slice(0, num);
  }

  useEffect(() => {
    const handleResize = debounce(() => {
      if (window.innerWidth >= 1536) {
        setScreenSize('2xl');
      } else if (window.innerWidth >= 1200) {
        setScreenSize('1.5lg');
      } else if (window.innerWidth >= 1024) {
        setScreenSize('lg');
      } else {
        setScreenSize('xs');
      }
    }, 250); // 250ms debounce
  
    handleResize(); // Set initial size
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      handleResize.cancel(); // Cancel any pending debounce on unmount
    };
  }, []);
  
  // useEffect(() => {
  //   const fetchMeetings = async () => {
  //     try {
  //       const response = await fetch("/api/get-recorded-meetings");
  //       const meeting = await response.json();
  //       console.log(meeting);

  //       const filteredMeetings = meeting.data.filter(
  //         (meeting: any) => meeting.dao_name === data.dao_name
  //       );
  //       let numVideos;
  //       switch (screenSize) {
  //         case '2xl':
  //           numVideos = 3;
  //           break;
  //         case '1.5lg':
  //           numVideos = 2;
  //           break;
  //         case 'lg':
  //           numVideos = 3;
  //           break;
  //         default:
  //           numVideos = 4;
  //       }
  //       const randomMeetings: Meeting[] = getUniqueRandomItems(filteredMeetings, numVideos);

  //       setMeetings(randomMeetings);
  //       setDataLoading(false);
  //     } catch (error) {
  //       setDataLoading(false);
  //       console.error("Failed to fetch meetings", error);
  //     }
  //   };

  //   fetchMeetings();
  // }, [screenSize]);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await fetch("/api/get-recorded-meetings");
        const meeting = await response.json();
        console.log(meeting);
  
        const filteredMeetings = meeting.data.filter(
          (meeting: any) => meeting.dao_name === data.dao_name
        );
        let numVideos;
        switch (screenSize) {
          case '2xl':
            numVideos = 3;
            break;
          case '1.5lg':
            numVideos = 2;
            break;
          case 'lg':
            numVideos = 3;
            break;
          default:
            numVideos = 4; // for 'xs' screen size
        }
        const randomMeetings: Meeting[] = getUniqueRandomItems(filteredMeetings, numVideos);
      console.log(numVideos,"num of videos")
        setMeetings(randomMeetings);
        setDataLoading(false);
      } catch (error) {
        setDataLoading(false);
        console.error("Failed to fetch meetings", error);
      }
    };
  
    fetchMeetings();
  }, [screenSize, data.dao_name]); // Add screenSize as a dependency

  return (
    <div>
      <div className="flex justify-between mt-5">
        <p className="text-lg font-medium text-blue-shade-100">
          Video Recommendations
        </p>

        <Link
          href={"/sessions?active=recordedSessions"}
          className="text-[10px] text-blue-shade-100 bg-blue-shade-700 rounded py-1 px-2 border border-blue-shade-100 flex items-center justify-center cursor-pointer"
        >
          View All
        </Link>
      </div>
      {dataLoading ? (
        <RecordedSessionsSpecificSkeletonLoader
          itemCount={meetings.length}
          gridCols="1.5lg:grid-cols-2 2xl:grid-cols-3"
        />
      ) : (
        <RecordedSessionsTile
          meetingData={meetings}
          gridCols="1.5lg:grid-cols-2 2xl:grid-cols-3"
        />
      )}
    </div>
  );
};

export default WatchVideoRecommendation;
