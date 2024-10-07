export interface SocialHandles {
  github?: string;
  twitter?: string;
  discord?: string;
  [key: string]: string | undefined; // Allows for additional social handles if needed
}

export interface Network {
  dao_name: string;
  network: string;
  discourse?: string;
  description?: string;
}

export interface Following {
  follower_address: string;
  isFollowing: boolean;
  isNotification: boolean;
  timestamp?: {
    $date: string;
  };
}

export interface FollowerActivity {
  action: "follow" | "unfollow";
  timestamp: {
    $date: string;
  };
}

export interface Follower {
  address: string;
  isNotification: boolean;
  isFollowing: boolean;
  activity?: FollowerActivity[];
}

export interface FollowingData {
  dao: string;
  following: Following[];
}

export interface FollowerData {
  dao_name: string;
  follower: Follower[];
}

export interface SessionRecord {
  totalHostedMeetings: number;
  offchainCounts: number;
}

export interface MeetingRecords {
  sessionHosted: SessionRecord;
  sessionAttended: SessionRecord;
}

export interface UserProfileInterface {
  _id: {
    $oid: string;
  };
  address: string;
  image: string;
  description?: string | null;
  isDelegate: boolean;
  displayName: string;
  emailId: string;
  socialHandles: SocialHandles;
  networks: Network[];
  followings?: FollowingData[];
  followers?: FollowerData[];
  isEmailVisible: boolean;
  meetingRecords: MeetingRecords;
  createdAt?: string;
  referrer?: string;
  [key: string]: any; // Allows for additional dynamic fields if necessary
}
