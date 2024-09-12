export interface AttendeeInterface {
  attendee_address: string;
  attendee_uid: string;
  onchain_attendee_uid: string;
  attendee_joined_status?: "Joined" | "Not Joined" | "Pending" | null;
}

export interface DynamicAttendeeInterface extends AttendeeInterface {
  [key: string]: any;
}

export interface SessionInterface {
  _id?: {
    $oid?: string;
  };
  host_address: string;
  host_joined_status?: "Joined" | "Not Joined" | "Pending" | null;
  attendees: Array<DynamicAttendeeInterface>;
  slot_time: string;
  meetingId: string;
  meeting_status:
    | "Upcoming"
    | "Ongoing"
    | "Recorded"
    | "Cancelled"
    | "Finished"
    | "Denied";
  booking_status: "Pending" | "Approved" | "Rejected";
  dao_name: string;
  title: string;
  description: string;
  session_type: "session" | "instant-meet";
  video_uri?: string;
  uid_host: string;
  onchain_host_uid: string;
  thumbnail_image?: string;
  deployedContractAddress?: string;
}

export interface DynamicSessionInterface extends SessionInterface {
  [key: string]: any;
}
