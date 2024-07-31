export interface FeedbackDetail {
  userResponse: string;
  timestamp: string;
  dao: string;
  meetingId: string;
}

export interface FeedbackType {
  platformExperience?: FeedbackDetail[];
  platformRecommendation?: FeedbackDetail[];
}

export interface StoreFeedbackInterface {
  address: string;
  asSessionHost?: {
    hasResponded: boolean;
    feedbackType: FeedbackType;
  };
  asSessionAttendee?: {
    hasResponded: boolean;
    feedbackType: FeedbackType;
  };
}
