import React, { useState, useEffect } from "react";
import RecordedSessionsSpecificSkeletonLoader from "../SkeletonLoader/RecordedSessionsSpecificSkeletonLoader";
import RecordedSessionsTile from "../ComponentUtils/RecordedSessionsTile";
import Link from "next/link";
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
        const response = await fetch("/api/get-recorded-meetings");
        const meeting = await response.json();
        console.log(meeting);

        const filteredMeetings = meeting.data.filter(
          (meeting: any) => meeting.dao_name === data.dao_name
        );
        const randomMeetings: Meeting[] = getUniqueRandomItems(
          filteredMeetings,
          3
        );

        setMeetings(randomMeetings);
        setDataLoading(false);
      } catch (error) {
        setDataLoading(false);
        console.error("Failed to fetch meetings", error);
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

        <Link
          href={"/sessions?active=recordedSessions"}
          className="text-[10px] text-blue-shade-100 bg-blue-shade-700 rounded py-1 px-2 border border-blue-shade-100 flex items-center justify-center cursor-pointer"
        >
          View All
        </Link>
      </div>
      {dataLoading ? (
        <RecordedSessionsSpecificSkeletonLoader
          itemCount={3}
          gridCols="2xl:grid-cols-3"
        />
      ) : (
        <RecordedSessionsTile
          meetingData={meetings}
          gridCols="2xl:grid-cols-3"
        />
      )}
    </div>
  );
};

export default WatchVideoRecommendation;
