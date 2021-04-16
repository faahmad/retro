import { Retro } from "./retro";
import { RetroColumnType } from "./retro-column";
import { TODO } from "./todo";
import { User } from "./user";
import { Workspace } from "./workspace";

export interface RetroItemsMap {
  [retroItemId: string]: RetroItem;
}

export interface RetroItem {
  id: string;
  workspaceId: Workspace["id"];
  retroIds: {
    [retroId: string]: Retro["id"];
  };
  type: RetroColumnType;
  content: string;
  createdByUserId: string;
  createdAt: TODO;
  likedBy: {
    [userId: string]: User["id"];
  };
  likeCount: number;
  hasBeenEdited: boolean;
  status?: "deleted";
}
