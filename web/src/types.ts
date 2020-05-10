export type Id = string;

export interface RetroItem {
  id: Id;
  content: string;
  likedBy: {
    [userDisplayName: string]: boolean;
  };
  likeCount: number;
  createdByDisplayName: string;
  createdByUserId: string;
  createdByPhotoURL?: string;
  hasBeenEdited?: boolean;
}

export type RetroColumnType = "good" | "bad" | "actions" | "questions";

export interface RetroColumn {
  type: RetroColumnType;
  title: string;
  itemIds: RetroItem["id"][];
}

export interface CreateRetroBoardInput {
  id: Id;
  workspaceId: Id;
  teamId: Id;
  createdById: Id;
}

export interface RetroBoard {
  id: Id;
  workspaceId: Id;
  teamId: Id;
  createdById: Id;
  items: { [key: string]: RetroItem };
  columns: { [key: string]: RetroColumn };
  columnOrder: RetroColumnType[];
}
