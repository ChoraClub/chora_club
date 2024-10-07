import React, { useState } from "react";
import VideoJs from "../ComponentUtils/VideoJs";
import videojs from "video.js";
import { v4 as uuidv4 } from "uuid";
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

    let totalWatchTime = 0;
    let lastRecordedTime = 0;
    let hasCalledApi = false;
    let isPlaying = false;

    player.on("play", function () {
      isPlaying = true;
      lastRecordedTime = player.currentTime();
    });

    player.on("pause", function () {
      isPlaying = false;
    });

    player.on("timeupdate", function () {
      if (isPlaying) {
        var currentTime = player.currentTime();
        var timeDiff = currentTime - lastRecordedTime;

        // Handle both forward and backward seeking, and ensure we only count actual playback
        if (Math.abs(timeDiff) < 1) {
          totalWatchTime += timeDiff;
        }

        lastRecordedTime = currentTime;

        if (!hasCalledApi && totalWatchTime >= 15) {
          hasCalledApi = true;
          try {
            CountAsView(data.meetingId);
            // console.log("API called at total watch time:", totalWatchTime);
          } catch (error) {
            console.error("Error calling CountAsView:", error);
          }
        }
      }
    });
  };
  async function CountAsView(meetingId: string) {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      let clientToken = localStorage.getItem("clientToken");
      if (!clientToken) {
        clientToken = uuidv4();
        localStorage.setItem("clientToken", clientToken);
      }
      const raw = JSON.stringify({
        meetingId: meetingId,
        clientToken: clientToken,
      });

      const requestOptions: any = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      const response = await fetch("/api/counting-views", requestOptions);
      const data = await response.json();
      // console.log("Response from API", data);
    } catch (error) {
      console.error("Error in views:", error);
    }
  }
  return (
    <div>
      <div className="rounded-3xl">
        <VideoJs options={videoJsOptions} onReady={handlePlayerReady} />
      </div>
    </div>
  );
}

export default WatchSessionVideo;
