import { RetroColumnType } from "./retro-column";
import { TODO } from "./todo";
import { User } from "./user";
import { Workspace } from "./workspace";

export interface RetroItem {
  id: string;
  workspaceId: Workspace["id"];
  type: RetroColumnType;
  content: string;
  createdByUserId: string;
  createdAt: TODO;
  likedBy: {
    [userId: string]: User["id"];
  };
  likeCount: number;
  hasBeenEdited: boolean;
}
