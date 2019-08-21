/// <reference types="react-scripts" />

interface RetroItem {
  id: string;
  content: string;
  likeCount: number;
  createdBy: string;
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
  columns: { [key: string]: RetroColumn };
  columnOrder: RetroColumnType[];
}

interface RetroUser {
  uid: string;
  email: string;
  displayName?: string;
  photoURL: string;
  workspaceId?: string;
}
