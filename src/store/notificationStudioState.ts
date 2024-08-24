import { create } from "zustand";
import { Notification } from "@/components/Notification/NotificationTypeUtils";

interface NotificationStudioState {
  notifications: Notification[];
  newNotifications: Notification[];
  combinedNotifications: Notification[];
  addNotification: (notification: Notification) => void;
  setNotifications: (
    notifications: Notification[] | ((prev: Notification[]) => Notification[])
  ) => void;
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
    setNotifications: (
      notifications: Notification[] | ((prev: Notification[]) => Notification[])
    ) =>
      set((state) => ({
        notifications:
          typeof notifications === "function"
            ? notifications(state.notifications)
            : notifications,
      })),
    setNewNotifications: (newNotifications) => set({ newNotifications }),
    // updateCombinedNotifications: () =>
    //   set((state) => ({
    //     combinedNotifications: [
    //       ...state.notifications,
    //       ...state.newNotifications,
    //     ].sort(
    //       (a, b) =>
    //         new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    //     ),
    //   })),
    updateCombinedNotifications: () =>
      set((state) => {
        const uniqueNotifications = [
          ...state.notifications,
          ...state.newNotifications,
        ].reduce<Notification[]>((acc, current) => {
          const x = acc.find((item) => item._id === current._id);
          if (!x) {
            return [...acc, current];
          } else {
            // If the notification already exists, update it if necessary
            return acc.map((item) =>
              item._id === current._id ? current : item
            );
          }
        }, []);

        return {
          combinedNotifications: uniqueNotifications.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          ),
        };
      }),
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
