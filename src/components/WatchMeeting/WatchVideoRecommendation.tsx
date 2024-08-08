import React, { useState,useEffect } from "react";
import RecordedSessionsSpecificSkeletonLoader from "../SkeletonLoader/RecordedSessionsSpecificSkeletonLoader";
import RecordedSessionsTile from "../ComponentUtils/RecordedSessionsTile";
import Link from "next/link";
interface ProfileInfo {
  _id: string;
  address: string;
  image: string;
  description: string;
  daoName: string;
  isDelegate: boolean;
  displayName: string;
  socialHandles: {
    twitter: string;
    discord: string;
    discourse: string;
    github: string;
  };
  emailId: string;
}
interface Attendee {
  attendee_address: string;
  attendee_uid: string;
  profileInfo: ProfileInfo;
  onchain_attendee_uid?: string;
}
interface HostProfileInfo {
  _id: string;
  address: string;
  image: string;
  description: string;
  daoName: string;
  isDelegate: boolean;
  displayName: string;
  socialHandles: {
    twitter: string;
    discord: string;
    discourse: string;
    github: string;
  };
  emailId: string;
}

interface Meeting {
  _id: string;
  slot_time: string;
  office_hours_slot: string; // Assuming this is a date-time string
  title: string;
  description: string;
  video_uri: string;
  meetingId: string;
  attendees: Attendee[];
  uid_host: string;
  dao_name: string;
  host_address: string;
  joined_status: string | null;
  booking_status: string;
  meeting_status:
    | "active"
    | "inactive"
    | "ongoing"
    | "Recorded"
    | "Upcoming"
    | "Ongoing"; // Assuming meeting status can only be active or inactive
  session_type: string;
  hostProfileInfo: HostProfileInfo;
  onchain_host_uid?: string;
}

const WatchVideoRecommendation = ({data}:any) => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  function getUniqueRandomItems<T>(arr: T[], num: number): T[] {
    // Convert array to a Set to ensure uniqueness
    const uniqueItems = Array.from(new Set(arr));
    
    // Shuffle the unique items
    const shuffled = uniqueItems.sort(() => 0.5 - Math.random());
    
    // Return the first 'num' items
    return shuffled.slice(0, num);
}
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await fetch('/api/get-recorded-meetings');
        const meeting = await response.json();
        console.log(meeting);

        const filteredMeetings = meeting.data.filter((meeting:any)=> meeting.dao_name === data.dao_name);
        const randomMeetings:Meeting[] = getUniqueRandomItems(filteredMeetings, 3);

        setMeetings(randomMeetings);
        setDataLoading(false);
      } catch (error) {
        setDataLoading(false);
        console.error('Failed to fetch meetings', error);
      }
    };

    fetchMeetings();
  }, []);

  
  return (
    <div>
     <div className="flex justify-between mt-5">
          <p className="text-lg font-medium text-blue-shade-100">
            Video Recommendations
          </p>
          
        <Link href={"/sessions?active=recordedSessions"} className="text-[10px] text-blue-shade-100 bg-blue-shade-700 rounded py-1 px-2 border border-blue-shade-100 flex items-center justify-center cursor-pointer">
          View All
        </Link>
        </div>
      {dataLoading ? (
        <RecordedSessionsSpecificSkeletonLoader itemCount={3} gridCols="2xl:grid-cols-3"/>
      ) :  (
        <RecordedSessionsTile meetingData={meetings} gridCols="2xl:grid-cols-3"/>)
      }
    </div>
  );
};

export default WatchVideoRecommendation;
