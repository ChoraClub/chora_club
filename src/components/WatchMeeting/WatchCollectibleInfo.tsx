import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { Holder } from "@/types/LeaderBoardTypes";
import { UserProfileInterface } from "@/types/UserProfileTypes";
import {
  DynamicAttendeeInterface,
  SessionInterface,
} from "@/types/MeetingTypes";
interface Attendee extends DynamicAttendeeInterface {
  profileInfo: UserProfileInterface;
}

interface Meeting extends SessionInterface {
  attendees: Attendee[];
  hostProfileInfo: UserProfileInterface;
}

const WatchCollectibleInfo = ({
  leaderBoardData,
  data,
  collection,
}: {
  leaderBoardData: Holder;
  data: Meeting;
  collection: string;
}) => {
  const [showComingSoon, setShowComingSoon] = useState(true);
  return (
    <div className="rounded-3xl border border-black-shade-200 font-poppins ">
      <div className="flex w-full rounded-t-3xl bg-blue-shade-400 py-3 pl-6">
        <p className="font-medium xl:text-base 1.7xl:text-lg text-blue-shade-100">
          Collectibles Info
        </p>
      </div>
      <div className="w-full h-[0.1px] bg-black-shade-200"></div>
      <div className="flex xl:gap-x-20 gap-x-14 1.7xl:text-sm text-xs">
        <div className="ml-6 text-black-shade-100 my-2 font-medium">
          <p className="my-2">First Collect</p>
          <p className="my-2">Most recent Collect</p>
          <p className="my-2">Unique Collectors</p>
          <p className="my-2">Total Collected</p>
        </div>
        <div className="font-normal my-2 text-blue-shade-100">
          <p className="my-2">{leaderBoardData.firstCollector?.timestamp}</p>
          <p className="my-2">{leaderBoardData.latestCollector?.timestamp}</p>
          <p className="my-2">
            {leaderBoardData?.selectedToken?.holders1155?.length &&
            leaderBoardData?.maxSupply ? (
              <>
                {leaderBoardData.selectedToken.holders1155.length} (
                {(
                  (leaderBoardData.selectedToken.holders1155.length /
                    leaderBoardData.maxSupply) *
                  100
                ).toFixed(2)}
                %)
              </>
            ) : null}
          </p>
          <p className="my-2">{leaderBoardData?.maxSupply}</p>
        </div>
      </div>
    </div>
  );
};

export default WatchCollectibleInfo;
