/// <reference types="react-scripts" />

interface RetroItem {
  id: string;
  content: string;
  likedBy: {
    [userDisplayName: string]: boolean;
  };
  likeCount: number;
  createdByDisplayName: string;
  createdByUserId: string;
  createdByPhotoURL?: string;
}

type RetroColumnType = "good" | "bad" | "actions" | "questions";
type RetroColumnButtonClassName = "success" | "danger" | "primary" | "info";

interface RetroColumn {
  type: RetroColumnType;
  title: string;
  buttonClassName: RetroColumnButtonClassName;
  itemIds: RetroItem["id"][];
}

interface RetroBoard {
  uid: string;
  items: { [key: string]: RetroItem };
  createdAt: firebase.firestore.Timestamp;
  columns: { [key: string]: RetroColumn };
  columnOrder: RetroColumnType[];
}

interface RetroUser {
  uid: string;
  email: string;
  displayName?: string;
  photoURL: string;
  workspaceId?: string;
  workspaceDisplayName?: string;
}
