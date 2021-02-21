import { TODO } from "./todo";
import { User } from "./user";

export interface RetroItem {
  id: string;
  content: string;
  likedBy: {
    [userId: string]: User["id"];
  };
  likeCount: number;
  createdAt: TODO;
  createdByUserId: string;
  hasBeenEdited?: boolean;
  isAnonymous?: boolean;
}
