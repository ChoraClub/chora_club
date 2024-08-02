import React from "react";
import VideoJs from "../ComponentUtils/VideoJs";
import videojs from "video.js";

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
  thumbnail_image: string;
}

function WatchSessionVideo({
  data,
  collection,
  autoplay,
  sessionDetails,
}: {
  data: Meeting;
  collection: string;
  autoplay: boolean;
  sessionDetails: { title: string; description: string; image: string };
}) {
  const playerRef = React.useRef(null);

  const videoJsOptions = {
    autoplay: autoplay,
    controls: true,
    responsive: true,
    fluid: true,
    controlBar: {
      skipButtons: {
        backward: 10,
        forward: 10,
      },
    },
    poster: sessionDetails.image
      ? `https://gateway.lighthouse.storage/ipfs/${sessionDetails.image}`
      : `https://gateway.lighthouse.storage/ipfs/${data.thumbnail_image}`,
    sources: [
      {
        src: data.video_uri,
        type: "video/mp4",
      },
    ],
    playbackRates: [0.5, 1, 1.5, 2],
  };

  const handlePlayerReady = (player: any) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("player will dispose");
    });
  };
  return (
    <div>
      <div className="rounded-3xl">
        <VideoJs options={videoJsOptions} onReady={handlePlayerReady} />
      </div>
    </div>
  );
}

export default WatchSessionVideo;
