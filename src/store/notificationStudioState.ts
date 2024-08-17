import { create } from "zustand";

export interface Notification {
  id?: string;
  _id?: string;
  receiver_address: string;
  content: string;
  createdAt: number;
  read_status: boolean;
  notification_name: string;
  notification_title: string;
  notification_type: string;
}

interface NotificationStudioState {
  notifications: Notification[];
  newNotifications: Notification[];
  combinedNotifications: Notification[];
  addNotification: (notification: Notification) => void;
  setNotifications: (notifications: Notification[]) => void;
  setNewNotifications: (notifications: Notification[]) => void;
  updateCombinedNotifications: () => void;
  hasAnyUnreadNotification: boolean;
  setHasAnyUnreadNotification: (hasUnread: boolean) => void;
  markAllAsRead: () => void;
  canFetch: boolean;
  setCanFetch: (isAllowed: boolean) => void;
}

export const useNotificationStudioState = create<NotificationStudioState>(
  (set, get) => ({
    notifications: [],
    newNotifications: [],
    combinedNotifications: [],
    addNotification: (notification) =>
      set((state) => {
        const updatedNewNotifications = [
          ...state.newNotifications,
          notification,
        ];
        return {
          newNotifications: updatedNewNotifications,
          hasAnyUnreadNotification: true,
        };
      }),
    setNotifications: (notifications) => set({ notifications }),
    setNewNotifications: (newNotifications) => set({ newNotifications }),
    updateCombinedNotifications: () =>
      set((state) => ({
        combinedNotifications: [
          ...state.notifications,
          ...state.newNotifications,
        ].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ),
      })),
    hasAnyUnreadNotification: false,
    setHasAnyUnreadNotification: (hasUnread) =>
      set({ hasAnyUnreadNotification: hasUnread }),
    markAllAsRead: () =>
      set((state) => ({
        notifications: state.notifications.map((n) => ({
          ...n,
          read_status: true,
        })),
        newNotifications: state.newNotifications.map((n) => ({
          ...n,
          read_status: true,
        })),
        hasAnyUnreadNotification: false,
      })),
    canFetch: false,
    setCanFetch: (isAllowed) => set({ canFetch: isAllowed }),
  })
);
