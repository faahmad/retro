/// <reference types="react-scripts" />

type RetroWorkspaceUserType = "owner" | "member";
interface RetroWorkspace {
  uid: string;
  createdAt: any;
  createdBy: RetroUser["uid"];
  displayName: string;
  users: {
    [userId: string]: RetroWorkspaceUserType;
  };
  retroBoards?: {
    [retroBoardId: string]: boolean;
  };
}

interface RetroUserInvite {
  uid: string;
  workspaceId: string;
  createdBy: RetroUser["uid"];
  createdAt: any;
}

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
  uid?: string;
  workspaceId: RetroWorkspace["uid"];
  items: { [key: string]: RetroItem };
  columns: { [key: string]: RetroColumn };
  columnOrder: RetroColumnType[];
  createdAt: any;
}

interface RetroUser {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  workspaceId?: string;
}
