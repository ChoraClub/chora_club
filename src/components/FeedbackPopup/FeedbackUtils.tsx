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
export interface FeedbackRating {
  address: string;
  ratings: number;
  timestamp: string;
}

export interface FeedbackReceived {
  meetingId: string;
  ratings: FeedbackRating[];
}

export interface StoreFeedbackInterface {
  address: string;
  feedbackGiven: {
    asSessionHost?: {
      hasResponded: boolean;
      feedbackType: FeedbackType;
    };
    asSessionAttendee?: {
      hasResponded: boolean;
      feedbackType: FeedbackType;
    };
  };
  feedbackReceived: {
    asSessionHost: FeedbackReceived[];
  };
}
