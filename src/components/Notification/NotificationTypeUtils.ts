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

export interface NotificationProps {
  notifications: Notification[];
}

export interface NotificationTileProps {
  data: Notification;
  index: number;
  length: number;
}
