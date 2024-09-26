import { create } from "zustand";

export interface IChatMessage {
  name: string;
  text: string;
  isUser: boolean;
  fileName?: string;
}

export interface BoxPosition {
  x: number;
  y: number;
  width: string;
  height: string;
}

interface StudioState {
  name: string;
  setName: (name: string) => void;
  avatarUrl: string;
  setAvatarUrl: (val: string) => void;
  myReaction: string;
  setMyReaction: (val: string) => void;
  isChatOpen: boolean;
  setIsChatOpen: (isChatOpen: boolean) => void;
  isQnAOpen: boolean;
  setIsQnAOpen: (isQnAOpen: boolean) => void;
  isPollsOpen: boolean;
  setIsPollsOpen: (isPollsOpen: boolean) => void;
  isMediaOpen: boolean;
  setIsMediaOpen: (isMediaOpen: boolean) => void;
  isParticipantsOpen: boolean;
  setIsParticipantsOpen: (isParticipantsOpen: boolean) => void;
  audioInputDevice: MediaDeviceInfo;
  setAudioInputDevice: (audioInputDevice: MediaDeviceInfo) => void;
  videoDevice: MediaDeviceInfo;
  setVideoDevice: (videoDevice: MediaDeviceInfo) => void;
  audioOutputDevice: MediaDeviceInfo;
  setAudioOutputDevice: (audioOutputDevice: MediaDeviceInfo) => void;
  showAcceptRequest: boolean;
  setShowAcceptRequest: (val: boolean) => void;
  requestedPeers: string[];
  addRequestedPeers: (val: string) => void;
  removeRequestedPeers: (val: string) => void;
  chatMessages: IChatMessage[];
  addChatMessage: (val: IChatMessage) => void;
  activeBg: string;
  setActiveBg: (val: string) => void;
  boxPosition: BoxPosition;
  setBoxPosition: (val: BoxPosition) => void;
  isRecording: boolean | null;
  setIsRecording: (val: boolean | null) => void;
  isLiveStreaming: boolean;
  setIsLiveStreaming: (val: boolean) => void;
  isUploading: boolean;
  setIsUploading: (val: boolean) => void;
  isRecordAudio: boolean;
  setIsRecordAudio: (val: boolean) => void;
  isRecordVideo: boolean;
  setIsRecordVideo: (val: boolean) => void;
  layout: 1 | 2;
  setLayout: (val: 1 | 2) => void;
  isScreenShared: boolean;
  setIsScreenShared: (val: boolean) => void;
  isRoomClosed: boolean;
  setIsRoomClosed: (val: boolean) => void;
}

export const useStudioState = create<StudioState>((set) => ({
  name: "",
  setName: (name) => set({ name }),
  avatarUrl:
    "https://gateway.lighthouse.storage/ipfs/bafkreifr3lnl4mpiedaxwzibjbszwf7zosptwt5oqpfydwun33a6ujsjau",
  setAvatarUrl: (val: string) => {
    set(() => ({
      avatarUrl: val,
    }));
  },
  myReaction: "",
  setMyReaction: (val: string) => {
    set(() => ({
      myReaction: val,
    }));
  },
  isChatOpen: false,
  setIsChatOpen: (isChatOpen) => {
    set({ isChatOpen });
    set({ isMediaOpen: false });
    set({ isParticipantsOpen: false });
  },
  isQnAOpen: false,
  setIsQnAOpen: (isQnAOpen) => {
    set({ isQnAOpen }), set({ isChatOpen: false });
    set({ isMediaOpen: false });
    set({ isParticipantsOpen: false });
    set({ isPollsOpen: false });
  },
  isPollsOpen: false,
  setIsPollsOpen: (isPollsOpen) => {
    set({ isPollsOpen });
    set({ isChatOpen: false });
    set({ isMediaOpen: false });
    set({ isQnAOpen: false });
    set({ isParticipantsOpen: false });
  },
  isMediaOpen: false,
  setIsMediaOpen: (isMediaOpen) => {
    set({ isMediaOpen });
    set({ isChatOpen: false });
    set({ isParticipantsOpen: false });
    set({ isQnAOpen: false });
    set({ isPollsOpen: false });
  },
  isParticipantsOpen: false,
  setIsParticipantsOpen: (isParticipantsOpen) => {
    set({ isParticipantsOpen });
    set({ isChatOpen: false });
    set({ isMediaOpen: false });
    set({ isQnAOpen: false });
    set({ isPollsOpen: false });
  },
  audioInputDevice: {} as MediaDeviceInfo,
  setAudioInputDevice: (audioInputDevice) => set({ audioInputDevice }),
  videoDevice: {} as MediaDeviceInfo,
  setVideoDevice: (videoDevice) => set({ videoDevice }),
  audioOutputDevice: {} as MediaDeviceInfo,
  setAudioOutputDevice: (audioOutputDevice) => set({ audioOutputDevice }),
  showAcceptRequest: false,
  setShowAcceptRequest: (val) => set({ showAcceptRequest: val }),
  requestedPeers: [],
  addRequestedPeers: (val: string) => {
    set((state) => ({
      requestedPeers: [...state.requestedPeers, val],
    }));
  },
  removeRequestedPeers: (val: string) => {
    set((state) => ({
      requestedPeers: state.requestedPeers.filter((peer) => peer !== val),
    }));
  },
  chatMessages: [],
  addChatMessage: (val: IChatMessage) => {
    set((state) => ({
      chatMessages: [...state.chatMessages, val],
    }));
  },
  activeBg: "bg-black",
  setActiveBg: (val: string) => set({ activeBg: val }),
  boxPosition: { x: 0, y: 0, width: "200", height: "200" },
  setBoxPosition: (val: BoxPosition) => set({ boxPosition: val }),
  isRecording: null,
  setIsRecording: (val: boolean | null) => set({ isRecording: val }),
  isLiveStreaming: false,
  setIsLiveStreaming: (val: boolean) => set({ isLiveStreaming: val }),
  isUploading: false,
  setIsUploading: (val: boolean) => set({ isUploading: val }),
  isRecordAudio: false,
  setIsRecordAudio: (val: boolean) => set({ isRecordAudio: val }),
  isRecordVideo: false,
  setIsRecordVideo: (val: boolean) => set({ isRecordVideo: val }),
  layout: 1,
  setLayout: (val: 1 | 2) => set({ layout: val }),
  isScreenShared: false,
  setIsScreenShared: (val: boolean) => set({ isScreenShared: val }),
  isRoomClosed: false,
  setIsRoomClosed: (val: boolean) => set({ isRoomClosed: val }),
}));
