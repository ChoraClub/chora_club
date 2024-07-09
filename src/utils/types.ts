export interface PeerMetadata {
  displayName: string;
  avatarUrl: string;
  isHandRaised: boolean;
}

// create a type with key of string and value of string
export type Recording = Record<string, string>;

export type roomDetails = {
  audioRecordings: Recording[];
  videoRecordings: Recording[];
  backgrounds: string[];
  activeBackground: string;
  recordings: string[];
  layout: 1 | 2;
};

export interface RoomData {
  background: string;
}

export type Answer = {
  answer: string;
  author: string;
};

export type Votes = {
  voter: string[];
  votes: number;
};

export type Question = {
  [key: string]: {
    authorName: string;
    authorId: string;
    question: string;
    upvotes: Votes;
    answers: Answer[];
    isAnswered: boolean;
  };
};

export type Poll = {
  [key: string]: {
    question: string;
    options: string[];
    votes: number[];
  };
};

export interface RoomMetadata {
  questions: Question[];
  polls: Poll[];
}
